# scalynx.io Website

Statische, Cloudflare-Pages-fertige Website für `scalynx.io`.

## Inhalte
- Agenturzentrierte Startseite (`/index.html`)
- Mehrseitenstruktur mit Unterseiten und Unter-Unterseiten:
  - `/leistungen/*`
  - `/plattform/*`
  - `/branchen/*`
  - `/ressourcen/*`
- Rechtstexte (`/impressum.html`, `/datenschutz.html`, `/agb.html`)
- Styles + Interaktionen (`/styles.css`, `/script.js`)
- Domain-Redirect-Regel (`/_redirects`)

## Lokal testen
```bash
python3 -m http.server 8787
```
Dann `http://localhost:8787` öffnen.
