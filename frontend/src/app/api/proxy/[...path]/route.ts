// frontend/src/app/api/proxy/[...path]/route.ts
import { NextRequest } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_DOMAIN;

async function handler(req: NextRequest) {
  const url = new URL(req.url);
  const path = url.pathname.replace('/api/proxy', '');
  const backendUrl = `${BACKEND_URL}${path}${url.search}`;

  const headers = new Headers(req.headers);
  headers.delete('host');

  const response = await fetch(backendUrl, {
    method: req.method,
    headers: headers,
    body: req.body,
    redirect: 'manual',
    // @ts-expect-error - duplex is a new property and may not be in all type definitions
    duplex: 'half',
  });

  return response;
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE, handler as PATCH };
