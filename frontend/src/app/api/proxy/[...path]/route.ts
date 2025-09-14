// frontend/src/app/api/proxy/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_DOMAIN;

async function handler(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const path = url.pathname.replace('/api/proxy', '');
    const backendUrl = `${BACKEND_URL}${path}${url.search}`;

    const headers = new Headers(req.headers);
    headers.delete('host');
    headers.delete('content-length');

    const hasBody = req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH';

    const response = await fetch(backendUrl, {
      method: req.method,
      headers: headers,
      body: hasBody ? req.body : null,
      redirect: 'manual',
      // @ts-expect-error - duplex is a new property and may not be in all type definitions
      duplex: hasBody ? 'half' : undefined,
    });

    // Decompress the response body
    const body = await response.arrayBuffer();
    const responseHeaders = new Headers(response.headers);
    responseHeaders.delete('content-encoding');
    responseHeaders.delete('content-length');

    const setCookie = response.headers.get('set-cookie');
    if (setCookie) {
      responseHeaders.set('set-cookie', setCookie);
    }

    return new NextResponse(body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('[PROXY] Error:', error);
    return new NextResponse('Proxy error', { status: 500 });
  }
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE, handler as PATCH };