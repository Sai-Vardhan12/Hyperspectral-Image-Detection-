# HyperVision — Hyperspectral Image Object Detection
### PCA + CNN · Patch-Based Prediction · FastAPI + React

---

## Project Structure

```
hyperspectral-app/
├── backend/
│   ├── main.py                         ← FastAPI entry point
│   ├── requirements.txt
│   ├── preprocessing/
│   │   ├── __init__.py
│   │   └── normalize.py                ← Image loading, normalization, hyperspectral simulation
│   ├── patch_extraction/
│   │   ├── __init__.py
│   │   └── extractor.py                ← Divide image into patches
│   ├── pca_module/
│   │   ├── __init__.py
│   │   └── pca_reducer.py              ← PCA per patch + false-color visualization
│   ├── cnn_model/
│   │   ├── __init__.py
│   │   └── model.py                    ← 1D SpectralCNN (PyTorch)
│   ├── prediction/
│   │   ├── __init__.py
│   │   └── predictor.py                ← Overlay + heatmap + JSON summary
│   └── api/
│       ├── __init__.py
│       └── routes.py                   ← POST /predict endpoint
│
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── components/
        │   ├── Navbar.jsx
        │   ├── HeroSection.jsx
        │   ├── StepIndicator.jsx
        │   └── LoadingAnimation.jsx
        ├── upload/
        │   └── UploadPanel.jsx
        ├── visualization/
        │   ├── BeforeAfterSlider.jsx
        │   └── ResultViewer.jsx
        └── pages/
            └── Home.jsx
```

---

## Quick Start

### 1 — Backend Setup

```bash
cd backend

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the API server
uvicorn main:app --reload --port 8000
```

API will be live at: **http://localhost:8000**

Swagger docs: **http://localhost:8000/docs**

---

### 2 — Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend will be live at: **http://localhost:5173**

---

## How It Works

### Pipeline (Backend)

```
Upload Image
    ↓
Load & Decode (OpenCV)
    ↓
Simulate Hyperspectral Cube → (H, W, 30 bands)
    ↓
Extract Patches → List of (16×16, 30) arrays
    ↓
PCA per Patch → (N_patches, 10) feature vectors
    ↓
SpectralCNN → predicted class + confidence per patch
    ↓
Reconstruct Visualizations:
  • Patch color overlay (OpenCV blending)
  • PCA false-color image
  • Confidence heatmap (cv2.COLORMAP_JET)
    ↓
Return: base64 PNGs + JSON prediction summary
```

### Detection Classes

| Class       | Color     |
|-------------|-----------|
| Vegetation  | #228B22   |
| Urban       | #808080   |
| Water Body  | #1E90FF   |
| Barren Land | #D2B48C   |
| Anomaly     | #DC143C   |

---

## API Reference

### `POST /predict`

**Form Data:**

| Field            | Type    | Default | Description                  |
|-----------------|---------|---------|------------------------------|
| `file`           | File    | —       | Image file (PNG/JPG/TIFF)   |
| `patch_size`     | int     | 16      | Patch size: 8, 16, or 32    |
| `n_pca_components` | int  | 10      | PCA components per patch    |
| `n_classes`      | int     | 5       | Number of CNN output classes |
| `n_bands`        | int     | 30      | Simulated spectral bands     |

**Response JSON:**

```json
{
  "success": true,
  "images": {
    "original":   "<base64 PNG>",
    "pca_view":   "<base64 PNG>",
    "prediction": "<base64 PNG>",
    "heatmap":    "<base64 PNG>"
  },
  "predictions": {
    "prediction_map":     [[0, 1, 2, ...]],
    "confidence_map":     [[0.87, 0.63, ...]],
    "class_distribution": {
      "Vegetation":  {"count": 42, "percentage": 35.0, "color": "#228B22"},
      ...
    },
    "patch_size":         16,
    "grid_shape":         [16, 16],
    "total_patches":      256,
    "mean_confidence":    0.7231,
    "n_pca_components":   10,
    "n_bands":            30,
    "image_size":         [256, 256]
  }
}
```

---

## Using Real Hyperspectral Data

By default the app simulates a 30-band hyperspectral cube from any RGB image.

To use real `.npy` hyperspectral data, modify `preprocessing/normalize.py`:

```python
def load_hyperspectral_npy(path: str) -> np.ndarray:
    """Load a real (H, W, Bands) float32 hyperspectral array."""
    cube = np.load(path).astype(np.float32)
    # Normalize per band
    for b in range(cube.shape[2]):
        mn, mx = cube[:,:,b].min(), cube[:,:,b].max()
        cube[:,:,b] = (cube[:,:,b] - mn) / (mx - mn + 1e-8)
    return cube
```

Recommended datasets:
- **Indian Pines** (145×145, 200 bands) — agriculture
- **Pavia University** (610×340, 103 bands) — urban
- **Salinas** (512×217, 204 bands) — vegetation

---

## Loading a Pre-Trained CNN

Replace `initialize_with_random_weights()` in `cnn_model/model.py`:

```python
def load_pretrained(model: SpectralCNN, path: str) -> SpectralCNN:
    state = torch.load(path, map_location="cpu")
    model.load_state_dict(state)
    return model
```

Then in `api/routes.py`:
```python
model = load_pretrained(model, "weights/spectral_cnn.pt")
```

---

## Build for Production

```bash
# Frontend
cd frontend
npm run build        # Output: frontend/dist/

# Backend (with gunicorn)
cd backend
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

---

## Tech Stack

| Layer      | Technology                               |
|-----------|------------------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS, Framer Motion, Axios |
| Backend   | Python 3.10+, FastAPI, Uvicorn           |
| ML        | PyTorch (SpectralCNN), Scikit-learn (PCA) |
| Vision    | OpenCV, NumPy, Pillow                    |

---

*HyperVision — built for hyperspectral research and demonstration.*
