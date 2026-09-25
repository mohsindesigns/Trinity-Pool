import nodemailer from 'nodemailer';
import connectDB from '@/lib/mongodb';
import Content from '@/models/Content';

/* Brevo SMTP mailer used by every website form (/api/contact, /api/send).
   Credentials live in env: BREVO_SMTP_HOST / _PORT / _USER / _KEY, MAIL_FROM
   (MAIL_FROM must be a sender or domain verified inside Brevo). */

const FALLBACK_RECEIVER = 'olin@trinitypumpsupply.com';

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;
  const user = process.env.BREVO_SMTP_USER;
  const pass = process.env.BREVO_SMTP_KEY;
  if (!user || !pass) return null;
  const port = parseInt(process.env.BREVO_SMTP_PORT || '587', 10);
  transporter = nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com',
    port,
    secure: port === 465, // 587 upgrades with STARTTLS
    auth: { user, pass },
  });
  return transporter;
}

export function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Receiver address from the CMS (quote email for quotes, contact email otherwise). */
export async function getReceiverEmail(type?: string): Promise<string> {
  let receiver = FALLBACK_RECEIVER;
  try {
    await connectDB();
    const doc = (await Content.findOne({ key: 'complete_data' }).lean()) as any;
    const data = doc?.data;
    if (data) {
      const candidates = [
        type === 'Quote Request' ? data.quote?.email : undefined,
        data.contactPage?.email,
        data.settings?.contactEmail,
        data.company?.email,
        data.contactFaq?.contactInfo?.email,
        data.footer?.contact?.email,
        data.quote?.email,
      ];
      const found = candidates.find((c) => typeof c === 'string' && c.includes('@'));
      if (found) receiver = found;
    }
  } catch (e) {
    console.error('Error fetching receiver email', e);
  }
  receiver = (receiver || '').replace(/\s+/g, '').toLowerCase();
  return receiver.includes('@') ? receiver : FALLBACK_RECEIVER;
}

interface NotifyArgs {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  attachments?: { filename: string; content: Buffer }[];
}

/** Sends through Brevo. Never throws: returns { ok, error } so a mail problem can't lose a submission. */
export async function sendNotification(args: NotifyArgs): Promise<{ ok: boolean; error?: string }> {
  const t = getTransporter();
  if (!t) {
    console.error('Brevo SMTP not configured (BREVO_SMTP_USER / BREVO_SMTP_KEY missing)');
    return { ok: false, error: 'Email service not configured' };
  }
  try {
    const from = process.env.MAIL_FROM || FALLBACK_RECEIVER;
    await t.sendMail({
      from: `"Trinity Pump & Supply" <${from}>`,
      to: args.to,
      subject: args.subject,
      html: args.html,
      text: args.text,
      replyTo: args.replyTo && args.replyTo.includes('@') ? args.replyTo : undefined,
      attachments: args.attachments,
    });
    return { ok: true };
  } catch (err: any) {
    console.error('Brevo SMTP send failed:', err?.message || err);
    return { ok: false, error: err?.message || 'Send failed' };
  }
}

/** Shared HTML layout for every form notification. */
export function buildSubmissionHtml(opts: {
  heading: string;
  rows: [string, string | undefined | null][];
  message?: string;
  extra?: Record<string, unknown>;
  attachmentUrl?: string;
}) {
  const rows = opts.rows
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 0;color:#888;width:120px;vertical-align:top">${escapeHtml(k)}:</td><td style="padding:8px 0;font-weight:600;color:#1a1a1a">${escapeHtml(v)}</td></tr>`
    )
    .join('');
  const extraRows = Object.entries(opts.extra || {})
    .filter(([, v]) => v && typeof v !== 'object')
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 0;color:#888;width:160px;vertical-align:top">${escapeHtml(k.replace(/_/g, ' '))}:</td><td style="padding:6px 0;color:#333">${escapeHtml(v)}</td></tr>`
    )
    .join('');
  const attachment = opts.attachmentUrl
    ? `<p style="margin-top:16px"><a href="${escapeHtml(/^https?:\/\//.test(opts.attachmentUrl) ? opts.attachmentUrl : `${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || ''}${opts.attachmentUrl}`)}">Download attachment</a></p>`
    : '';
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #eee;padding:24px;border-radius:10px">
      <h2 style="color:#1a1a1a;border-bottom:2px solid #be9c25;padding-bottom:10px;margin-top:0">${escapeHtml(opts.heading)}</h2>
      <table style="width:100%;border-collapse:collapse">${rows}</table>
      ${opts.message ? `<div style="margin-top:16px;padding:14px;background:#f9f9f9;border-radius:6px"><p style="color:#888;margin:0 0 6px">Message:</p><p style="margin:0;color:#333;white-space:pre-wrap">${escapeHtml(opts.message)}</p></div>` : ''}
      ${extraRows ? `<p style="margin:20px 0 6px;color:#888">Additional details</p><table style="width:100%;border-collapse:collapse">${extraRows}</table>` : ''}
      ${attachment}
      <p style="margin-top:24px;font-size:12px;color:#aaa">Sent from the Trinity Pump &amp; Supply website</p>
    </div>`;
}
