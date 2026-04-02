"""
api/routes.py
FastAPI routes: POST /predict
"""

import io
import base64
import numpy as np
import cv2
from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from fastapi.responses import JSONResponse
from PIL import Image
from typing import Optional

from preprocessing import load_image, simulate_hyperspectral, get_rgb_preview
from patch_extraction import extract_patches
from pca_module import apply_pca_to_patches, build_pca_visualization
from cnn_model import build_model, initialize_with_random_weights, predict_batch
from prediction import draw_prediction_overlay, build_heatmap_overlay, build_prediction_summary

router = APIRouter()


def encode_image_to_base64(img_rgb: np.ndarray) -> str:
    """Encode a (H, W, 3) uint8 RGB array to base64 PNG string."""
    pil_img = Image.fromarray(img_rgb.astype(np.uint8))
    buffer = io.BytesIO()
    pil_img.save(buffer, format="PNG", optimize=True)
    buffer.seek(0)
    return base64.b64encode(buffer.read()).decode("utf-8")


def resize_for_processing(img: np.ndarray, patch_size: int, max_dim: int = 256) -> np.ndarray:
    """Resize image so both dims are multiples of patch_size, max max_dim."""
    H, W = img.shape[:2]
    scale = min(max_dim / max(H, W), 1.0)
    new_H = max(patch_size, (int(H * scale) // patch_size) * patch_size)
    new_W = max(patch_size, (int(W * scale) // patch_size) * patch_size)
    return cv2.resize(img, (new_W, new_H), interpolation=cv2.INTER_AREA)


@router.post("/predict")
async def predict(
    file: UploadFile = File(...),
    patch_size: int = Form(16),
    n_pca_components: int = Form(10),
    n_classes: int = Form(5),
    n_bands: int = Form(30),
):
    """
    Main prediction endpoint.

    Steps:
    1. Load & validate uploaded image
    2. Simulate hyperspectral cube
    3. Extract patches
    4. PCA dimensionality reduction
    5. CNN classification
    6. Overlay visualizations
    7. Return base64 images + prediction JSON
    """
    # --- Validate patch_size ---
    if patch_size not in [8, 16, 32]:
        raise HTTPException(status_code=400, detail="patch_size must be 8, 16, or 32.")

    # --- Load image ---
    try:
        raw_bytes = await file.read()
        original_img = load_image(raw_bytes)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Image load error: {str(e)}")

    # Keep original for display (resize to reasonable size)
    display_img = cv2.resize(original_img, (512, 512), interpolation=cv2.INTER_AREA)

    # Resize for processing (must be divisible by patch_size)
    proc_img = resize_for_processing(original_img, patch_size, max_dim=256)
    H, W = proc_img.shape[:2]

    # --- Simulate hyperspectral cube ---
    hypercube = simulate_hyperspectral(proc_img, n_bands=n_bands)  # (H, W, n_bands)

    # --- Extract patches ---
    patches, positions, grid_shape = extract_patches(hypercube, patch_size=patch_size)
    if len(patches) == 0:
        raise HTTPException(status_code=422, detail="No patches could be extracted. Try a smaller patch size.")

    # --- PCA reduction ---
    pca_features, explained_var = apply_pca_to_patches(patches, n_components=n_pca_components)

    # --- CNN prediction ---
    model = build_model(n_features=pca_features.shape[1], n_classes=n_classes)
    model = initialize_with_random_weights(model)
    labels, confidences = predict_batch(model, pca_features, device="cpu")

    # --- Build visualization images ---
    # 1. PCA false-color image
    pca_vis = build_pca_visualization(patches, (H, W), positions, patch_size, n_components=3)
    pca_vis_display = cv2.resize(pca_vis, (512, 512), interpolation=cv2.INTER_NEAREST)

    # Get RGB preview of processed image for overlay
    rgb_preview = get_rgb_preview(hypercube)

    # 2. Patch overlay prediction image
    predicted_overlay = draw_prediction_overlay(
        rgb_preview, labels, positions, patch_size, confidences, alpha=0.50
    )
    predicted_display = cv2.resize(predicted_overlay, (512, 512), interpolation=cv2.INTER_NEAREST)

    # 3. Heatmap confidence visualization
    heatmap_img = build_heatmap_overlay(
        rgb_preview, confidences, positions, patch_size, alpha=0.55
    )
    heatmap_display = cv2.resize(heatmap_img, (512, 512), interpolation=cv2.INTER_NEAREST)

    # --- Build prediction summary ---
    summary = build_prediction_summary(labels, confidences, positions, patch_size, (H, W))
    summary["explained_variance"] = [round(float(v), 4) for v in explained_var]
    summary["n_pca_components"] = n_pca_components
    summary["n_bands"] = n_bands
    summary["image_size"] = [H, W]

    return JSONResponse({
        "success": True,
        "images": {
            "original":   encode_image_to_base64(display_img),
            "pca_view":   encode_image_to_base64(pca_vis_display),
            "prediction": encode_image_to_base64(predicted_display),
            "heatmap":    encode_image_to_base64(heatmap_display),
        },
        "predictions": summary,
    })
