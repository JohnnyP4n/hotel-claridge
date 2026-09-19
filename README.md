# Hotel Claridge

Website van Hotel Claridge in Blankenberge, gebouwd met [Astro](https://docs.astro.build).

## Werken aan de site

Vereist: Node.js 22.12 of nieuwer.

| Commando          | Wat het doet                                             |
| ----------------- | -------------------------------------------------------- |
| `npm install`     | Installeert Astro (eenmalig, of na een `git pull`)       |
| `npm run dev`     | Start de site lokaal op http://localhost:4321/hotel-claridge/ |
| `npm run build`   | Maakt de publiceerbare site aan in de map `dist/`        |
| `npm run preview` | Toont de gebouwde site uit `dist/` om te controleren     |

## Online zetten

De site staat op GitHub Pages: https://johnnyp4n.github.io/hotel-claridge/

Bij elke push naar `main` bouwt GitHub Actions de site en zet ze online
(zie `.github/workflows/deploy.yml`). In de repository moet
**Settings → Pages → Source** op **GitHub Actions** staan.

Omdat de site in de submap `/hotel-claridge` staat, gebruiken interne links
`withBase()` uit `src/utils/paths.ts`, bv. `withBase('/kamers/')`.

## Aanvraagformulier

Het formulier op `/boeking/` gaat naar een eigen script bij Cloudflare Workers (map
`worker/`, gratis). Dat mailt de aanvraag via de mailbox bij Combell naar het hotel en stuurt
de gast een bevestiging. Cloudflare Turnstile houdt spambots tegen. Met "Beantwoorden" schrijf
je de gast meteen terug. Uitleg en installatie: `worker/README.md`.

Ook lokaal (`npm run dev`) verstuurt het formulier echte mails.

## Structuur

```
.github/workflows/   Automatisch bouwen en online zetten via GitHub Pages
public/              Bestanden die ongewijzigd online komen (favicon)
src/
  assets/images/     Foto's en logo's; Astro verkleint en comprimeert ze bij het bouwen
  components/        Onderdelen zoals menu, footer en kamerkaart
  data/              Hotelgegevens, kamers en prijzen (op één plek aanpassen)
  layouts/           Paginasjabloon met <head>, menu en footer
  pages/             Eén bestand per pagina; de bestandsnaam wordt de URL
  scripts/           JavaScript voor de pagina's
  styles/            Stylesheet voor de hele site
  utils/             Hulpfuncties, zoals withBase() voor interne links
worker/              Script bij Cloudflare dat het aanvraagformulier mailt
astro.config.mjs     Astro-instellingen
```

## To do

- omgeving en info tekst details
- footer met alle gegevens van het hotel
- boek via booking.com knop
- kamertypes klikbaar
- email verzending voor contact via formulier
- verschillende talen FR/EN/DU

## Uitbreiding

- eigen boekingssysteem
