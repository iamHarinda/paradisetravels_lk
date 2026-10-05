# Self-hosted font subsets

`fraunces-italic-380-latin.woff2` — Fraunces italic (SIL Open Font License, via @fontsource-variable/fraunces),
instanced to a single weight (380) and subset to Basic Latin + typographic punctuation. Used only for the italic
accent words in headlines (`.accent`). Regenerate with fonttools:

```python
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools import subset
f = TTFont('node_modules/@fontsource-variable/fraunces/files/fraunces-latin-wght-italic.woff2')
inst = instantiateVariableFont(f, {'wght': 380})
opts = subset.Options(); opts.flavor = 'woff2'; opts.layout_features = ['kern', 'liga', 'calt']
s = subset.Subsetter(opts)
s.populate(unicodes=list(range(0x20, 0x7f)) + [0x2018, 0x2019, 0x201c, 0x201d, 0x2013, 0x2014, 0x2026, 0xe0, 0xe2, 0xe8, 0xe9])
s.subset(inst); inst.flavor = 'woff2'; inst.save('src/assets/fonts/fraunces-italic-380-latin.woff2')
```
