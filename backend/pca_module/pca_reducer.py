"""
pca_module/pca_reducer.py
Applies PCA to each patch to reduce spectral dimensionality.
"""

import numpy as np
from sklearn.decomposition import PCA
from typing import List, Tuple


def apply_pca_to_patches(
    patches: List[np.ndarray],
    n_components: int = 10
) -> Tuple[np.ndarray, np.ndarray]:
    """
    Flatten each patch and apply PCA to reduce band dimensionality.

    Args:
        patches      : list of (patch_size, patch_size, Bands) arrays
        n_components : number of PCA components to keep

    Returns:
        pca_features : (N, n_components) float32 array — one vector per patch
        explained_var: (n_components,) array of explained variance ratios
    """
    patch_size = patches[0].shape[0]
    bands = patches[0].shape[2]

    # Flatten each patch to a 1D spectral vector (mean over spatial dims)
    flat_patches = np.array([
        p.reshape(-1, bands).mean(axis=0) for p in patches
    ], dtype=np.float32)  # (N, Bands)

    n_components = min(n_components, bands, len(patches))
    pca = PCA(n_components=n_components, whiten=True)
    pca_features = pca.fit_transform(flat_patches).astype(np.float32)

    return pca_features, pca.explained_variance_ratio_


def build_pca_visualization(
    patches: List[np.ndarray],
    image_shape: Tuple[int, int],
    positions: list,
    patch_size: int,
    n_components: int = 3
) -> np.ndarray:
    """
    Create a false-color PCA visualization image.
    Maps the first 3 PCA components to R, G, B.

    Returns: (H, W, 3) uint8 image
    """
    import cv2
    H, W = image_shape
    bands = patches[0].shape[2]

    flat_patches = np.array([
        p.reshape(-1, bands).mean(axis=0) for p in patches
    ], dtype=np.float32)

    n_comp = min(3, bands, len(patches))
    pca = PCA(n_components=n_comp, whiten=True)
    comps = pca.fit_transform(flat_patches)  # (N, 3)

    # Normalize to [0, 255]
    for i in range(comps.shape[1]):
        mn, mx = comps[:, i].min(), comps[:, i].max()
        comps[:, i] = (comps[:, i] - mn) / (mx - mn + 1e-8) * 255

    pca_img = np.zeros((H, W, 3), dtype=np.uint8)
    for idx, (y, x) in enumerate(positions):
        rgb = comps[idx, :3].astype(np.uint8) if n_comp == 3 else np.array([comps[idx, 0]] * 3, dtype=np.uint8)
        pca_img[y:y + patch_size, x:x + patch_size] = rgb

    return pca_img
