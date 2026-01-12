# ImgCoords - Visual Coordinate Collector

A sleek, modern web tool designed to help you collect images and extract precise coordinates from them. Perfect for developers, designers, or anyone needing to map out points on an image for automation, UI testing, or design specifications.

![ImgCoords Preview](https://via.placeholder.com/1200x600/0f172a/f8fafc?text=ImgCoords+Visualizer)

## 🚀 Features

- **Multi-Source Ingest**: Add images instantly by pasting a URL or uploading local files from your computer.
- **Smart Scaling**: Automatically maps every click to a fixed **1920x1080** resolution, ensuring consistent coordinates regardless of your screen size or browser zoom level.
- **Instant Copy**: Click any point on an image to copy the `X, Y` coordinates directly to your clipboard.
- **Visual Feedback**:
  
  - **Ripple Effect**: Subtle animations at the point of contact to confirm your selection.
  - **Toast Notifications**: Modern status alerts to confirm successful copying.

- **Premium Aesthetics**: A responsive, dark-mode interface featuring glassmorphism effects, smooth transitions, and high-quality typography.

## 🛠️ How It Works

The tool uses a responsive scaling algorithm:
1. It calculates the relative position of your click inside the image container.
2. It determines the percentage of the click relative to the current displayed width and height.
3. It multiplies those percentages by 1920 (width) and 1080 (height) to give you standardized coordinates.

## 💻 Tech Stack

- **Core**: HTML5, Vanilla JavaScript
- **Styling**: Modern CSS (Flexbox, CSS Variables, Background Blurs)
- **Icons**: [Lucide Icons](https://lucide.dev/)
- **Typography**: [Outfit via Google Fonts](https://fonts.google.com/specimen/Outfit)

## 📖 Usage

1. Open `index.html` in any modern web browser.
2. Add an image using the **URL bar** or the **Upload button**.
3. Hover over the image to see the interaction hint.
4. **Click** any part of the image.
5. Paste your coordinates (`Ctrl + V`) wherever you need them!

---
Built with ❤️ for precision.
