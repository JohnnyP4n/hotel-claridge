# Script bij Cloudflare (Worker)

Het script dat de website van achter de schermen bedient. Het doet twee dingen:

1. **Aanvragen mailen.** Het formulier op `/boeking/` komt hier binnen. Cloudflare Turnstile
   controleert dat er een mens achter zit; daarna gaat de aanvraag naar het hotel en krijgt
   de gast een bevestiging in zijn eigen taal (Nederlands, Frans, Engels of Duits; de teksten
   staan bovenaan `src/aanvraag.js` bij `LANGUAGES`). De mail naar het hotel blijft Nederlands,
   met de taal van de gast erbij. Het mailen gaat via de mailbox `website@hotel-claridge.be`
   bij Combell.
2. **Instellingen bewaren.** Wat het hotel aanpast op de adminpagina `/admin/` — de prijzen,
   de gesloten periodes en de 3 + 1 actie — staat hier in Cloudflare KV. Elke pagina van de
   site haalt dat op en past het meteen toe, zonder dat de site opnieuw gebouwd moet worden.

Het draait gratis op Cloudflare Workers (100.000 aanvragen per dag).

| Bestand               | Wat erin staat                                                |
| --------------------- | ------------------------------------------------------------- |
| `src/index.js`        | Verdeelt de aanvragen over de bestanden hieronder              |
| `src/aanvraag.js`     | De aanvraag van `/boeking/` mailen                             |
| `src/instellingen.js` | De instellingen van `/admin/` bewaren en teruggeven            |
| `src/antwoord.js`     | Eén manier van antwoorden voor alles                           |
| `wrangler.jsonc`      | Instellingen: ontvanger, mailbox, toegelaten sites, KV         |

Het mailboxwachtwoord, de geheime Turnstile-sleutel en het wachtwoord van de adminpagina
staan als geheim bij Cloudflare, nooit in GitHub.

## Adressen

| Adres                     | Wat het doet                                              |
| ------------------------- | --------------------------------------------------------- |
| `POST /`                  | Een verblijfsaanvraag van het formulier op `/boeking/`     |
| `GET /instellingen`       | De prijzen en meldingen, voor elke pagina van de site      |
| `POST /admin/aanmelden`   | Aanmelden op `/admin/` met het adminwachtwoord             |
| `PUT /admin/instellingen` | Nieuwe prijzen en meldingen bewaren                        |

Enkel de eigen site mag deze adressen gebruiken (`ALLOWED_ORIGINS` in `wrangler.jsonc`).
Opslaan kan enkel met een sleutel die je krijgt bij het aanmelden; die blijft 12 uur geldig.

## Eerste keer online zetten

Vooraf bij Combell (E-mail hosting → hotel-claridge.be):

- een **mailbox** `website@hotel-claridge.be` (een doorverwijzing zoals `info@` kan niet inloggen);
- bij DNS een SPF-record (TXT, hostnaam leeg): `v=spf1 include:_spf.relay.mailprotect.be -all`,
  zodat de mails niet als spam aankomen.

Vooraf bij Cloudflare: een **Turnstile-widget** met als hostnamen `hotel-claridge.be`,
`www.hotel-claridge.be`, `johnnyp4n.github.io` en `localhost`. De sitekey komt in `src/pages/[...lang]/boeking.astro` (`turnstileSiteKey`).

Daarna, elk commando op één regel:

```bash
cd ~/Documents/hotel-claridge/worker && npm install
```

```bash
cd ~/Documents/hotel-claridge/worker && npx wrangler login
```

De bewaarplaats voor de instellingen (`INSTELLINGEN`) bestaat al en staat met haar id in
`wrangler.jsonc`. Moet ze ooit opnieuw aangemaakt worden, bv. op een ander Cloudflare-account:

```bash
cd ~/Documents/hotel-claridge/worker && npx wrangler kv namespace create INSTELLINGEN
```

Dat toont een id; zet die in `wrangler.jsonc` bij `kv_namespaces`. De id's van de bestaande
bewaarplaatsen opvragen kan met `npx wrangler kv namespace list`.

Daarna online zetten en de drie wachtwoorden ingeven:

```bash
cd ~/Documents/hotel-claridge/worker && npx wrangler deploy
```

```bash
cd ~/Documents/hotel-claridge/worker && npx wrangler secret put SMTP_PASSWORD
```

```bash
cd ~/Documents/hotel-claridge/worker && npx wrangler secret put TURNSTILE_SECRET
```

```bash
cd ~/Documents/hotel-claridge/worker && npx wrangler secret put ADMIN_WACHTWOORD
```

- `wrangler login` opent de browser om Cloudflare toegang te geven.
- `wrangler deploy` zet het script online op `https://hotel-claridge-aanvraag.hotelclaridge.workers.dev`.
- `wrangler secret put` vraagt het wachtwoord van de mailbox uit `SMTP_USER`, de geheime
  sleutel van de Turnstile-widget, of het wachtwoord waarmee je op `/admin/` aanmeldt.
  Kies voor `ADMIN_WACHTWOORD` een lang wachtwoord: het is het enige slot op die pagina.

## Aanpassen

Na een wijziging in `src/` of `wrangler.jsonc`:

```bash
cd ~/Documents/hotel-claridge/worker && npx wrangler deploy
```

Een push naar GitHub zet enkel de site online, niet dit script.

Een nieuw wachtwoord of nieuwe sleutel: opnieuw `npx wrangler secret put ...`. Wijzig je
`ADMIN_WACHTWOORD`, dan moet iedereen die op `/admin/` aangemeld was zich opnieuw aanmelden.

Foutmeldingen staan in Cloudflare onder **Workers & Pages → hotel-claridge-aanvraag → Logs**.

Komt de site op een ander adres (bv. `www.hotel-claridge.be`), voeg het dan toe aan
`ALLOWED_ORIGINS` in `wrangler.jsonc` en als hostnaam bij de Turnstile-widget.

## Testen

Ook de site op `npm run dev` (localhost) stuurt naar het echte script: elke test verstuurt
dus echte mails, naar het hotel en naar het ingevulde e-mailadres. Ook de instellingen die
je lokaal via `/admin/` opslaat, komen meteen op de echte site terecht.

Wil je eerst los van de echte site proberen, start dan het script op deze computer:

```bash
cd ~/Documents/hotel-claridge/worker && npx wrangler dev
```

Zet dan `workerUrl` in `src/data/instellingen.ts` tijdelijk op `http://localhost:8787`, en
maak in deze map een bestand `.dev.vars` met bijvoorbeeld `ADMIN_WACHTWOORD="test"`. Dat
bestand staat in `.gitignore` en komt nooit op GitHub. De instellingen blijven dan op deze
computer staan; de echte site verandert niet. Zet `workerUrl` achteraf terug.
