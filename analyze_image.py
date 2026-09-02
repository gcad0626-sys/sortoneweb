from PIL import Image
import sys

try:
    img = Image.open('img/Central App Mockup.png').convert('RGB')
    w, h = img.size
    pixels = img.load()

    bg_color = pixels[10, int(h/2)]

    cards = []
    in_card = False
    start_y = 0
    x_mid = int(w / 2)
    for y in range(h):
        p = pixels[x_mid, y]
        is_card = p[0] > 240 and p[1] > 240 and p[2] > 240
        
        if is_card and not in_card:
            in_card = True
            start_y = y
        elif not is_card and in_card:
            in_card = False
            if y - start_y > 30:
                cards.append((start_y, y))
    
    print("Image size:", w, h)
    print("Detected cards:", cards)
except Exception as e:
    print(e)
