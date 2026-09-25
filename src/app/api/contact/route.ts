import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Submission from '@/models/Submission';
import { verifyTurnstile, clientIp } from '@/lib/turnstile';
import { buildSubmissionHtml, getReceiverEmail, sendNotification } from '@/lib/mailer';

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, email, phone, service, message, turnstileToken } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required.' },
        { status: 400 }
      );
    }

    const captcha = await verifyTurnstile(turnstileToken, clientIp(request));
    if (!captcha.ok) {
      return NextResponse.json({ error: captcha.error }, { status: 400 });
    }

    // Save to database first so a mail problem can never lose a lead
    const submission = await Submission.create({
      name,
      email,
      phone: phone || '',
      subject: service || '',
      message: message || '',
      type: 'Contact Form',
      source: 'Website Contact Form',
      extraData: service ? { service } : undefined,
    });

    // Notify via Brevo SMTP (failure is logged, submission stays saved)
    const to = await getReceiverEmail('Contact Form');
    const mail = await sendNotification({
      to,
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      html: buildSubmissionHtml({
        heading: 'New Contact Form Submission',
        rows: [['Name', name], ['Email', email], ['Phone', phone], ['Service', service]],
        message,
      }),
      text: `New contact form submission\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || '-'}\nService: ${service || '-'}\n\n${message || ''}`,
    });

    return NextResponse.json({
      success: true,
      message: 'Your message has been submitted successfully.',
      emailSent: mail.ok,
      id: submission._id,
    });
  } catch (error: any) {
    console.error('Contact Form Error:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact form.' },
      { status: 500 }
    );
  }
}
