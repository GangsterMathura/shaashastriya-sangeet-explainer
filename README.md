# शास्त्रीय संगीत — Raags & Taals (interactieve explainer)

Een interactieve ontdekkingsreis door de Hindoestaanse klassieke muziek. Alles draait in de browser, zonder build-stap of server-code. Het boek zelf staat **niet** in deze repo of op de site; alleen algemene gegevens over raags en taals.

## Wat zit erin

| Tab | Wat je kunt doen |
|---|---|
| **Start** | 3D-scène met swar-ring, draaiende gyroscoop, lotus en zwevende edelstenen; klik een swar om hem te horen |
| **Raags** | 115 raags: zoeken en filteren op thaat, jaati en tijd. Per raag: aroh, avroh en pakad horen, een telkens nieuwe improvisatie in teentaal met tabla, en uitleg van de begrippen |
| **Taals** | 12 taals met theka op tabla, twee 3D-trommels die meebewegen, 3D matra-ring, tempo-, laya- en volume-slider |
| **Swar-lab** | Toetsenbord van 12 swars, slider tussen *zuivere* en *gelijkzwevende* stemming (in cents), de 10 thaats afspelen, zwevingsproef Sa–Pa |
| **Dagklok** | Sleep door de dag en zie welke raags bij dat uur horen; laat de dag lopen |
| **Leren** | 3D flashcards en de quiz "Raad de raag" op gehoor |

De balk onderaan: tanpura-drone, **Sa-slider** (110–330 Hz), volume, galm en instrument (sitar-achtig, bansuri, harmonium).

## Bestanden

- `index.html`, `styles.css`, `app.js` — de site
- `book-data.js` — alleen feiten: toonreeksen, vaadi/samvaadi, tijden en thekas (`window.BOOK`)
- `samples/` — *optioneel*, zie hieronder

## Echte geluiden (optioneel, aanbevolen)

Het geluid wordt standaard gemodelleerd in de browser. Wil je de klank van echte opnames, zet dan bestanden in een map `samples/` met een `samples/samples.json`:

```json
{
  "tabla": { "na": "tabla/na.wav", "tin": "tabla/tin.wav", "tu": "tabla/tu.wav", "ti": "tabla/ti.wav",
             "te": "tabla/te.wav", "ta": "tabla/ta.wav", "ge": "tabla/ge.wav", "ke": "tabla/ke.wav" },
  "harmonium": { "file": "harmonium/c4.wav", "ref": 261.63 }
}
```

- Tabla: één korte opname per slag (na, tin, tu, ti, te, ta, ge, ke). Samengestelde bols zoals Dha en Dhin worden uit deze slagen opgebouwd.
- Harmonium: één aangehouden noot; `ref` is de toonhoogte in Hz van die opname. De andere noten worden daaruit afgeleid.
- Ontbreekt een bestand of `samples.json`, dan gebruikt de site gewoon het gemodelleerde geluid.
- Gebruik alleen opnames waarvan je de licentie hebt om ze openbaar te mogen publiceren (zelf opgenomen, CC0 of CC-BY met vermelding).

## Lokaal draaien

```bash
python -m http.server 8000
```

Met **GitHub Pages** (Settings → Pages → branch `main`, map `/root`) staat de site direct online. Browsers starten geluid pas na een klik.
