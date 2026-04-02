"""
patch_extraction/extractor.py
Divides a hyperspectral cube into fixed-size patches.
"""

import numpy as np
from typing import List, Tuple


def extract_patches(
    hypercube: np.ndarray,
    patch_size: int = 16
) -> Tuple[List[np.ndarray], List[Tuple[int, int]], Tuple[int, int]]:
    """
    Split hyperspectral cube into non-overlapping patches.

    Args:
        hypercube: (H, W, Bands) float32 array
        patch_size: size of each square patch (default 16)

    Returns:
        patches     : list of (patch_size, patch_size, Bands) arrays
        positions   : list of (row, col) top-left corner positions
        grid_shape  : (n_rows, n_cols) number of patches per dimension
    """
    H, W, B = hypercube.shape
    patches = []
    positions = []

    n_rows = H // patch_size
    n_cols = W // patch_size

    for r in range(n_rows):
        for c in range(n_cols):
            y = r * patch_size
            x = c * patch_size
            patch = hypercube[y:y + patch_size, x:x + patch_size, :]
            patches.append(patch)
            positions.append((y, x))

    return patches, positions, (n_rows, n_cols)


def reconstruct_image_from_labels(
    labels: np.ndarray,
    positions: List[Tuple[int, int]],
    patch_size: int,
    image_shape: Tuple[int, int],
    n_classes: int = 5
) -> np.ndarray:
    """
    Reconstruct a label map image from patch predictions.
    Returns (H, W) uint8 label image.
    """
    H, W = image_shape
    label_map = np.zeros((H, W), dtype=np.uint8)

    for idx, (y, x) in enumerate(positions):
        label_map[y:y + patch_size, x:x + patch_size] = labels[idx]

    return label_map
