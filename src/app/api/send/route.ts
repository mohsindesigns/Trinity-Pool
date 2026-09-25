import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Submission from '@/models/Submission';
import { verifyTurnstile, clientIp } from '@/lib/turnstile';
import { buildSubmissionHtml, getReceiverEmail, sendNotification } from '@/lib/mailer';

export async function POST(request: Request) {
  try {
    await connectDB();
    const contentType = request.headers.get('content-type') || '';
    let name, email, phone, message, subject, type, attachmentUrl: string | undefined, extraData: any = {};
    let turnstileToken: string | undefined;
    let attachments: { filename: string; content: Buffer }[] = [];

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      name = formData.get('name') as string;
      email = formData.get('email') as string;
      phone = formData.get('phone') as string;
      message = formData.get('message') as string;
      subject = formData.get('subject') as string || formData.get('_subject') as string;
      type = formData.get('type') as string || 'Career Application';
      turnstileToken = (formData.get('turnstileToken') as string) || undefined;

      // Handle file attachment
      const file = formData.get('attachment') as File;
      if (file && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const { uploadFile } = await import('@/lib/storage');
        const { url } = await uploadFile(file, buffer);
        attachmentUrl = url;
        attachments.push({ filename: file.name, content: buffer });
      }

      // Collect other fields
      formData.forEach((value, key) => {
        if (!['name', 'email', 'phone', 'message', 'subject', '_subject', 'type', 'attachment', '_captcha', '_template', 'turnstileToken', 'cf-turnstile-response'].includes(key)) {
          extraData[key] = value;
        }
      });
    } else {
      const body = await request.json();
      ({ name, email, phone, message, subject, type, turnstileToken, ...extraData } = body);
    }

    // Verify the captcha before any file upload or DB/email work
    const captcha = await verifyTurnstile(turnstileToken, clientIp(request));
    if (!captcha.ok) {
      return NextResponse.json({ error: captcha.error }, { status: 400 });
    }

    // Resilience: ensure required fields for DB save
    name = name || extraData.name || extraData.fullname || extraData.fullName || extraData.contact_name || 'Anonymous';
    email = email || extraData.email || extraData.user_email || extraData.contact_email || 'no-email@provided.com';
    message = message || extraData.message || extraData.comments || extraData.inquiry || 'No message content provided.';

    // Save to database first so a mail problem can never lose a lead
    let submission;
    try {
      submission = await Submission.create({
        name,
        email,
        phone,
        subject,
        message,
        type: type || 'Contact Form',
        attachmentUrl,
        extraData,
      });
    } catch (dbError: any) {
      console.error('DATABASE SAVE ERROR:', dbError);
      // Still try to send the email so the lead isn't lost
    }

    // Notify via Brevo SMTP
    const to = await getReceiverEmail(type);
    const mail = await sendNotification({
      to,
      replyTo: email,
      subject: subject || `New Lead: ${name}`,
      html: buildSubmissionHtml({
        heading: `New Submission — ${type || 'General Inquiry'}`,
        rows: [['Type', type || 'General Inquiry'], ['Name', name], ['Email', email], ['Phone', phone], ['Subject', subject]],
        message,
        extra: extraData,
        attachmentUrl,
      }),
      text: [
        `NEW SUBMISSION - Trinity Pump & Supply`,
        `Type: ${type || 'Contact Form'}`,
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone || 'Not provided'}`,
        `Subject: ${subject || 'No Subject'}`,
        ``,
        message || '',
        ...Object.entries(extraData)
          .filter(([, v]) => v && typeof v !== 'object')
          .map(([k, v]) => `${k}: ${v}`),
      ].join('\n'),
      attachments,
    });

    return NextResponse.json({
      success: true,
      message: mail.ok ? 'Submission saved and email sent' : 'Submission saved (email notification failed)',
      emailSent: mail.ok,
      submissionId: submission?._id,
    });
  } catch (error: any) {
    console.error('CRITICAL API ERROR IN /api/send:', {
      message: error.message,
      stack: error.stack,
      cause: error.cause,
    });
    return NextResponse.json({
      error: 'Critical server error',
      details: error.message,
    }, { status: 500 });
  }
}
