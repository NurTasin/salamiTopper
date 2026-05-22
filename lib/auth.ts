import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const secretKey = process.env.ADMIN_COOKIE_SECRET;
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: Record<string, unknown>) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key);
}

export async function decrypt(input: string): Promise<Record<string, unknown>> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  });
  return payload as Record<string, unknown>;
}

export async function login(password: string) {
  if (password === process.env.ADMIN_PASSWORD) {
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const session = await encrypt({ admin: true, expires: expires.getTime() });

    cookies().set('admin_session', session, { expires, httpOnly: true });
    return true;
  }
  return false;
}

export async function logout() {
  cookies().set('admin_session', '', { expires: new Date(0) });
}

export async function getSession() {
  const session = cookies().get('admin_session')?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get('admin_session')?.value;
  if (!session) return;

  const parsed = await decrypt(session);
  parsed.expires = Date.now() + 24 * 60 * 60 * 1000;
  const res = NextResponse.next();
  res.cookies.set({
    name: 'admin_session',
    value: await encrypt(parsed),
    httpOnly: true,
    expires: new Date(parsed.expires as number),
  });
  return res;
}
