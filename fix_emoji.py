from pathlib import Path
p = Path('script.js')
text = p.read_text(encoding='utf-8', errors='replace')
# Replace the corrupted emoji with the correct shopping cart emoji
text = text.replace('font-size:2rem;margin-bottom:1rem">???</p>', 'font-size:2rem;margin-bottom:1rem">🛒</p>')
p.write_text(text, encoding='utf-8')
print('Emoji del carrito reemplazado ✓')
