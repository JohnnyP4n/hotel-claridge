# Hotel Claridge

Website van Hotel Claridge in Blankenberge, gebouwd met [Astro](https://docs.astro.build).

## Werken aan de site

Vereist: Node.js 22.12 of nieuwer.

| Commando          | Wat het doet                                             |
| ----------------- | -------------------------------------------------------- |
| `npm install`     | Installeert Astro (eenmalig, of na een `git pull`)       |
| `npm run dev`     | Start de site lokaal op http://localhost:4321/              |
| `npm run build`   | Maakt de publiceerbare site aan in de map `dist/`        |
| `npm run preview` | Toont de gebouwde site uit `dist/` om te controleren     |

## Online zetten

De site staat op GitHub Pages onder het eigen domein: https://hotel-claridge.be
`www.hotel-claridge.be` en het oude adres `johnnyp4n.github.io/hotel-claridge/`
verwijzen daar automatisch naartoe.

Bij elke push naar `main` bouwt GitHub Actions de site en zet ze online
(zie `.github/workflows/deploy.yml`). In de repository moet
**Settings → Pages → Source** op **GitHub Actions** staan en
**Settings → Pages → Custom domain** op `hotel-claridge.be`, met
**Enforce HTTPS** aan.

Het domein staat bij Combell. In de DNS wijzen vier A-records van
`hotel-claridge.be` naar GitHub (185.199.108–111.153) en is `www` een CNAME naar
`johnnyp4n.github.io`. Het bestand `public/CNAME` houdt het domein ingesteld bij
elke publicatie: verwijder het niet. De mail van het hotel (MX bij Combell) staat
hier volledig los van.

Interne links gebruiken `withBase()` uit `src/utils/paths.ts`, bv.
`withBase('/kamers/')`. De site staat nu in de wortel van het domein, dus daar komt
niets meer voor te staan.

## Talen

De site staat in vier talen online: Nederlands, Frans, Engels en Duits.
Het Nederlands staat op de gewone adressen, de andere talen in een taalmap:

| Taal       | Adres                          |
| ---------- | ------------------------------ |
| Nederlands | `/kamers/`                     |
| Frans      | `/fr/kamers/`                  |
| Engels     | `/en/kamers/`                  |
| Duits      | `/de/kamers/`                  |

Alle teksten staan in `src/i18n/`: één bestand per taal (`nl.ts`, `fr.ts`, `en.ts`,
`de.ts`) met exact dezelfde sleutels. `nl.ts` is het voorbeeld; ontbreekt er iets in een
andere taal, dan geeft de editor meteen een foutmelding. Ook de namen en beschrijvingen
van de kamers staan daar (`rooms.items`). Prijzen, foto's en het gsm-nummer staan in
`src/data/`, want die zijn in elke taal hetzelfde. De prijzen die daar staan, zijn de
standaard: het hotel kan ze zelf aanpassen op de adminpagina (zie hieronder).

Een tekst aanpassen doe je dus in de vier bestanden. Rechtsboven in het menu staat de
taalkeuze (NL FR EN DE); die houdt de bezoeker op dezelfde pagina.

## Adminpagina

Op `/admin/` past het hotel zelf aan wat regelmatig verandert:

- de **prijzen** per kamer (laag- en hoogseizoen), de extra bedden en de toeristenbelasting;
- **gesloten periodes**: bovenaan elke pagina verschijnt dan "Wij zijn gesloten van ... tot
  en met ...", in de taal van de bezoeker. De melding verdwijnt vanzelf na de laatste dag,
  en elke periode kan apart aan- of uitgezet worden;
- de **3 + 1 actie** op de tarievenpagina aan of uit.

Aanmelden gebeurt met één wachtwoord, dat als geheim bij Cloudflare staat
(`ADMIN_WACHTWOORD`, zie `worker/README.md`). De pagina staat niet in het menu en niet in
Google.

Onderaan `/admin/` staat ook **"Volgeboekt volgens het kassasysteem"**. Dat is enkel om na
te kijken: het kassasysteem geeft elk uur automatisch door welke nachten helemaal vol zitten,
en die nachten zijn dan niet meer te kiezen in het aanvraagformulier — zonder melding bovenaan
de site. Blijft die lijst langer dan zes uur uit, dan wordt ze genegeerd en staat de kalender
weer volledig open. De installatie staat in `supabase/functions/beschikbaarheid/README.md`
van het project `hotelkassasysteem`; aan deze kant hoort er één geheim bij
(`SYNC_SLEUTEL`, zie `worker/README.md`).

Het opslaan gaat naar hetzelfde script bij Cloudflare als het aanvraagformulier, dat alles
bewaart in Cloudflare KV. **De site moet er niet voor herbouwd worden:** elke pagina haalt
de instellingen op bij het laden en past ze meteen toe (`src/scripts/instellingen.js`).
Een wijziging staat dus binnen de minuut online.

De waarden in `src/data/rooms.ts` en `src/data/instellingen.ts` blijven de standaard: die
zitten in de pagina's zoals ze gebouwd zijn, en blijven staan zolang het hotel niets
aanpaste of als Cloudflare even onbereikbaar is. Wil je een prijs blijvend in de code
zetten, pas ze dan daar aan én op de adminpagina.

## Aanvraagformulier

Het formulier op `/boeking/` gaat naar hetzelfde script bij Cloudflare Workers (map
`worker/`, gratis). Dat mailt de aanvraag via de mailbox bij Combell naar het hotel en
stuurt de gast een bevestiging in zijn eigen taal. De mail naar het hotel blijft
Nederlands, met de taal van de gast erbij. Cloudflare Turnstile houdt spambots tegen. Met
"Beantwoorden" schrijf je de gast meteen terug. Uitleg en installatie: `worker/README.md`.

Ook lokaal (`npm run dev`) verstuurt het formulier echte mails.

## Structuur

```
.github/workflows/   Automatisch bouwen en online zetten via GitHub Pages
public/              Bestanden die ongewijzigd online komen (favicon)
src/
  assets/images/     Foto's en logo's; Astro verkleint en comprimeert ze bij het bouwen
  components/        Onderdelen zoals menu, footer en kamerkaart
  data/              Hotelgegevens, kamers en prijzen (op één plek aanpassen)
  i18n/              Alle teksten, één bestand per taal (nl, fr, en, de)
  layouts/           Paginasjabloon met <head>, menu en footer
  pages/[...lang]/   Eén bestand per pagina; Astro maakt er elke taal van
  pages/admin.astro  De adminpagina op /admin/, los van de gewone site
  scripts/           JavaScript voor de pagina's
  styles/            Stylesheet voor de hele site
  utils/             Hulpfuncties, zoals withBase() voor interne links
worker/              Script bij Cloudflare: aanvragen mailen en instellingen bewaren
astro.config.mjs     Astro-instellingen
```

## To do

- omgeving en info tekst details
- footer met alle gegevens van het hotel
- boek via booking.com knop
- kamertypes klikbaar
- email verzending voor contact via formulier

## Uitbreiding

- eigen boekingssysteem
