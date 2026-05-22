import { NextResponse } from 'next/server';
import { login } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    const success = await login(password);

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
