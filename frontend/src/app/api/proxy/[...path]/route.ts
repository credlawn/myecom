// frontend/src/app/api/proxy/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_DOMAIN;

async function handler(req: NextRequest) {
  try {
    console.log(`[PROXY] NEXT_PUBLIC_DOMAIN: ${process.env.NEXT_PUBLIC_DOMAIN}`);

    const url = new URL(req.url);
    const path = url.pathname.replace('/api/proxy', '');
    const backendUrl = `${BACKEND_URL}${path}${url.search}`;
    console.log(`[PROXY] Forwarding to: ${backendUrl}`);

    const headers = new Headers(req.headers);
    headers.delete('host');

    const hasBody = req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH';

    const response = await fetch(backendUrl, {
      method: req.method,
      headers: headers,
      body: hasBody ? req.body : null,
      redirect: 'manual',
      // @ts-expect-error - duplex is a new property and may not be in all type definitions
      duplex: hasBody ? 'half' : undefined,
    });

    const responseHeaders = new Headers(response.headers);
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) {
      responseHeaders.set('set-cookie', setCookie);
    }

    return new NextResponse(response.body, {
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
