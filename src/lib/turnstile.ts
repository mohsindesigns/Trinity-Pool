/* Server-side Cloudflare Turnstile verification.
   Set TURNSTILE_SECRET_KEY to enforce it. With no secret configured the check is
   skipped (logged), so a missing env var can't take every form offline. */

export function turnstileRequired(): boolean {
  return !!process.env.TURNSTILE_SECRET_KEY;
}

export function clientIp(req: Request): string | undefined {
  const fwd = req.headers.get('x-forwarded-for');
  return (fwd ? fwd.split(',')[0].trim() : req.headers.get('x-real-ip')) || undefined;
}

export async function verifyTurnstile(
  token: string | null | undefined,
  ip?: string
): Promise<{ ok: boolean; error?: string }> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.warn('TURNSTILE_SECRET_KEY not set — captcha verification skipped');
    return { ok: true };
  }
  if (!token) return { ok: false, error: 'Please complete the security check.' };

  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip) body.set('remoteip', ip);
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      signal: AbortSignal.timeout(8000),
    });
    const data = (await res.json()) as { success: boolean; 'error-codes'?: string[] };
    if (data.success) return { ok: true };
    console.warn('Turnstile rejected token:', data['error-codes']);
    return { ok: false, error: 'Security check failed. Please try again.' };
  } catch (e) {
    console.error('Turnstile verification error', e);
    return { ok: false, error: 'Could not verify the security check. Please try again.' };
  }
}
