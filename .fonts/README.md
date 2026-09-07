# Embedded fonts

Both typefaces are subsetted and embedded as base64 WOFF2 inside the generated
SVGs in `../assets/`, because an `<img>`-rendered SVG cannot fetch external
fonts. That means the font data ships inside this repository, so the SIL Open
Font License notices ship with it.

| Font | Copyright | Licence |
| :-- | :-- | :-- |
| **Archivo** (weight 800, uppercase subset) | Copyright 2020 The Archivo Project Authors — https://github.com/Omnibus-Type/Archivo | [OFL-1.1](OFL-Archivo.txt) |
| **IBM Plex Mono** (weight 400, Latin subset) | Copyright © 2017 IBM Corp. with Reserved Font Name "Plex" | [OFL-1.1](OFL-IBMPlexMono.txt) |

Neither font is renamed, and neither Reserved Font Name is used for a modified
version, so embedding the subsets is permitted under OFL-1.1 §2 provided these
notices accompany them — which is what this directory is for.

Subsets were produced with the Google Fonts CSS API `text=` parameter, so they
contain only the glyphs the profile actually renders (2.4 KB and 8.9 KB).
