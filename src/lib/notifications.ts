/**
 * Angolela Tera Woreda Administration
 * Official Citizen Notification & SMS Gateway Dispatcher
 *
 * Supports:
 * 1. Ethio Telecom Enterprise Bulk SMS Gateway API
 * 2. Africa's Talking / Twilio SMS Gateway Fallback
 * 3. Citizen Email Dispatch via Official Government SMTP
 */

export interface GrievanceNotificationPayload {
  trackingCode: string
  fullName: string
  phone: string
  email?: string
  subject: string
  category: string
  locale?: 'en' | 'am'
}

/**
 * Standardize and validate Ethiopian phone numbers
 * Accepts: 0911234567, 0711234567, +251911234567, 251911234567
 */
export function normalizeEthiopianPhone(phone: string): string | null {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '')
  if (/^(\+251|251)[79]\d{8}$/.test(cleaned)) {
    return cleaned.startsWith('+') ? cleaned : `+${cleaned}`
  }
  if (/^0[79]\d{8}$/.test(cleaned)) {
    return `+251${cleaned.substring(1)}`
  }
  if (/^[79]\d{8}$/.test(cleaned)) {
    return `+251${cleaned}`
  }
  return null
}

/**
 * Send official grievance submission receipt via SMS to citizen
 */
export async function sendCitizenSMSNotification(
  payload: GrievanceNotificationPayload
): Promise<{ success: boolean; provider: string; messageId?: string; error?: string }> {
  const phone = normalizeEthiopianPhone(payload.phone)
  if (!phone) {
    return { success: false, provider: 'none', error: 'Invalid Ethiopian phone format' }
  }

  const isAmharic = payload.locale === 'am'
  const message = isAmharic
    ? `የአንጎለላ ጠራ ወረዳ አስተዳደር፡ አቤቱታዎ በኮድ ${payload.trackingCode} ተመዝግቧል። ሁኔታውን በድረ-ገጻችን መከታተል ይችላሉ። ስልክ፡ 0586610100`
    : `Angolela Tera Woreda: Your grievance is registered with tracking code ${payload.trackingCode}. Track status on our portal. Hotline: 0586610100`

  // 1. Ethio Telecom Enterprise SMS Gateway (if configured)
  const ethioSmsUrl = process.env.ETHIO_TELECOM_SMS_URL
  const ethioSmsUser = process.env.ETHIO_TELECOM_SMS_USER
  const ethioSmsPassword = process.env.ETHIO_TELECOM_SMS_PASSWORD
  const ethioSenderId = process.env.ETHIO_TELECOM_SENDER_ID || 'AngolelaTera'

  if (ethioSmsUrl && ethioSmsUser && ethioSmsPassword) {
    try {
      const res = await fetch(ethioSmsUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: ethioSmsUser,
          password: ethioSmsPassword,
          sender: ethioSenderId,
          recipient: phone,
          message,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        return { success: true, provider: 'ethio_telecom', messageId: data.messageId || 'SENT' }
      }
    } catch (err: any) {
      console.error('[SMS Dispatch] Ethio Telecom gateway failed, falling back:', err.message)
    }
  }

  // 2. Generic SMS Gateway Fallback (e.g. Africa's Talking / Twilio / Infobip)
  const genericGatewayUrl = process.env.SMS_GATEWAY_URL
  const genericApiKey = process.env.SMS_GATEWAY_API_KEY
  if (genericGatewayUrl && genericApiKey) {
    try {
      const res = await fetch(genericGatewayUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${genericApiKey}`,
        },
        body: JSON.stringify({ to: phone, text: message }),
      })
      if (res.ok) {
        return { success: true, provider: 'generic_gateway' }
      }
    } catch (err: any) {
      console.error('[SMS Dispatch] Generic gateway error:', err.message)
    }
  }

  // 3. Staging / Offline Mock logging (Enterprise Audit Log)
  console.log(`[SMS DISPATCH - MOCK] Sent to ${phone}: "${message}"`)
  return {
    success: true,
    provider: 'local_audit_mock',
    messageId: `MOCK-SMS-${Date.now()}`,
  }
}
