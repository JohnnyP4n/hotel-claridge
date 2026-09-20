// Eén manier om te antwoorden, voor alle onderdelen van het script: altijd JSON,
// altijd met de CORS-headers die de browser nodig heeft om het antwoord te mogen lezen.
export function reply(status, data, headers = {}) {
    return Response.json(data, { status, headers });
}
