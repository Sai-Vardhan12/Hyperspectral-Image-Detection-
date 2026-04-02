"""
cnn_model/model.py
Lightweight CNN for patch-based hyperspectral classification.
Input: (N, n_components) feature vectors from PCA.
This 1D CNN treats PCA features as a "spectral sequence".
"""

import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np
from typing import Tuple


class SpectralCNN(nn.Module):
    """
    1D Convolutional Neural Network for spectral feature classification.
    Input shape: (batch, 1, n_features)
    """

    def __init__(self, n_features: int = 10, n_classes: int = 5):
        super(SpectralCNN, self).__init__()

        self.conv1 = nn.Conv1d(1, 32, kernel_size=3, padding=1)
        self.bn1 = nn.BatchNorm1d(32)

        self.conv2 = nn.Conv1d(32, 64, kernel_size=3, padding=1)
        self.bn2 = nn.BatchNorm1d(64)

        self.pool = nn.AdaptiveAvgPool1d(4)  # reduce to length 4

        self.fc1 = nn.Linear(64 * 4, 128)
        self.dropout = nn.Dropout(0.3)
        self.fc2 = nn.Linear(128, n_classes)

    def forward(self, x):
        # x: (batch, n_features) -> (batch, 1, n_features)
        x = x.unsqueeze(1)

        x = F.relu(self.bn1(self.conv1(x)))
        x = F.relu(self.bn2(self.conv2(x)))
        x = self.pool(x)

        x = x.view(x.size(0), -1)
        x = F.relu(self.fc1(x))
        x = self.dropout(x)
        x = self.fc2(x)

        return x  # raw logits


def build_model(n_features: int = 10, n_classes: int = 5) -> SpectralCNN:
    model = SpectralCNN(n_features=n_features, n_classes=n_classes)
    return model


def initialize_with_random_weights(model: SpectralCNN) -> SpectralCNN:
    """
    Initialize with random weights (simulates untrained / demo model).
    In production, load pre-trained weights here.
    """
    for m in model.modules():
        if isinstance(m, nn.Conv1d):
            nn.init.kaiming_normal_(m.weight)
        elif isinstance(m, nn.Linear):
            nn.init.xavier_normal_(m.weight)
    return model


def predict_batch(
    model: SpectralCNN,
    features: np.ndarray,
    device: str = "cpu"
) -> Tuple[np.ndarray, np.ndarray]:
    """
    Run inference on PCA feature batch.

    Args:
        model   : SpectralCNN instance
        features: (N, n_features) float32 array
        device  : torch device string

    Returns:
        labels      : (N,) int array of predicted class indices
        confidences : (N,) float array of max softmax confidence
    """
    model.eval()
    model.to(device)

    tensor = torch.tensor(features, dtype=torch.float32).to(device)

    with torch.no_grad():
        logits = model(tensor)
        probs = F.softmax(logits, dim=1).cpu().numpy()

    labels = probs.argmax(axis=1)
    confidences = probs.max(axis=1)

    return labels, confidences
