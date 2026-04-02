"""
preprocessing/normalize.py
Handles loading and normalizing hyperspectral / standard images.
"""

import numpy as np
import cv2
from PIL import Image


def load_image(file_bytes: bytes) -> np.ndarray:
    """
    Load image from raw bytes into a NumPy array (H, W, C).
    Supports standard RGB images and treats each channel as a spectral band.
    For true hyperspectral (.npy/.mat), extend here.
    """
    np_arr = np.frombuffer(file_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("Could not decode image. Ensure file is a valid image format.")
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    return img


def normalize_image(img: np.ndarray) -> np.ndarray:
    """
    Normalize pixel values to [0, 1] float32.
    """
    return img.astype(np.float32) / 255.0


def simulate_hyperspectral(img: np.ndarray, n_bands: int = 30) -> np.ndarray:
    """
    Simulate a hyperspectral cube from an RGB image by:
    - Using Gaussian-blurred and frequency-shifted copies of channels
    This lets us demo PCA + CNN on any uploaded image.
    Returns: (H, W, n_bands) float32 array
    """
    H, W, _ = img.shape
    bands = []
    base = img.astype(np.float32) / 255.0

    for i in range(n_bands):
        channel_idx = i % 3
        sigma = 1.0 + (i * 0.4)
        band = cv2.GaussianBlur(base[:, :, channel_idx], (0, 0), sigma)
        noise = np.random.normal(0, 0.01, band.shape).astype(np.float32)
        band = np.clip(band + noise + (i * 0.005), 0, 1)
        bands.append(band)

    hypercube = np.stack(bands, axis=-1)  # (H, W, n_bands)
    return hypercube


def get_rgb_preview(hypercube: np.ndarray) -> np.ndarray:
    """
    Extract a 3-band RGB preview from hyperspectral cube (uint8).
    """
    r = hypercube[:, :, 0]
    g = hypercube[:, :, min(10, hypercube.shape[2] - 1)]
    b = hypercube[:, :, min(20, hypercube.shape[2] - 1)]
    rgb = np.stack([r, g, b], axis=-1)
    rgb = (rgb * 255).clip(0, 255).astype(np.uint8)
    return rgb
