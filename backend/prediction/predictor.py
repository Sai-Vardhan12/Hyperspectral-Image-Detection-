"""
prediction/predictor.py
Full prediction pipeline + OpenCV visualization.
"""

import numpy as np
import cv2
from typing import List, Tuple, Dict


# Class label names and associated BGR colors for visualization
CLASS_CONFIG = {
    0: {"name": "Vegetation",   "color": (34,  139, 34),   "hex": "#228B22"},
    1: {"name": "Urban",        "color": (128, 128, 128),  "hex": "#808080"},
    2: {"name": "Water Body",   "color": (30,  144, 255),  "hex": "#1E90FF"},
    3: {"name": "Barren Land",  "color": (210, 180, 140),  "hex": "#D2B48C"},
    4: {"name": "Anomaly",      "color": (220, 20,  60),   "hex": "#DC143C"},
}


def colorize_predictions(
    labels: np.ndarray,
    positions: List[Tuple[int, int]],
    patch_size: int,
    image_shape: Tuple[int, int],
    confidences: np.ndarray
) -> np.ndarray:
    """
    Paint each patch with the class color (alpha-blended for confidence).
    Returns (H, W, 3) uint8 BGR image.
    """
    H, W = image_shape
    color_map = np.zeros((H, W, 3), dtype=np.uint8)

    for idx, (y, x) in enumerate(positions):
        cls = int(labels[idx])
        conf = float(confidences[idx])
        bgr = CLASS_CONFIG.get(cls, CLASS_CONFIG[0])["color"]
        # Scale brightness by confidence
        scaled = tuple(int(c * (0.5 + 0.5 * conf)) for c in bgr)
        color_map[y:y + patch_size, x:x + patch_size] = scaled

    return color_map


def draw_prediction_overlay(
    original_rgb: np.ndarray,
    labels: np.ndarray,
    positions: List[Tuple[int, int]],
    patch_size: int,
    confidences: np.ndarray,
    alpha: float = 0.45
) -> np.ndarray:
    """
    Blend original RGB image with colored patch predictions.
    Also draws bounding boxes on high-confidence anomaly patches.

    Returns: (H, W, 3) uint8 RGB image
    """
    H, W = original_rgb.shape[:2]
    orig_bgr = cv2.cvtColor(original_rgb, cv2.COLOR_RGB2BGR)

    # 1) Colored patch overlay
    color_layer = colorize_predictions(labels, positions, patch_size, (H, W), confidences)
    blended = cv2.addWeighted(orig_bgr, 1 - alpha, color_layer, alpha, 0)

    # 2) Draw class labels + bounding boxes on each patch
    for idx, (y, x) in enumerate(positions):
        cls = int(labels[idx])
        conf = float(confidences[idx])
        cfg = CLASS_CONFIG.get(cls, CLASS_CONFIG[0])
        color = cfg["color"]

        # Draw thin rectangle border on every patch
        cv2.rectangle(blended, (x, y), (x + patch_size, y + patch_size), color, 1)

        # Draw thicker box + label on high-confidence detections
        if conf > 0.6:
            cv2.rectangle(blended, (x, y), (x + patch_size, y + patch_size), color, 2)
            label_text = f"{cfg['name'][:3]} {conf:.2f}"
            font_scale = 0.28
            cv2.putText(blended, label_text, (x + 2, y + patch_size - 3),
                        cv2.FONT_HERSHEY_SIMPLEX, font_scale, (255, 255, 255), 1, cv2.LINE_AA)

    return cv2.cvtColor(blended, cv2.COLOR_BGR2RGB)


def build_heatmap_overlay(
    original_rgb: np.ndarray,
    confidences: np.ndarray,
    positions: List[Tuple[int, int]],
    patch_size: int,
    alpha: float = 0.5
) -> np.ndarray:
    """
    Generate a heatmap showing prediction confidence across the image.
    Returns (H, W, 3) uint8 RGB image.
    """
    H, W = original_rgb.shape[:2]
    heat_gray = np.zeros((H, W), dtype=np.float32)

    for idx, (y, x) in enumerate(positions):
        heat_gray[y:y + patch_size, x:x + patch_size] = confidences[idx]

    heat_norm = (heat_gray * 255).clip(0, 255).astype(np.uint8)
    heatmap_bgr = cv2.applyColorMap(heat_norm, cv2.COLORMAP_JET)
    orig_bgr = cv2.cvtColor(original_rgb, cv2.COLOR_RGB2BGR)
    blended = cv2.addWeighted(orig_bgr, 1 - alpha, heatmap_bgr, alpha, 0)
    return cv2.cvtColor(blended, cv2.COLOR_BGR2RGB)


def build_prediction_summary(
    labels: np.ndarray,
    confidences: np.ndarray,
    positions: List[Tuple[int, int]],
    patch_size: int,
    image_shape: Tuple[int, int]
) -> Dict:
    """
    Build JSON-serializable prediction summary.
    """
    H, W = image_shape
    n_rows = H // patch_size
    n_cols = W // patch_size

    prediction_grid = labels.reshape(n_rows, n_cols).tolist()
    confidence_grid = np.round(confidences.reshape(n_rows, n_cols), 4).tolist()

    class_counts = {}
    for cls_id, cfg in CLASS_CONFIG.items():
        count = int((labels == cls_id).sum())
        pct = round(count / len(labels) * 100, 1)
        class_counts[cfg["name"]] = {
            "count": count,
            "percentage": pct,
            "color": cfg["hex"]
        }

    return {
        "prediction_map": prediction_grid,
        "confidence_map": confidence_grid,
        "class_distribution": class_counts,
        "patch_size": patch_size,
        "grid_shape": [n_rows, n_cols],
        "total_patches": len(labels),
        "mean_confidence": round(float(confidences.mean()), 4),
    }
