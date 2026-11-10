import tls from 'tls'
import net from 'net'
import type { CitizenInquiry } from './dataStore'

export interface EmailPayload {
  to: string
  from?: string
  replyTo?: string
  subject: string
  text: string
  html?: string
}

export interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
  provider?: 'resend' | 'smtp' | 'sendgrid' | 'simulated'
}

/**
 * Validates standard email address format (RFC 5322 regex)
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
  return emailRegex.test(email.trim())
}

/**
 * Sanitizes header values to prevent email-header injection attacks
 */
export function sanitizeHeader(input: string): string {
  if (!input || typeof input !== 'string') return ''
  return input.replace(/[\r\n\t]/g, ' ').trim()
}

/**
 * Resolves the public site URL for inclusion in email links
 */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, '')}`
  }
  return 'https://angolela-tera.vercel.app'
}

/**
 * 1. Sends email via Resend REST API (Recommended for Next.js on Vercel)
 * Uses native fetch over HTTPS port 443 — 100% cloud & serverless compatible.
 */
async function sendViaResend(
  apiKey: string,
  payload: EmailPayload
): Promise<EmailResult> {
  try {
    const fromAddress =
      payload.from ||
      process.env.MAIL_FROM ||
      'Angolela Tera Woreda <onboarding@resend.dev>'

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [payload.to.trim()],
        reply_to: payload.replyTo ? payload.replyTo.trim() : undefined,
        subject: sanitizeHeader(payload.subject),
        text: payload.text,
        html: payload.html || payload.text,
      }),
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      const errMsg = data.message || `Resend API returned status ${res.status}`
      console.error('[Resend Delivery Error]:', errMsg)
      return { success: false, error: errMsg, provider: 'resend' }
    }

    return {
      success: true,
      messageId: data.id || `resend-${Date.now()}`,
      provider: 'resend',
    }
  } catch (err: any) {
    console.error('[Resend Network Exception]:', err.message)
    return { success: false, error: `Resend exception: ${err.message}`, provider: 'resend' }
  }
}

/**
 * 2. Sends email via direct SMTP socket over TLS (e.g. Gmail smtp.gmail.com:465)
 * RFC 5321 / RFC 4954 standard client using Node standard library
 */
async function sendViaSMTP(
  config: { host: string; port: number; user: string; pass: string },
  mail: { from: string; to: string; replyTo?: string; subject: string; body: string }
): Promise<EmailResult> {
  return new Promise((resolve) => {
    const isSsl = config.port === 465
    let socket: tls.TLSSocket | net.Socket

    const timeoutMs = 15000
    const timeout = setTimeout(() => {
      try {
        socket.destroy()
      } catch {}
      resolve({ success: false, error: 'SMTP connection timed out after 15 seconds', provider: 'smtp' })
    }, timeoutMs)

    const finish = (result: EmailResult) => {
      clearTimeout(timeout)
      try {
        socket.end()
      } catch {}
      resolve(result)
    }

    try {
      if (isSsl) {
        socket = tls.connect({
          host: config.host,
          port: config.port,
          rejectUnauthorized: true,
          servername: config.host,
        })
      } else {
        socket = net.connect({
          host: config.host,
          port: config.port,
        })
      }
    } catch (err: any) {
      return finish({ success: false, error: `Socket connection failed: ${err.message}`, provider: 'smtp' })
    }

    let step = 0
    let buffer = ''

    socket.on('data', (chunk) => {
      buffer += chunk.toString()
      if (!buffer.endsWith('\r\n')) return

      const lines = buffer.split('\r\n')
      buffer = ''

      const lastLine = lines[lines.length - 2] || lines[0] || ''
      const code = parseInt(lastLine.substring(0, 3), 10)

      if (code >= 400 && code <= 599) {
        return finish({ success: false, error: `SMTP server error (${code}): ${lastLine}`, provider: 'smtp' })
      }

      if (step === 0 && code === 220) {
        step++
        socket.write(`EHLO ${config.host}\r\n`)
      } else if (step === 1 && code === 250) {
        step++
        socket.write('AUTH LOGIN\r\n')
      } else if (step === 2 && code === 334) {
        step++
        socket.write(Buffer.from(config.user).toString('base64') + '\r\n')
      } else if (step === 3 && code === 334) {
        step++
        socket.write(Buffer.from(config.pass).toString('base64') + '\r\n')
      } else if (step === 4 && code === 235) {
        step++
        socket.write(`MAIL FROM:<${mail.from}>\r\n`)
      } else if (step === 5 && code === 250) {
        step++
        socket.write(`RCPT TO:<${mail.to}>\r\n`)
      } else if (step === 6 && code === 250) {
        step++
        socket.write('DATA\r\n')
      } else if (step === 7 && code === 354) {
        step++
        const msgId = `<${Date.now()}.${Math.random().toString(36).substring(2)}@${config.host}>`
        let emailData = ''
        emailData += `Message-ID: ${msgId}\r\n`
        emailData += `Date: ${new Date().toUTCString()}\r\n`
        emailData += `From: Angolela Tera Woreda Administration <${mail.from}>\r\n`
        emailData += `To: <${mail.to}>\r\n`
        if (mail.replyTo) {
          emailData += `Reply-To: <${mail.replyTo}>\r\n`
        }
        emailData += `Subject: =?UTF-8?B?${Buffer.from(sanitizeHeader(mail.subject)).toString('base64')}?=\r\n`
        emailData += `MIME-Version: 1.0\r\n`
        emailData += `Content-Type: text/html; charset=UTF-8\r\n`
        emailData += `Content-Transfer-Encoding: 8bit\r\n`
        emailData += `\r\n`
        emailData += mail.body
        emailData += `\r\n.\r\n`

        socket.write(emailData)
      } else if (step === 8 && code === 250) {
        step++
        socket.write('QUIT\r\n')
        finish({ success: true, messageId: `SMTP-${Date.now()}`, provider: 'smtp' })
      }
    })

    socket.on('error', (err) => {
      finish({ success: false, error: `Socket error: ${err.message}`, provider: 'smtp' })
    })
  })
}

/**
 * Primary transactional email delivery dispatcher.
 * Selects available provider: Resend > SMTP > SendGrid.
 */
export async function sendGovernmentEmail(payload: EmailPayload): Promise<EmailResult> {
  const toEmail = sanitizeHeader(payload.to)
  if (!isValidEmail(toEmail)) {
    return { success: false, error: `Invalid recipient email address: '${toEmail}'` }
  }

  // 1. Check for Resend API Key (Recommended for cloud/Vercel)
  const resendKey = process.env.RESEND_API_KEY
  if (resendKey && resendKey.trim().length > 0) {
    return await sendViaResend(resendKey, payload)
  }

  // 2. Check for SMTP credentials (Gmail, Outlook, custom woreda mail server)
  const host = process.env.SMTP_HOST || 'smtp.gmail.com'
  const port = parseInt(process.env.SMTP_PORT || '465', 10)
  const user = process.env.SMTP_USER || ''
  const pass = process.env.SMTP_PASS || ''
  const fromEmail = payload.from || process.env.MAIL_FROM || (user ? user : 'angolelatera1@gmail.com')

  if (user && pass) {
    const htmlBody = payload.html || payload.text
    return await sendViaSMTP(
      { host, port, user, pass },
      {
        from: fromEmail,
        to: toEmail,
        replyTo: payload.replyTo,
        subject: payload.subject,
        body: htmlBody,
      }
    )
  }

  // 3. No production provider configured
  const warningMsg =
    'No transactional email service configured. Please configure RESEND_API_KEY or SMTP_USER & SMTP_PASS in Vercel / server environment variables.'
  console.warn(`⚠️ [EMAIL DISPATCH WARNING]: ${warningMsg}`)
  console.log(`   Pending Notification Details: To: ${toEmail} | Subject: ${payload.subject}`)

  return {
    success: false,
    error: warningMsg,
    provider: 'simulated',
  }
}

/**
 * Dispatches formal notification to the official Woreda Administration mailbox
 * Recipient: angolelatera1@gmail.com (or CONTACT_TO_EMAIL)
 */
export async function sendAdminInquiryNotification(
  inquiry: CitizenInquiry,
  baseUrl?: string
): Promise<EmailResult> {
  const adminRecipient = process.env.CONTACT_TO_EMAIL || 'angolelatera1@gmail.com'
  const siteUrl = baseUrl || getSiteUrl()
  const adminDashboardUrl = `${siteUrl}/admin/inquiries`

  const subject = `[New Citizen Inquiry #${inquiry.trackingCode}] ${inquiry.subject}`

  const textBody = `
Angolela Tera Woreda Administration — New Citizen Submission

Tracking Reference: ${inquiry.trackingCode}
Citizen Full Name:  ${inquiry.name}
Citizen Email:      ${inquiry.email}
Telephone:          ${inquiry.phone || 'Not provided'}
Category:           ${inquiry.category}
Date & Time:        ${new Date(inquiry.createdAt).toLocaleString()}

Subject:
${inquiry.subject}

Citizen Message:
${inquiry.message}

Review and assign this submission in the Admin Command Console:
${adminDashboardUrl}
  `.trim()

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${sanitizeHeader(subject)}</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f1f5f9; padding: 20px; margin: 0; color: #1e293b;">
  <div style="max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
    
    <!-- Official Header -->
    <div style="background-color: #0d2340; color: #ffffff; padding: 24px; border-bottom: 4px solid #c8931a;">
      <h1 style="margin: 0; font-size: 20px; letter-spacing: -0.5px;">Angolela Tera Woreda Administration</h1>
      <p style="margin: 4px 0 0; font-size: 13px; color: #fed100; font-weight: bold;">Official Citizen Engagement Portal • New Inquiry Notification</p>
    </div>

    <!-- Case Highlight Box -->
    <div style="padding: 24px;">
      <div style="background: #eff6ff; border-left: 4px solid #1a4f8b; padding: 16px; border-radius: 6px; margin-bottom: 20px;">
        <span style="font-size: 11px; text-transform: uppercase; font-weight: bold; color: #1a4f8b; letter-spacing: 0.5px;">Tracking Reference Code</span>
        <div style="font-size: 22px; font-weight: bold; font-family: monospace; color: #0d2340; margin-top: 4px;">
          ${inquiry.trackingCode}
        </div>
      </div>

      <!-- Citizen Metadata Grid -->
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px;">
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 8px 0; color: #64748b; width: 140px;">Citizen Full Name:</td>
          <td style="padding: 8px 0; font-weight: bold; color: #0d2340;">${inquiry.name}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 8px 0; color: #64748b;">Email Address:</td>
          <td style="padding: 8px 0;"><a href="mailto:${inquiry.email}" style="color: #1a4f8b; text-decoration: none;">${inquiry.email}</a></td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 8px 0; color: #64748b;">Phone Number:</td>
          <td style="padding: 8px 0; font-weight: 500;">${inquiry.phone || 'Not provided'}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 8px 0; color: #64748b;">Category:</td>
          <td style="padding: 8px 0; font-weight: bold; text-transform: uppercase; color: #1a4f8b;">${inquiry.category}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 8px 0; color: #64748b;">Submission Time:</td>
          <td style="padding: 8px 0; color: #334155;">${new Date(inquiry.createdAt).toLocaleString()}</td>
        </tr>
      </table>

      <!-- Subject & Full Message -->
      <div style="margin-bottom: 24px;">
        <h3 style="font-size: 15px; color: #0d2340; margin: 0 0 8px;">Subject: ${inquiry.subject}</h3>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; font-size: 14px; line-height: 1.6; white-space: pre-wrap; color: #334155;">
${inquiry.message}
        </div>
      </div>

      <!-- Action Button -->
      <div style="text-align: center; margin: 30px 0 10px;">
        <a href="${adminDashboardUrl}" style="background-color: #1a4f8b; color: #ffffff; text-decoration: none; padding: 12px 28px; font-size: 14px; font-weight: bold; border-radius: 8px; display: inline-block;">
          Open in Admin Command Console &rarr;
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #f8fafc; padding: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b; text-align: center;">
      Official Government Portal • Angolela Tera Woreda Administration • Chacha, North Shewa, Amhara Region
    </div>
  </div>
</body>
</html>
  `.trim()

  return await sendGovernmentEmail({
    to: adminRecipient,
    replyTo: inquiry.email,
    subject,
    text: textBody,
    html: htmlBody,
  })
}

/**
 * Dispatches official bilingual confirmation email to the citizen
 * Recipient: Citizen's validated email address
 */
export async function sendCitizenConfirmationNotification(
  inquiry: CitizenInquiry,
  baseUrl?: string
): Promise<EmailResult> {
  const siteUrl = baseUrl || getSiteUrl()
  const trackingUrl = `${siteUrl}/en/track?code=${inquiry.trackingCode}`

  const subject = `[Angolela Tera Woreda] Official Confirmation - Tracking Code #${inquiry.trackingCode}`

  const textBody = `
Dear ${inquiry.name},

Thank you for contacting the Angolela Tera Woreda Administration.
የአንጎለላ ጠራ ወረዳ አስተዳደርን ስላነጋገሩ እናመሰግናለን።

Your message has been officially recorded in our citizen service registry.

Your Tracking Reference Code: ${inquiry.trackingCode}
Submission Date: ${new Date(inquiry.createdAt).toLocaleString()}
Subject: ${inquiry.subject}

You can track the administrative review progress, assigned sector desk, and resolution notes anytime at:
${trackingUrl}

Standard Turnaround Time:
Under the Woreda Citizen Service Charter, sector desks review citizen inquiries within 48 to 72 working hours.

Angolela Tera Woreda Administration
Main Administrative Complex, Chacha Town, North Shewa Zone, Amhara Region, Ethiopia
Official Inquiries: angolelatera1@gmail.com
  `.trim()

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${sanitizeHeader(subject)}</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f1f5f9; padding: 20px; margin: 0; color: #1e293b;">
  <div style="max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
    
    <!-- Banner -->
    <div style="background-color: #0d2340; color: #ffffff; padding: 24px; border-bottom: 4px solid #c8931a;">
      <h1 style="margin: 0; font-size: 19px; letter-spacing: -0.5px;">Angolela Tera Woreda Administration</h1>
      <p style="margin: 4px 0 0; font-size: 13px; color: #fed100; font-weight: bold;">የአንጎለላ ጠራ ወረዳ አስተዳደር • Citizen Service Registry</p>
    </div>

    <!-- Body Content -->
    <div style="padding: 24px;">
      <p style="font-size: 15px; font-weight: bold; color: #0d2340; margin-top: 0;">
        Dear ${inquiry.name},
      </p>
      <p style="font-size: 13px; line-height: 1.6; color: #334155;">
        Thank you for contacting the Angolela Tera Woreda Administration. This message confirms that your inquiry has been officially recorded in our registry.
      </p>
      <p style="font-size: 13px; line-height: 1.6; color: #475569; background: #f8fafc; padding: 12px; border-radius: 6px; border-left: 3px solid #c8931a;">
        የቀረበው አቤቱታ ወይም ጥያቄ በወረዳው የዜጎች ቻርተር መዝገብ ላይ በይፋ ሰፍሯል። የደረሰበትን የአስተዳደር ደረጃ በሚከተለው የመከታተያ ኮድ መከታተል ይችላሉ።
      </p>

      <!-- Prominent Tracking Badge -->
      <div style="background: #eff6ff; border: 2px dashed #1a4f8b; padding: 18px; border-radius: 8px; text-align: center; margin: 24px 0;">
        <span style="font-size: 11px; text-transform: uppercase; font-weight: bold; color: #1a4f8b; letter-spacing: 0.5px; display: block;">Your Official Tracking Code</span>
        <div style="font-size: 26px; font-weight: bold; font-family: monospace; color: #1a4f8b; letter-spacing: 1px; margin: 6px 0;">
          ${inquiry.trackingCode}
        </div>
        <span style="font-size: 11px; color: #64748b;">Please preserve this code to check resolution progress.</span>
      </div>

      <!-- Submission Summary Table -->
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px;">
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 8px 0; color: #64748b; width: 140px;">Subject:</td>
          <td style="padding: 8px 0; font-weight: bold; color: #0d2340;">${inquiry.subject}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 8px 0; color: #64748b;">Category:</td>
          <td style="padding: 8px 0; text-transform: uppercase; font-weight: 500; color: #1a4f8b;">${inquiry.category}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 8px 0; color: #64748b;">Recorded Date:</td>
          <td style="padding: 8px 0; color: #334155;">${new Date(inquiry.createdAt).toLocaleString()}</td>
        </tr>
      </table>

      <!-- Track Button -->
      <div style="text-align: center; margin: 28px 0 16px;">
        <a href="${trackingUrl}" style="background-color: #1a4f8b; color: #ffffff; text-decoration: none; padding: 12px 28px; font-size: 14px; font-weight: bold; border-radius: 8px; display: inline-block;">
          Track Your Submission Online &rarr;
        </a>
      </div>

      <!-- Charter Turnaround Info -->
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px 16px; font-size: 12px; color: #64748b; line-height: 1.5; margin-top: 20px;">
        ⏱️ <strong>Citizen Charter Standard:</strong> The designated sector desk reviews submissions within 48 working hours. Official findings and decisions will appear directly on your tracking page.
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #f8fafc; padding: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b; text-align: center;">
      Angolela Tera Woreda Administration • Chacha Administrative Complex, North Shewa Zone<br>
      For urgent inquiries, contact: angolelatera1@gmail.com | Phone: +251 (0) 58 661 0100
    </div>
  </div>
</body>
</html>
  `.trim()

  return await sendGovernmentEmail({
    to: inquiry.email,
    subject,
    text: textBody,
    html: htmlBody,
  })
}
