#!/usr/bin/env python3
"""
Create promotional graphic for De:dobe Chrome Web Store
1280x800 with Black Orchard aesthetic
"""

from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os

# Dimensions
WIDTH = 1280
HEIGHT = 800

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

    # Vertical gradient
    for y in range(height):
        ratio = y / height
        r = int(NAVY_DEEP[0] + (NAVY_MID[0] - NAVY_DEEP[0]) * ratio)
        g = int(NAVY_DEEP[1] + (NAVY_MID[1] - NAVY_DEEP[1]) * ratio)
        b = int(NAVY_DEEP[2] + (NAVY_MID[2] - NAVY_DEEP[2]) * ratio)
        draw.line([(0, y), (width, y)], fill=(r, g, b))

    return img

def add_holographic_accents(img):
    """Add holographic corner accents"""
    draw = ImageDraw.Draw(img, 'RGBA')

    # Top-left accent lines
    for i in range(5):
        alpha = int(255 * (1 - i/5))
        draw.line([(0, 40 + i*10), (200, 40 + i*10)], fill=(CYAN[0], CYAN[1], CYAN[2], alpha), width=2)

    # Top-right accent lines
    for i in range(5):
        alpha = int(255 * (1 - i/5))
        draw.line([(WIDTH - 200, 40 + i*10), (WIDTH, 40 + i*10)], fill=(MAGENTA[0], MAGENTA[1], MAGENTA[2], alpha), width=2)

    # Bottom corner accents
    for i in range(3):
        alpha = int(150 * (1 - i/3))
        draw.line([(0, HEIGHT - 40 - i*10), (150, HEIGHT - 40 - i*10)], fill=(COBALT[0], COBALT[1], COBALT[2], alpha), width=2)
        draw.line([(WIDTH - 150, HEIGHT - 40 - i*10), (WIDTH, HEIGHT - 40 - i*10)], fill=(COBALT[0], COBALT[1], COBALT[2], alpha), width=2)

    return img

def main():
    print("Creating De:dobe promotional graphic...")

    # Create base gradient
    promo = create_gradient_background(WIDTH, HEIGHT)

    # Add holographic accents
    promo = add_holographic_accents(promo)

    # Load UI screenshot
    screenshot_path = r"C:\Users\black\Pictures\Screenshots\Screenshot 2025-11-16 115641.png"
    if os.path.exists(screenshot_path):
        ui_screenshot = Image.open(screenshot_path)

        # Calculate centered position with padding
        ui_width, ui_height = ui_screenshot.size

        # Scale if needed to fit nicely (leave room for text)
        max_ui_height = 450
        if ui_height > max_ui_height:
            scale = max_ui_height / ui_height
            new_width = int(ui_width * scale)
            new_height = int(ui_height * scale)
            ui_screenshot = ui_screenshot.resize((new_width, new_height), Image.Resampling.LANCZOS)
            ui_width, ui_height = new_width, new_height

        # Position UI screenshot (centered horizontally, lower third)
        ui_x = (WIDTH - ui_width) // 2
        ui_y = 380  # Leave room for heading at top

        # Add subtle shadow behind UI
        shadow = Image.new('RGBA', (ui_width + 20, ui_height + 20), (0, 0, 0, 0))
        shadow_draw = ImageDraw.Draw(shadow)
        shadow_draw.rectangle([(10, 10), (ui_width + 10, ui_height + 10)], fill=(0, 0, 0, 100))
        shadow = shadow.filter(ImageFilter.GaussianBlur(radius=15))
        promo.paste(shadow, (ui_x - 10, ui_y - 10), shadow)

        # Paste UI screenshot
        promo.paste(ui_screenshot, (ui_x, ui_y), ui_screenshot if ui_screenshot.mode == 'RGBA' else None)

        print(f"UI screenshot placed at ({ui_x}, {ui_y}), size: {ui_width}x{ui_height}")
    else:
        print(f"Screenshot not found: {screenshot_path}")

    # Add text overlay
    draw = ImageDraw.Draw(promo)

    # Try to use a nice font, fallback to default
    try:
        title_font = ImageFont.truetype("C:/Windows/Fonts/seguisb.ttf", 72)
        subtitle_font = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 32)
        tagline_font = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 24)
    except:
        print("Using default fonts")
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()
        tagline_font = ImageFont.load_default()

    # Main heading
    title_text = "De:dobe: Extractor"
    title_bbox = draw.textbbox((0, 0), title_text, font=title_font)
    title_width = title_bbox[2] - title_bbox[0]
    title_x = (WIDTH - title_width) // 2

    # Draw title with magenta glow
    for offset in [(2, 2), (-2, -2), (2, -2), (-2, 2)]:
        draw.text((title_x + offset[0], 80 + offset[1]), title_text, font=title_font, fill=(MAGENTA[0]//3, MAGENTA[1]//3, MAGENTA[2]//3))
    draw.text((title_x, 80), title_text, font=title_font, fill=MAGENTA)

    # Subtitle
    subtitle_text = "Extract Your AI Conversations"
    subtitle_bbox = draw.textbbox((0, 0), subtitle_text, font=subtitle_font)
    subtitle_width = subtitle_bbox[2] - subtitle_bbox[0]
    subtitle_x = (WIDTH - subtitle_width) // 2
    draw.text((subtitle_x, 180), subtitle_text, font=subtitle_font, fill=WHITE)

    # Tagline
    tagline_text = "ChatGPT • Claude • Gemini • Grok"
    tagline_bbox = draw.textbbox((0, 0), tagline_text, font=tagline_font)
    tagline_width = tagline_bbox[2] - tagline_bbox[0]
    tagline_x = (WIDTH - tagline_width) // 2
    draw.text((tagline_x, 230), tagline_text, font=tagline_font, fill=CYAN)

    # Bottom branding
    brand_text = "Black Orchard Labs"
    brand_bbox = draw.textbbox((0, 0), brand_text, font=tagline_font)
    brand_width = brand_bbox[2] - brand_bbox[0]
    brand_x = (WIDTH - brand_width) // 2
    draw.text((brand_x, HEIGHT - 60), brand_text, font=tagline_font, fill=(COBALT[0], COBALT[1], COBALT[2], 180))

    # Save
    output_path = "de-dobe-promo-1280x800.png"
    promo.save(output_path, 'PNG', optimize=True)
    print(f"✓ Promotional graphic saved: {output_path}")
    print(f"  Dimensions: {WIDTH}x{HEIGHT}")
    print(f"  Size: {os.path.getsize(output_path) / 1024:.1f} KB")

if __name__ == "__main__":
    main()
