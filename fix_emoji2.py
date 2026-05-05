from pathlib import Path
import re

p = Path('script.js')
text = p.read_text(encoding='utf-8', errors='replace')

# The corrupted text has a Unicode replacement char (\ufffd) followed by ???
# We need to replace that with the shopping cart emoji
text = re.sub(r'>[\ufffd\?]+</p>', '>🛒</p>', text, count=1)

p.write_text(text, encoding='utf-8')
print('Emoji reemplazado ✓')

# Verify
lines = p.read_text().split('\n')
print('Verificación:', repr(lines[1410]))
