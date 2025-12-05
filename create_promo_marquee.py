#!/usr/bin/env python3
"""
Create marquee promotional banner for De:dobe Chrome Web Store
1400x560 with Black Orchard aesthetic
"""

from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os

# Dimensions
WIDTH = 1400
HEIGHT = 560

# Black Orchard color palette
NAVY_DEEP = (10, 15, 35)
NAVY_MID = (15, 25, 50)
COBALT = (30, 80, 180)
MAGENTA = (255, 0, 255)
CYAN = (0, 255, 255)
WHITE = (255, 255, 255)

def create_gradient_background(width, height):
    """Create navy gradient background"""
    img = Image.new('RGB', (width, height), NAVY_DEEP)
    draw = ImageDraw.Draw(img)

    # Diagonal gradient for marquee
    for y in range(height):
        ratio = y / height
        r = int(NAVY_DEEP[0] + (NAVY_MID[0] - NAVY_DEEP[0]) * ratio)
        g = int(NAVY_DEEP[1] + (NAVY_MID[1] - NAVY_DEEP[1]) * ratio)
        b = int(NAVY_DEEP[2] + (NAVY_MID[2] - NAVY_DEEP[2]) * ratio)
        draw.line([(0, y), (width, y)], fill=(r, g, b))

    return img

def add_holographic_accents(img):
    """Add holographic accent lines for wide marquee format"""
    draw = ImageDraw.Draw(img, 'RGBA')

    # Top accent lines spanning width
    for i in range(4):
        alpha = int(220 * (1 - i/4))
        draw.line([(0, 30 + i*8), (WIDTH, 30 + i*8)], fill=(CYAN[0], CYAN[1], CYAN[2], alpha), width=1)

    # Bottom accent lines
    for i in range(4):
        alpha = int(220 * (1 - i/4))
        draw.line([(0, HEIGHT - 30 - i*8), (WIDTH, HEIGHT - 30 - i*8)], fill=(MAGENTA[0], MAGENTA[1], MAGENTA[2], alpha), width=1)

    # Left side accent
    for i in range(5):
        alpha = int(180 * (1 - i/5))
        draw.line([(40 + i*12, 0), (40 + i*12, HEIGHT)], fill=(COBALT[0], COBALT[1], COBALT[2], alpha), width=1)

    # Right side accent
    for i in range(5):
        alpha = int(180 * (1 - i/5))
        draw.line([(WIDTH - 40 - i*12, 0), (WIDTH - 40 - i*12, HEIGHT)], fill=(COBALT[0], COBALT[1], COBALT[2], alpha), width=1)

    return img

def main():
    print("Creating De:dobe marquee banner (1400x560)...")

    # Create base gradient
    promo = create_gradient_background(WIDTH, HEIGHT)

    # Add holographic accents
    promo = add_holographic_accents(promo)

    # Load UI screenshot
    screenshot_path = r"C:\Users\black\Pictures\Screenshots\Screenshot 2025-11-16 115641.png"
    if os.path.exists(screenshot_path):
        ui_screenshot = Image.open(screenshot_path)

        # Scale for marquee (positioned on right side)
        ui_width, ui_height = ui_screenshot.size

        # Scale to fit marquee height nicely
        max_ui_height = 300
        scale = max_ui_height / ui_height
        new_width = int(ui_width * scale)
        new_height = int(ui_height * scale)
        ui_screenshot = ui_screenshot.resize((new_width, new_height), Image.Resampling.LANCZOS)
        ui_width, ui_height = new_width, new_height

        # Position UI screenshot (right side, vertically centered)
        ui_x = WIDTH - ui_width - 120  # 120px from right edge
        ui_y = (HEIGHT - ui_height) // 2

        # Add shadow behind UI
        shadow = Image.new('RGBA', (ui_width + 20, ui_height + 20), (0, 0, 0, 0))
        shadow_draw = ImageDraw.Draw(shadow)
        shadow_draw.rectangle([(10, 10), (ui_width + 10, ui_height + 10)], fill=(0, 0, 0, 120))
        shadow = shadow.filter(ImageFilter.GaussianBlur(radius=20))
        promo.paste(shadow, (ui_x - 10, ui_y - 10), shadow)

        # Paste UI screenshot
        promo.paste(ui_screenshot, (ui_x, ui_y), ui_screenshot if ui_screenshot.mode == 'RGBA' else None)

        print(f"UI screenshot placed at ({ui_x}, {ui_y}), size: {ui_width}x{ui_height}")
    else:
        print(f"Screenshot not found: {screenshot_path}")

    # Add text overlay (left-aligned for marquee format)
    draw = ImageDraw.Draw(promo)

    # Try to use a nice font, fallback to default
    try:
        title_font = ImageFont.truetype("C:/Windows/Fonts/seguisb.ttf", 64)
        subtitle_font = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 32)
        tagline_font = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 26)
        features_font = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 22)
    except:
        print("Using default fonts")
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()
        tagline_font = ImageFont.load_default()
        features_font = ImageFont.load_default()

    # Left-aligned text starting position
    text_x = 140

    # Main heading
    title_text = "De:dobe: Extractor"
    # Draw title with magenta glow
    for offset in [(2, 2), (-2, -2), (2, -2), (-2, 2)]:
        draw.text((text_x + offset[0], 100 + offset[1]), title_text, font=title_font, fill=(MAGENTA[0]//3, MAGENTA[1]//3, MAGENTA[2]//3))
    draw.text((text_x, 100), title_text, font=title_font, fill=MAGENTA)

    # Subtitle
    subtitle_text = "Extract Your AI Conversations"
    draw.text((text_x, 200), subtitle_text, font=subtitle_font, fill=WHITE)

    # Platform tagline
    tagline_text = "ChatGPT • Claude • Gemini • Grok"
    draw.text((text_x, 255), tagline_text, font=tagline_font, fill=CYAN)

    # Feature bullets
    features = [
        "✓ Export to Markdown, JSON, or Text",
        "✓ Zero data collection, 100% local",
        "✓ Your data belongs to you"
    ]

    feature_y = 315
    for feature in features:
        draw.text((text_x, feature_y), feature, font=features_font, fill=(200, 220, 255))
        feature_y += 35

    # Bottom branding
    brand_text = "Black Orchard Labs"
    draw.text((text_x, HEIGHT - 70), brand_text, font=tagline_font, fill=(COBALT[0], COBALT[1], COBALT[2]))

    # Save
    output_path = "de-dobe-promo-1400x560.png"
    promo.save(output_path, 'PNG', optimize=True)
    print(f"Marquee banner saved: {output_path}")
    print(f"  Dimensions: {WIDTH}x{HEIGHT}")
    print(f"  Size: {os.path.getsize(output_path) / 1024:.1f} KB")

if __name__ == "__main__":
    main()
