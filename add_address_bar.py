from PIL import Image, ImageDraw, ImageFont
import sys
import os

def add_address_bar(img_path, url, output_path):
    img = Image.open(img_path)
    width, height = img.size
    
    bar_height = 60
    new_img = Image.new('RGB', (width, height + bar_height), color=(240, 240, 240))
    
    draw = ImageDraw.Draw(new_img)
    
    # Draw URL bar background
    draw.rectangle([100, 15, width - 100, 45], fill=(255, 255, 255), outline=(200, 200, 200))
    
    # Draw URL text
    try:
        font = ImageFont.truetype("arial.ttf", 16)
    except:
        font = ImageFont.load_default()
        
    draw.text((120, 22), url, fill=(0, 0, 0), font=font)
    
    # Draw some fake browser buttons
    draw.ellipse([15, 20, 30, 35], fill=(255, 95, 86))  # Red
    draw.ellipse([40, 20, 55, 35], fill=(255, 189, 46)) # Yellow
    draw.ellipse([65, 20, 80, 35], fill=(39, 201, 63))   # Green
    
    new_img.paste(img, (0, bar_height))
    new_img.save(output_path)
    print(f"Saved {output_path} with URL {url}")

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: python add_address_bar.py <input_img> <url> <output_img>")
        sys.exit(1)
    
    add_address_bar(sys.argv[1], sys.argv[2], sys.argv[3])
