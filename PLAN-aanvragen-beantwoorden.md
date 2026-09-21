# Plan: aanvragen sneller beantwoorden

Doel: de mails "is er nog plaats van ... tot ... en wat kost dat?" beantwoorden zonder
eerst in het planbord te zoeken en daarna zelf een prijs en een tekst op te stellen.

Dit plan raakt twee projecten:

| Stap | Waar | Wat het oplevert |
| ---- | ---- | ---------------- |
| 1 | `hotelkassasysteem` | Een antwoordpaneel: vrije kamers + prijs + kant-en-klare tekst |
| 2 | `hotel-claridge` (site + worker) + Supabase | De site toont echte beschikbaarheid, zodat een deel van de mails nooit verstuurd wordt |
| 3 | later | De inbox zelf; enkel als 1 en 2 niet volstaan |

Uitgangspunt: **er wordt nooit iets automatisch naar een gast verstuurd.** Alles eindigt
bij een tekst die jij nog ziet en zelf verstuurt.


## Waarom niet eerst de mails ophalen

De aanvragen komen binnen op `hotelclaridge@msn.com`. Die inbox uitlezen kan enkel via
Microsoft-OAuth (IMAP met wachtwoord laat Microsoft niet meer toe). Dat is veel bouwwerk
dat bovendien stilvalt telkens een token vervalt — en het lost het verkeerde probleem op.
Het opzoekwerk (vrij? prijs?) is het werk, niet het typen.


## Stap 1 — Antwoordpaneel in het kassasysteem

> **Gebouwd op 21 september 2026** — de knop **Aanvraag** staat in de agenda van het
> kassasysteem. Zie de README daar onder "Aanvraag beantwoorden". Ook de kamers in de
> privéwoning naast het hotel kunnen meegeteld worden: ze staan enkel in dit paneel,
> met hun eigen prijs bij Instellingen.

Alles wat hiervoor nodig is, bestaat al:

| Nodig | Staat in |
| ----- | -------- |
| Wie vrij is, per kamer per nacht | `reservationsStore` + `reservationsClash()` in `src/lib/helpers.ts` |
| Prijs met seizoen, extra bedden, toeristenbelasting | `computeReservationBreakdown()` in `src/lib/pricing.ts` |
| Tekst in NL / FR / EN / DE, mailto- en WhatsApp-link | `src/lib/confirmation.ts` |

### Wat het doet

Eén nieuw paneel (knop "Aanvraag" naast de Agenda-tab). Je vult in:

- aankomst en vertrek (dezelfde datumkiezer als het reservatieformulier)
- aantal personen, eventueel extra bedden
- taal van de gast (standaard Nederlands)

Het toont meteen:

1. **Welke kamertypes vrij zijn** die hele periode — per type het aantal vrije kamers.
2. **De prijs per type** voor het volledige verblijf, uitgesplitst zoals in het
   reservatieformulier (kamer × nachten, toeristenbelasting, extra bed).
3. **Een antwoordtekst** in de taal van de gast, klaar om te versturen.
4. **Knoppen**: kopiëren · openen in mailprogramma · WhatsApp · *in optie zetten*.

Is de periode vol, dan schrijft het paneel de andere mail: het zoekt de dichtstbijzijnde
vrije periode van evenveel nachten (tot 7 dagen vroeger of later) en stelt die voor, of
een ander kamertype dat wél vrij is. Dat is net de mail die je anders twee keer schrijft.

### Nieuwe bestanden

| Bestand | Inhoud |
| ------- | ------ |
| `src/lib/availability.ts` | `freeRoomsBetween(arrival, departure)` en `nearestFreeWindow(...)`: puur rekenwerk op de lijst reservaties, zonder databank |
| `src/lib/availability.test.ts` | Vitest, in de lijn van `pricing.test.ts`: overlap op de randdag, geannuleerde reservaties tellen niet mee, vol → alternatief |
| `src/lib/inquiry.ts` | De antwoordteksten in vier talen, naast `confirmation.ts` en in dezelfde stijl |
| `src/lib/components/Aanvraag.svelte` | Het paneel zelf |

Wijzigingen: een tab/knop in `src/routes/+page.svelte`.

### Hoe het rekent

- **Vrij** = elke kamer uit `roomsStore` zonder reservatie die de periode overlapt
  (`reservationsClash`, dezelfde regel als het planbord gebruikt) en zonder verblijf dat
  er nu al ligt. Geannuleerde reservaties tellen niet mee.
- Vooraf `ensureReservationsFrom(aankomst)` oproepen, anders zitten verre datums nog niet
  in het venster van de agenda en lijkt alles vrij.
- **Prijs** via `computeReservationBreakdown()` op een van de vrije kamers van dat type;
  het kamernummer bepaalt het type (`DEFAULT_ROOM_TYPES`). Het seizoen volgt de
  aankomstmaand — zelfde regel als vandaag, dus een verblijf over de maandgrens rekent
  zoals in het reservatieformulier.
- **Personen** worden afgetoetst aan `maxGuests` per type, en extra bedden enkel bij de
  types waar `isExtraBedAllowed()` ze toelaat. Meer personen dan in één kamer passen →
  het paneel stelt twee kamers voor en telt de prijzen op.

### "In optie zetten"

Het echte risico is een kamer twee keer beloven terwijl een gast nog nadenkt. De knop
maakt daarom meteen een reservatie aan met bron `email` (die waarde staat al in de enum),
op naam van de gast, met in de opmerkingen `OPTIE tot <datum>`.

Open vraag: een aparte status `option` naast `booked` en `cancelled` is netter (dan kan de
agenda ze apart kleuren en filteren), maar vraagt een migratie in Supabase. Voorstel:
beginnen met de opmerking, en de status later toevoegen als het bevalt.

### Omvang

Ongeveer een halve dag, tests inbegrepen. Er komt geen nieuwe techniek bij: het is bestaande
logica die aan elkaar geknoopt wordt.


## Stap 2 — Beschikbaarheid op de website

> **Gebouwd op 21 september 2026** — het werkt lokaal van begin tot eind, maar staat nog
> niet online: er moet eerst een gedeeld geheim ingesteld worden en de functie bij Supabase
> geïnstalleerd (zie "Online zetten" onderaan dit hoofdstuk).

Vandaag zet je "volgeboekt" met de hand in `/admin/`. Dat kan automatisch.

### Hoe het loopt

1. **Supabase Edge Function `beschikbaarheid`**, elk uur via cron (zoals `viva-terminal`
   al draait). Ze leest de reservaties van vandaag tot circa een jaar vooruit en rekent per
   nacht uit of álle kamers bezet zijn, per kamertype.
2. Ze stuurt dat lijstje naar de worker: `PUT /beschikbaarheid`, met een gedeeld geheim in
   de header (`npx wrangler secret put SYNC_SLEUTEL`). Geen namen, geen aantallen — enkel
   welke nachten vol zitten, plus het tijdstip van de berekening.
3. **De worker** bewaart het onder een eigen KV-sleutel, los van `instellingen`. Zo kan
   `/admin/` niets overschrijven en de synchronisatie niets van jouw meldingen.
4. `GET /instellingen` geeft die volle nachten mee als extra periodes, met reden
   `volgeboekt`. **De datumkiezer blokkeert ze dan vanzelf**: die luistert al naar
   `claridge-periodes` (zie `src/scripts/instellingen.js:80` en `src/scripts/datumkiezer.js:638`).
   Aan de site zelf verandert er dus bijna niets.

### Vangrails

- **Verouderde gegevens negeren.** Is de laatste berekening ouder dan 6 uur (cron stuk,
  Supabase onbereikbaar), dan geeft de worker ze niet meer door. Liever een aanvraag te
  veel dan een gast die ten onrechte "vol" ziet.
- **Jouw eigen sluitingen blijven.** Verlof en werken zet je verder met de hand in
  `/admin/`; de twee lijsten worden samengevoegd, niet vervangen.
- **Enkel vol/niet vol naar buiten.** "Nog 2 kamers vrij" verkoopt beter, maar zet je
  bezetting ook op straat voor de buren en voor Booking.com. Advies: niet doen.
- **Voorwaarde:** de site is maar zo juist als het planbord. Booking.com-reservaties moeten
  er dus in staan, anders belooft de site nachten die al weg zijn. Dit is het echte risico
  van stap 2 — geen technisch, maar een werkafspraak.

### Online zetten

Drie stappen, in deze volgorde:

1. **Geheim afspreken en de worker bijwerken** (één lange sleutel, aan beide kanten gelijk):

   ```bash
   cd ~/Documents/hotel-claridge/worker && npx wrangler secret put SYNC_SLEUTEL
   ```

   ```bash
   cd ~/Documents/hotel-claridge/worker && npx wrangler deploy
   ```

2. **De site publiceren** (de kalender en de adminpagina): gewoon pushen naar `main`,
   GitHub Actions doet de rest.

3. **De functie bij Supabase installeren**, met dezelfde sleutel en een cron-taak die haar
   elk uur aanroept: `supabase/functions/beschikbaarheid/README.md` in het project
   `hotelkassasysteem`.

Nakijken of het loopt: open `/admin/` op de site. Onderaan staat "Volgeboekt volgens het
kassasysteem" met het aantal nachten en het tijdstip van de laatste doorgave. Staat daar
niets, dan blokkeert de kalender ook niets — de site werkt dan gewoon zoals voordien.

### Optioneel, meteen erbij

Een prijsindicatie in het aanvraagformulier ("3 nachten, Type A: € 360 + € 15
toeristenbelasting"). De prijzen staan al in de KV van de worker, dus dat is enkel rekenwerk
in de pagina.


## Stap 3 — Pas later: de inbox zelf

Blijven er dan nog losse mails over, dan is de werkbare vorm *niet* een inbox uitlezen,
maar de mail naar een script laten komen dat jou een **concept** terugstuurt:

- Cloudflare Email Routing → worker die de datums uit de mail haalt en jou mailt met
  "12–15 juli, 2 pers → Type A en C vrij, € 360" plus de klare tekst. Voorwaarde: de DNS
  van `hotel-claridge.be` moet dan bij Cloudflare staan, en die staat bij Combell. De mail
  zelf kan bij Combell blijven (MX-records mee verhuizen), maar het is een verhuis.
- Of een doorstuurregel in Outlook naar een dienst die inkomende mail als webhook doorgeeft.
  Geen DNS-verhuis, wel een externe partij erbij.

Beide zijn pas de moeite als stap 1 en 2 het aantal mails niet genoeg terugbrengen.


## Volgorde

1. Stap 1 bouwen en een week gebruiken. Dat is de grootste tijdwinst en verandert niets aan
   wat gasten zien.
2. Stap 2 erna, eerst met de melding zichtbaar in `/admin/` zodat je kan nakijken of de
   berekende volle nachten kloppen vóór de kalender ze blokkeert.
3. Stap 3 herbekijken, met cijfers in de hand.


## Open vragen

- Aparte status `option` in de databank, of voorlopig een opmerking?
- Hoort de knop bij de Agenda-tab of apart in de balk bovenaan?
- Mag het paneel ook een geplakte mail lezen en er zelf datums uit halen, of vul je die
  liever altijd zelf in?
