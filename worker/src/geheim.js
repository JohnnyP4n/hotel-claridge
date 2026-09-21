// Wachtwoorden en sleutels vergelijken zonder dat de duur van de vergelijking verraadt
// hoeveel tekens al kloppen. Gebruikt door de adminpagina (instellingen.js) en door de
// koppeling met het kassasysteem (beschikbaarheid.js).

/** True als beide teksten exact gelijk zijn; even snel, wat er ook ingevuld werd. */
export async function zelfdeTekst(a, b) {
    // Eerst versleuteld samenvatten, zodat de vergelijking altijd 32 bytes lang is.
    const encoder = new TextEncoder();
    const [eerste, tweede] = await Promise.all([
        crypto.subtle.digest('SHA-256', encoder.encode(a)),
        crypto.subtle.digest('SHA-256', encoder.encode(b)),
    ]);
    return crypto.subtle.timingSafeEqual(eerste, tweede);
}
