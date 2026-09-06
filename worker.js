// Worker para redirigir .org / www → canónico y servir /salud
addEventListener('fetch', event => {
  event.respondWith(handle(event.request))
})

const CANONICAL = 'https://uroclinic-drjovani.pages.dev'
const ALIASES = ['drjovaniurologo.org', 'www.drjovaniurologo.org']

function securityHeaders() {
  return {
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'no-referrer-when-downgrade',
    // Permissions-Policy: block camera, microphone, geolocation
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
  }
}

async function handle(request) {
  const url = new URL(request.url)
  const host = url.hostname

  // /salud endpoint
  if (url.pathname === '/salud') {
    const body = JSON.stringify({
      ok: true,
      brand: 'UROCLINIC',
      canonical: CANONICAL
    })
    const headers = new Headers({
      'Content-Type': 'application/json; charset=utf-8',
      ...securityHeaders()
    })
    return new Response(body, { status: 200, headers })
  }

  // Reject POSTs (no subir estudios / PHI via edge)
  if (request.method === 'POST' || request.method === 'PUT' || request.method === 'PATCH' || request.method === 'DELETE') {
    const headers = new Headers({
      'Content-Type': 'text/plain; charset=utf-8',
      ...securityHeaders()
    })
    return new Response('Method not allowed', { status: 405, headers })
  }

  // If host is an alias, redirect preserving path & query
  if (ALIASES.includes(host)) {
    const target = new URL(CANONICAL + url.pathname)
    target.search = url.search
    const headers = new Headers({
      Location: target.toString(),
      ...securityHeaders()
    })
    // 301 permanent redirect
    return new Response(null, { status: 301, headers })
  }

  // For other hosts, pass-through (or respond 404)
  const headers = new Headers({
    'Content-Type': 'text/plain; charset=utf-8',
    ...securityHeaders()
  })
  return new Response('Not Found', { status: 404, headers })
}
