# Hotel Claridge

Website van Hotel Claridge in Blankenberge, gebouwd met [Astro](https://docs.astro.build).

## Werken aan de site

Vereist: Node.js 22.12 of nieuwer.

| Commando          | Wat het doet                                             |
| ----------------- | -------------------------------------------------------- |
| `npm install`     | Installeert Astro (eenmalig, of na een `git pull`)       |
| `npm run dev`     | Start de site lokaal op http://localhost:4321            |
| `npm run build`   | Maakt de publiceerbare site aan in de map `dist/`        |
| `npm run preview` | Toont de gebouwde site uit `dist/` om te controleren     |

Om de site online te zetten, upload je de inhoud van `dist/` naar de hosting.

## Structuur

```
public/              Bestanden die ongewijzigd online komen (favicon)
src/
  assets/images/     Foto's en logo's; Astro verkleint en comprimeert ze bij het bouwen
  components/        Onderdelen die op elke pagina staan (Header, Footer)
  layouts/           Paginasjabloon met <head>, menu en footer
  pages/             Eén bestand per pagina; de bestandsnaam wordt de URL
  scripts/           JavaScript voor de pagina's
  styles/            Stylesheet voor de hele site
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

- reserveringsformulier verzending via email
- eigen boekingssysteem
