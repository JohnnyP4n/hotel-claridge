# Aanvraagscript (Cloudflare Worker)

Ontvangt de aanvragen van het formulier op `/boeking/` en mailt ze naar het hotel via de
eigen mailbox bij Combell. Het draait gratis op Cloudflare Workers (100.000 aanvragen per dag).

- Code: `src/index.js`
- Instellingen (ontvanger, mailbox, toegelaten sites): `wrangler.jsonc`
- Het mailboxwachtwoord staat als geheim bij Cloudflare, nooit in GitHub.

## Eerste keer online zetten

Vooraf bij Combell (E-mail hosting → hotel-claridge.be):

- een **mailbox** `website@hotel-claridge.be` (een doorverwijzing zoals `info@` kan niet inloggen);
- bij DNS een SPF-record (TXT, hostnaam leeg): `v=spf1 include:_spf.relay.mailprotect.be -all`,
  zodat de mails niet als spam aankomen.

Daarna in deze map (`cd worker`):

```bash
npm install
npx wrangler login
npx wrangler deploy
npx wrangler secret put SMTP_PASSWORD
```

- `wrangler login` opent de browser om Cloudflare toegang te geven.
- `wrangler deploy` zet het script online en toont het adres (`https://...workers.dev`).
  Dat adres komt in `src/pages/boeking.astro` bij `formEndpoint`.
- `wrangler secret put` vraagt het wachtwoord van de mailbox uit `SMTP_USER`.

## Aanpassen

Na een wijziging in `src/index.js` of `wrangler.jsonc`: `npx wrangler deploy`.
Een nieuw wachtwoord: opnieuw `npx wrangler secret put SMTP_PASSWORD`.

Foutmeldingen staan in Cloudflare onder **Workers & Pages → hotel-claridge-aanvraag → Logs**.

## Lokaal testen

`npm run dev` start het script op http://localhost:8787. De site in `npm run dev` stuurt het
formulier daarheen. Maak daarvoor een bestand `.dev.vars` (staat niet in GitHub) met:

```
SMTP_PASSWORD=wachtwoord-van-de-mailbox
```

Let op: zo vertrekt er een echte mail naar `MAIL_TO`.
