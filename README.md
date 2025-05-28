# Data Art Project Documentation

## Table of Contents
1. [Introduction](#introduction)
2. [Architecture](#architecture)
3. [Installation Guide](#installation-guide)
4. [Usage Guide](#usage-guide)
5. [API Reference](#api-reference)
6. [Algorithm Details](#algorithm-details)
7. [Docker Environment](#docker-environment)
8. [Development Guide](#development-guide)
9. [Troubleshooting](#troubleshooting)
10. [Future Roadmap](#future-roadmap)

## Introduction

### Project Vision
Data Art is an experimental project that explores the intersection of data visualization and digital art. By transforming textual information into visual patterns, we create unique "data fingerprints" that represent the underlying content in an aesthetically interesting way.

### Use Cases
- **Digital Art**: Create unique artwork from favorite quotes, poems, or texts
- **Data Visualization**: Visualize text patterns and structures
- **Security**: Visual representation of text for quick comparison (visual hashing)
- **Education**: Teaching concepts of ASCII, color theory, and data representation

## Architecture

### Component Overview
```
┌─────────────────────┐
│   Input Text        │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  Text Preprocessor  │ (Future: NLTK integration)
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  ASCII Converter    │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  RGB Mapper         │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  Image Generator    │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│   PNG Output        │
└─────────────────────┘
```

### Technology Stack
- **Language**: Python 3
- **Image Processing**: Pillow (PIL Fork)
- **NLP**: NLTK (Natural Language Toolkit)
- **Containerization**: Docker
- **Version Control**: Git

## Installation Guide

### Method 1: Docker (Recommended)

#### Prerequisites
- Docker Desktop (Windows/Mac) or Docker Engine (Linux)
- At least 1GB free disk space
- Git

#### Steps
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd data-art
   ```

2. **Navigate to text directory**
   ```bash
   cd text
   ```

3. **Build Docker image**
   ```bash
   chmod +x build.sh
   ./build.sh
   ```
   
   Expected output:
   ```
   [+] Building 23.5s (8/8) FINISHED
   => [internal] load build definition from Dockerfile
   => => transferring dockerfile: 297B
   ...
   => => naming to docker.io/library/python-data-art
   ```

4. **Verify installation**
   ```bash
   docker images | grep python-data-art
   ```

### Method 2: Local Installation

#### Prerequisites
- Python 3.6 or higher
- pip package manager

#### Steps
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd data-art/text
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   pip install Pillow
   python -m nltk.downloader wordnet
   ```

## Usage Guide

### Basic Usage

#### Using Docker
1. **Start container**
   ```bash
   ./run.sh
   ```

2. **Inside container, generate art**
   ```bash
   python pil.py
   ```

3. **Check output**
   ```bash
   ls -la putPixel.png
   ```

4. **Exit container**
   ```bash
   exit
   ```

#### Using Local Installation
```bash
cd text
python pil.py
```

### Advanced Usage

#### Custom Text Input
Edit `pil.py` and modify the `text` variable:

```python
text = "Your custom text here. The longer the text, the larger the image!"
```

#### Batch Processing
Create a script to process multiple texts:

```python
import os
from pil import create_image_from_text  # Requires refactoring pil.py

texts = [
    ("quote1.txt", "To be or not to be"),
    ("quote2.txt", "Hello, World!"),
]

for filename, content in texts:
    create_image_from_text(content, f"{filename}.png")
```

## API Reference

### Current Functions

#### `get_img_dim(text)`
Calculate image dimensions for given text (currently unused).

**Parameters:**
- `text` (str): Input text to process

**Returns:**
- None (prints dimensions)

### Planned API

```python
class TextToArt:
    def __init__(self, text, preprocessing=True):
        """Initialize with text and optional preprocessing."""
        pass
    
    def remove_stopwords(self):
        """Remove common words like 'the', 'is', etc."""
        pass
    
    def lemmatize(self):
        """Reduce words to their base form."""
        pass
    
    def to_image(self, output_path, dimensions=None):
        """Convert text to image and save."""
        pass
```

## Algorithm Details

### Current Implementation

1. **Dimension Calculation**
   ```python
   height = int(math.sqrt(len(text))) / 3
   width = height
   ```
   Creates a square image based on text length.

2. **Color Mapping**
   - Characters are processed in groups of 3
   - Each character's ASCII value (0-255) becomes a color component
   - Example: "ABC" → (65, 66, 67) → Medium gray pixel

3. **Pixel Placement**
   - Pixels are placed left-to-right, top-to-bottom
   - Excess characters are truncated
   - Missing characters would result in black pixels (0,0,0)

### Color Distribution
- Lowercase letters: ASCII 97-122 (medium-high values)
- Uppercase letters: ASCII 65-90 (medium values)
- Numbers: ASCII 48-57 (low values)
- Spaces: ASCII 32 (very low value)
- Special characters: Various ranges

This creates natural color patterns where:
- Text with many spaces appears darker
- Uppercase text appears slightly darker than lowercase
- Numbers create dark regions
- Special characters add color variety

## Docker Environment

### Dockerfile Breakdown
```dockerfile
FROM python:3                    # Base Python 3 image
WORKDIR /usr/src/app            # Setup directory
COPY requirements.txt ./         # Copy dependencies
RUN pip install --no-cache-dir -r requirements.txt  # Install packages
RUN python -m nltk.downloader -d /usr/local/share/nltk_data wordnet  # NLTK data
WORKDIR /opt/work               # Working directory
```

### Volume Mounting
The `run.sh` script mounts current directory:
```bash
-v $(pwd):/opt/work
```
This allows:
- Live code editing
- Persistent output files
- No need to rebuild for code changes

### Container Management
- `--rm`: Automatically remove container after exit
- `-it`: Interactive terminal
- No persistent data inside container

## Development Guide

### Code Style
- Follow PEP 8 guidelines
- Use descriptive variable names for clarity
- Add docstrings to all functions
- Comment complex algorithms

### Testing
Currently no formal tests. Recommended approach:
```python
def test_ascii_conversion():
    assert ord('A') == 65
    assert ord('a') == 97
    assert ord(' ') == 32

def test_color_range():
    for char in "Sample Text":
        assert 0 <= ord(char) <= 255
```

### Contributing Workflow
1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Make changes and test
4. Commit with clear messages
5. Push and create pull request

### Adding New Features
Example: Adding color schemes
```python
class ColorScheme:
    def __init__(self, name):
        self.name = name
    
    def map_char_to_color(self, char):
        """Override in subclasses"""
        raise NotImplementedError

class GrayscaleScheme(ColorScheme):
    def map_char_to_color(self, char):
        val = ord(char)
        return (val, val, val)

class InvertedScheme(ColorScheme):
    def map_char_to_color(self, char):
        val = 255 - ord(char)
        return (val, val, val)
```

## Troubleshooting

### Common Issues

#### 1. Docker build fails
**Error**: `Cannot connect to Docker daemon`
**Solution**: Ensure Docker is running
```bash
sudo systemctl start docker  # Linux
# Or start Docker Desktop on Windows/Mac
```

#### 2. Permission denied on scripts
**Error**: `Permission denied: ./build.sh`
**Solution**: Make scripts executable
```bash
chmod +x build.sh run.sh
```

#### 3. Image dimensions error
**Error**: `ValueError: width and height must be > 0`
**Solution**: Ensure text is long enough (at least 9 characters)

#### 4. Module not found
**Error**: `ModuleNotFoundError: No module named 'PIL'`
**Solution**: Install Pillow
```bash
pip install Pillow
```

#### 5. NLTK data missing
**Error**: `LookupError: Resource wordnet not found`
**Solution**: Download NLTK data
```bash
python -m nltk.downloader wordnet
```

### Performance Issues

For large texts (>10,000 characters):
- Image generation may be slow
- Consider chunking text
- Use lower resolution by modifying dimension calculation

## Future Roadmap

### Version 2.0 Features
1. **Natural Language Processing**
   - Stop word removal
   - Lemmatization
   - Named entity recognition for special coloring

2. **Enhanced Visualization**
   - Multiple color schemes
   - Non-square image shapes
   - Animation support (GIF output)

3. **User Interface**
   - Command-line arguments
   - Web interface with Flask/Django
   - Real-time preview

4. **Advanced Algorithms**
   - Word frequency-based coloring
   - Sentiment analysis coloring
   - Topic modeling visualization

5. **Output Formats**
   - SVG for scalable graphics
   - PDF for print quality
   - Video for text animations

### Version 3.0 Vision
- Machine learning-based color mapping
- 3D visualizations
- Interactive exploring of text regions
- Collaborative art creation
- API service for text-to-art generation

## Appendix

### ASCII Table Reference
Key ranges for color mapping:
- 0-31: Control characters (avoid)
- 32-47: Space and symbols
- 48-57: Numbers (0-9)
- 58-64: More symbols
- 65-90: Uppercase letters (A-Z)
- 91-96: More symbols
- 97-122: Lowercase letters (a-z)
- 123-127: More symbols
- 128-255: Extended ASCII

### Sample Outputs
Different text types produce different visual patterns:
- **Poetry**: Often balanced, rhythmic patterns
- **Code**: High contrast with many symbols
- **Prose**: Smooth, flowing color gradients
- **Data**: Repetitive patterns based on structure

### Resources
- [Pillow Documentation](https://pillow.readthedocs.io/)
- [NLTK Documentation](https://www.nltk.org/)
- [ASCII Table](https://www.asciitable.com/)
- [Color Theory](https://www.colormatters.com/color-and-design/basic-color-theory)
