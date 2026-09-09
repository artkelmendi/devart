from pathlib import Path
import io, re, json, xml.etree.ElementTree as ET
import pathops, resvg_py
from fontTools.svgLib.path import parse_path
from fontTools.pens.svgPathPen import SVGPathPen
from PIL import Image, ImageDraw, ImageFont, ImageChops

ROOT = Path(__file__).resolve().parents[2]
OUT = Path(__file__).resolve().parent
SOURCE = ROOT / 'devart-variant/vectors/DEVART-04-jaw-aligned-white.svg'
NS = {'s': 'http://www.w3.org/2000/svg'}
root = ET.parse(SOURCE).getroot()

def path_from_d(d, evenodd=False):
    p = pathops.Path()
    parse_path(d, p.getPen())
    if evenodd:
        p.fillType = pathops.FillType.EVEN_ODD
    return p

def serialized(p):
    pen = SVGPathPen(None, ntos=lambda n: format(round(n, 3), '.3f').rstrip('0').rstrip('.'))
    p.draw(pen)
    return re.sub(r'\s+', ' ', pen.getCommands()).strip()

mask = None
for group in list(root)[:6]:
    rect = group.find('.//s:rect', NS)
    x, y, w, h = [float(rect.get(k, '0')) for k in ['x', 'y', 'width', 'height']]
    p = pathops.Path()
    p.moveTo(x, y); p.lineTo(x+w, y); p.lineTo(x+w, y+h); p.lineTo(x, y+h); p.close()
    mask = p if mask is None else pathops.op(mask, p, pathops.PathOp.UNION)
master = path_from_d(list(root)[0].find('.//s:path', NS).get('d'), True)
portrait = pathops.op(master, mask, pathops.PathOp.INTERSECTION)
letter_paths = [path_from_d(n.get('d')) for n in list(root)[6].findall('.//s:path', NS)]
wordmark = pathops.Path()
for p in letter_paths:
    wordmark.addPath(p)

def bounds_of(paths, padding=0.6):
    bounds = [p.bounds for p in paths]
    x0, y0 = min(b[0] for b in bounds)-padding, min(b[1] for b in bounds)-padding
    x1, y1 = max(b[2] for b in bounds)+padding, max(b[3] for b in bounds)+padding
    return [round(x0, 3), round(y0, 3), round(x1-x0, 3), round(y1-y0, 3)]

def svg_for(paths, color, title, description, viewbox):
    vb = ' '.join(str(v) for v in viewbox)
    children = ''.join(f'<path d="{serialized(p)}"/>' for p in paths)
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{viewbox[2]}" height="{viewbox[3]}" viewBox="{vb}" fill="{color}" role="img" aria-labelledby="title desc"><title id="title">{title}</title><desc id="desc">{description}</desc>{children}</svg>'

variants = {
    'logo': ([portrait, wordmark], 'DEVART portrait logo', 'Original illustrated portrait with sunglasses and DEVART lettering following the jawline.'),
    'portrait': ([portrait], 'DEVART portrait symbol', 'Original DEVART illustrated hair, eyebrows, sunglasses, ears and nose, without lettering.'),
    'wordmark': ([wordmark], 'DEVART wordmark', 'Outlined DEVART lettering with the original jawline alignment.')
}
manifest = {'source': str(SOURCE.relative_to(ROOT)), 'geometry': 'Existing jaw-aligned artwork preserved; six rectangular clips flattened into a single portrait path. Letter outlines retained.', 'font': 'Existing supplied outlines derived from Bahnschrift Condensed. No font file, live text, or font dependency is included.', 'assets': []}
for name, (paths, title, desc) in variants.items():
    vb = bounds_of(paths)
    for color_name, color in [('white', '#FFFFFF'), ('black', '#000000')]:
        target = OUT / f'devart-{name}-{color_name}.svg'
        target.write_text(svg_for(paths, color, title, desc, vb), encoding='utf-8')
        manifest['assets'].append({'file': target.name, 'viewBox': vb, 'bytes': target.stat().st_size, 'color': color})

# Compare the production geometry with the source before cropping the viewBox.
original = Image.open(io.BytesIO(resvg_py.svg_to_bytes(svg_path=str(SOURCE), width=860))).convert('RGBA')
comparison_svg = svg_for([portrait, wordmark], '#FFFFFF', 'DEVART', '', [0,0,430,570])
production = Image.open(io.BytesIO(resvg_py.svg_to_bytes(svg_string=comparison_svg, width=860))).convert('RGBA')
old_alpha, new_alpha = original.getchannel('A'), production.getchannel('A')
old_binary, new_binary = [im.point(lambda x: 255 if x >= 128 else 0) for im in [old_alpha, new_alpha]]
union = sum(ImageChops.lighter(old_binary, new_binary).get_flattened_data())
intersection = sum(ImageChops.darker(old_binary, new_binary).get_flattened_data())
alpha_difference = ImageChops.difference(old_alpha, new_alpha)
large_alpha_differences = sum(alpha_difference.point(lambda x: 255 if x >= 128 else 0).get_flattened_data()) // 255
manifest['validation'] = {'mask_overlap_at_860px': round(intersection / union, 6), 'alpha_differences_of_128_or_more': large_alpha_differences, 'comparison_note': 'Flattening removes duplicated edge antialiasing where the six original clipped paths overlapped; visible geometry is retained.', 'paths_only': True, 'raster_images': 0, 'external_dependencies': 0, 'transparent_background': True}
assert intersection / union > 0.997
assert large_alpha_differences <= 4

proof = Image.new('RGB', (1400, 1000), '#101110')
draw = ImageDraw.Draw(proof)
font = ImageFont.truetype('C:/Windows/Fonts/arial.ttf', 16)
large = ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf', 27)
draw.text((44,32), 'DEVART / WEBSITE ASSET PROOF', font=large, fill='#d8ff3e')
draw.text((44,73), 'Existing jaw-aligned identity. Transparent, outlined, flattened, and tightly cropped.', font=font, fill='#b9bcb4')
draw.rectangle((720,115,1356,740), fill='#f3f4ed')
for color_name, x, bg in [('white', 92, '#101110'), ('black', 850, '#f3f4ed')]:
    svg = OUT / f'devart-logo-{color_name}.svg'
    im = Image.open(io.BytesIO(resvg_py.svg_to_bytes(svg_path=str(svg), height=550))).convert('RGBA')
    proof.paste(im,(x,145),im)
draw.text((44,780), 'PORTRAIT SYMBOL', font=font, fill='#d8ff3e')
cursor = 44
for size in [16,24,32,64,128]:
    svg = OUT / 'devart-portrait-white.svg'
    im = Image.open(io.BytesIO(resvg_py.svg_to_bytes(svg_path=str(svg), height=size))).convert('RGBA')
    proof.paste(im,(cursor,820),im)
    draw.text((cursor,960), str(size)+'px', font=font, fill='#b9bcb4')
    cursor += max(72,im.width+35)
draw.text((700,780), 'FULL LOCKUP / 128PX HIGH', font=font, fill='#d8ff3e')
im = Image.open(io.BytesIO(resvg_py.svg_to_bytes(svg_path=str(OUT/'devart-logo-white.svg'), height=128))).convert('RGBA')
proof.paste(im,(710,820),im)
draw.text((900,830), 'Portrait: use at 48px+ height.\nFull logo: use at 120px+ height.\nWhite on dark / black on light.\nKeep clear space of 10% of logo width.', font=font, fill='#b9bcb4', spacing=10)
proof.save(OUT/'devart-brand-proof.png')
(OUT/'manifest.json').write_text(json.dumps(manifest, indent=2), encoding='utf-8')
(OUT/'README.md').write_text('DEVART website assets\n\nUse devart-logo-white.svg for the full portrait identity on a dark background and devart-logo-black.svg on a light background. Minimum recommended height: 120px. The separate portrait symbol is appropriate from 48px; avoid favicon-scale use of the detailed portrait. Wordmark-only exports preserve the original jawline arrangement and are optional companion assets.\n\nPreserve the original aspect ratio and leave at least 10% of logo width as clear space. Assets are transparent, use explicit monochrome fills, and contain outlined paths only. No fonts need to be loaded. Original source files are untouched.\n\nThe portfolio can use acid-chartreuse in its surrounding interface; white and black remain the supplied identity colorways. See manifest.json for exact viewBoxes and validation.\n', encoding='utf-8')
print(json.dumps(manifest, indent=2))
