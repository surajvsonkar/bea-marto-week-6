import { NextResponse } from 'next/server';
import { sendEmail, newSubmissionEmail } from '@/lib/email/resend';

export async function POST(request: Request) {
  try {
    const { name, email } = await request.json();
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail) {
      return NextResponse.json({ error: 'Admin email not configured' }, { status: 500 });
    }

    const { subject, html } = newSubmissionEmail(name, email);
    await sendEmail({ to: adminEmail, subject, html });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Notification error:', error);
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
}
