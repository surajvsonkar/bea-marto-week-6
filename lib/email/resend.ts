import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'CardVault <onboarding@resend.dev>';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Email send error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email service error:', error);
    return { success: false, error };
  }
}

export function newSubmissionEmail(name: string, email: string) {
  return {
    subject: `New Submission: ${name}`,
    html: `
      <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 24px; background: #0f172a;">
        <div style="background: #1e293b; border-radius: 16px; padding: 32px; border: 1px solid rgba(255,255,255,0.1);">
          <h1 style="color: #14b8a6; font-size: 20px; font-weight: 700; margin: 0 0 8px;">CardVault</h1>
          <h2 style="color: #f1f5f9; font-size: 24px; font-weight: 700; margin: 0 0 16px;">New Submission Received 📋</h2>
          <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
            <strong style="color: #e2e8f0;">${name}</strong> (${email}) has submitted a new business card for review.
          </p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin" style="display: inline-block; background: #14b8a6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
            Review Submission
          </a>
        </div>
      </div>
    `,
  };
}
