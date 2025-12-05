#!/usr/bin/env python3
"""
Create small promotional tile for De:dobe Chrome Web Store
440x280 with Black Orchard aesthetic
"""

from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os

# Dimensions
WIDTH = 440
HEIGHT = 280

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
    """Add holographic corner accents (scaled for small tile)"""
    draw = ImageDraw.Draw(img, 'RGBA')

    # Top-left accent lines
    for i in range(3):
        alpha = int(200 * (1 - i/3))
        draw.line([(0, 15 + i*6), (80, 15 + i*6)], fill=(CYAN[0], CYAN[1], CYAN[2], alpha), width=1)

    # Top-right accent lines
    for i in range(3):
        alpha = int(200 * (1 - i/3))
        draw.line([(WIDTH - 80, 15 + i*6), (WIDTH, 15 + i*6)], fill=(MAGENTA[0], MAGENTA[1], MAGENTA[2], alpha), width=1)

    # Bottom corner accents
    for i in range(2):
        alpha = int(150 * (1 - i/2))
        draw.line([(0, HEIGHT - 15 - i*6), (60, HEIGHT - 15 - i*6)], fill=(COBALT[0], COBALT[1], COBALT[2], alpha), width=1)
        draw.line([(WIDTH - 60, HEIGHT - 15 - i*6), (WIDTH, HEIGHT - 15 - i*6)], fill=(COBALT[0], COBALT[1], COBALT[2], alpha), width=1)

    return img

def main():
    print("Creating De:dobe small promotional tile (440x280)...")

    # Create base gradient
    promo = create_gradient_background(WIDTH, HEIGHT)

    # Add holographic accents
    promo = add_holographic_accents(promo)

    # Load UI screenshot
    screenshot_path = r"C:\Users\black\Pictures\Screenshots\Screenshot 2025-11-16 115641.png"
    if os.path.exists(screenshot_path):
        ui_screenshot = Image.open(screenshot_path)

        # Scale to fit small tile
        ui_width, ui_height = ui_screenshot.size

        # Make it smaller for the compact layout
        max_ui_height = 140
        scale = max_ui_height / ui_height
        new_width = int(ui_width * scale)
        new_height = int(ui_height * scale)
        ui_screenshot = ui_screenshot.resize((new_width, new_height), Image.Resampling.LANCZOS)
        ui_width, ui_height = new_width, new_height

        # Position UI screenshot (centered horizontally, lower portion)
        ui_x = (WIDTH - ui_width) // 2
        ui_y = 120  # Leave room for heading at top

        # Add subtle shadow behind UI
        shadow = Image.new('RGBA', (ui_width + 10, ui_height + 10), (0, 0, 0, 0))
        shadow_draw = ImageDraw.Draw(shadow)
        shadow_draw.rectangle([(5, 5), (ui_width + 5, ui_height + 5)], fill=(0, 0, 0, 80))
        shadow = shadow.filter(ImageFilter.GaussianBlur(radius=8))
        promo.paste(shadow, (ui_x - 5, ui_y - 5), shadow)

        # Paste UI screenshot
        promo.paste(ui_screenshot, (ui_x, ui_y), ui_screenshot if ui_screenshot.mode == 'RGBA' else None)

        print(f"UI screenshot placed at ({ui_x}, {ui_y}), size: {ui_width}x{ui_height}")
    else:
        print(f"Screenshot not found: {screenshot_path}")

    # Add text overlay
    draw = ImageDraw.Draw(promo)

    # Try to use a nice font, fallback to default
    try:
        title_font = ImageFont.truetype("C:/Windows/Fonts/seguisb.ttf", 28)
        subtitle_font = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 14)
        tag_font = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 11)
    except:
        print("Using default fonts")
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()
        tag_font = ImageFont.load_default()

    # Main heading
    title_text = "De:dobe: Extractor"
    title_bbox = draw.textbbox((0, 0), title_text, font=title_font)
    title_width = title_bbox[2] - title_bbox[0]
    title_x = (WIDTH - title_width) // 2

    # Draw title with magenta glow
    for offset in [(1, 1), (-1, -1), (1, -1), (-1, 1)]:
        draw.text((title_x + offset[0], 25 + offset[1]), title_text, font=title_font, fill=(MAGENTA[0]//3, MAGENTA[1]//3, MAGENTA[2]//3))
    draw.text((title_x, 25), title_text, font=title_font, fill=MAGENTA)

    # Subtitle
    subtitle_text = "Extract Your AI Conversations"
    subtitle_bbox = draw.textbbox((0, 0), subtitle_text, font=subtitle_font)
    subtitle_width = subtitle_bbox[2] - subtitle_bbox[0]
    subtitle_x = (WIDTH - subtitle_width) // 2
    draw.text((subtitle_x, 62), subtitle_text, font=subtitle_font, fill=WHITE)

    # Tagline
    tagline_text = "ChatGPT • Claude • Gemini • Grok"
    tagline_bbox = draw.textbbox((0, 0), tagline_text, font=tag_font)
    tagline_width = tagline_bbox[2] - tagline_bbox[0]
    tagline_x = (WIDTH - tagline_width) // 2
    draw.text((tagline_x, 85), tagline_text, font=tag_font, fill=CYAN)

    # Save
    output_path = "de-dobe-promo-440x280.png"
    promo.save(output_path, 'PNG', optimize=True)
    print(f"Promotional tile saved: {output_path}")
    print(f"  Dimensions: {WIDTH}x{HEIGHT}")
    print(f"  Size: {os.path.getsize(output_path) / 1024:.1f} KB")

if __name__ == "__main__":
    main()
