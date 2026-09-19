# Aanvraagscript (Cloudflare Worker)

Ontvangt de aanvragen van het formulier op `/boeking/`, controleert met Cloudflare Turnstile
dat er een mens achter zit, mailt de aanvraag naar het hotel en stuurt de gast een
bevestiging. Het mailen gaat via de mailbox `website@hotel-claridge.be` bij Combell.
Het draait gratis op Cloudflare Workers (100.000 aanvragen per dag).

- Code: `src/index.js`
- Instellingen (ontvanger, mailbox, toegelaten sites): `wrangler.jsonc`
- Het mailboxwachtwoord en de geheime Turnstile-sleutel staan als geheim bij Cloudflare,
  nooit in GitHub.

## Eerste keer online zetten

Vooraf bij Combell (E-mail hosting → hotel-claridge.be):

- een **mailbox** `website@hotel-claridge.be` (een doorverwijzing zoals `info@` kan niet inloggen);
- bij DNS een SPF-record (TXT, hostnaam leeg): `v=spf1 include:_spf.relay.mailprotect.be -all`,
  zodat de mails niet als spam aankomen.

Vooraf bij Cloudflare: een **Turnstile-widget** met als hostnamen `johnnyp4n.github.io` en
`localhost`. De sitekey komt in `src/pages/boeking.astro` (`turnstileSiteKey`).

Daarna in deze map (`cd worker`):

```bash
npm install
npx wrangler login
npx wrangler deploy
npx wrangler secret put SMTP_PASSWORD
npx wrangler secret put TURNSTILE_SECRET
```

- `wrangler login` opent de browser om Cloudflare toegang te geven.
- `wrangler deploy` zet het script online op `https://hotel-claridge-aanvraag.hotelclaridge.workers.dev`.
- `wrangler secret put` vraagt het wachtwoord van de mailbox uit `SMTP_USER`, of de geheime
  sleutel van de Turnstile-widget.

## Aanpassen

Na een wijziging in `src/index.js` of `wrangler.jsonc`: `npx wrangler deploy`. Een push naar
GitHub zet enkel de site online, niet dit script.

Een nieuw wachtwoord of nieuwe sleutel: opnieuw `npx wrangler secret put ...`.

Foutmeldingen staan in Cloudflare onder **Workers & Pages → hotel-claridge-aanvraag → Logs**.

Komt de site op een ander adres (bv. `www.hotel-claridge.be`), voeg het dan toe aan
`ALLOWED_ORIGINS` in `wrangler.jsonc` en als hostnaam bij de Turnstile-widget.

## Testen

Ook de site op `npm run dev` (localhost) stuurt naar het echte script: elke test verstuurt
dus echte mails, naar het hotel en naar het ingevulde e-mailadres.
