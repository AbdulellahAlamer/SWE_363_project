import process from "process";

const {
  MAILERSEND_API_KEY,
  API_KEY, // optional fallback
  MAILERSEND_FROM = "hello@mailersend.com",
  MAILERSEND_FROM_NAME = "MailerSend",
} = process.env;

const API_TOKEN = MAILERSEND_API_KEY || API_KEY;
const MAILERSEND_ENDPOINT = "https://api.mailersend.com/v1/email";

/**
 * Send an email through the MailerSend Email API via direct POST.
 * @param {Object} options
 * @param {string|string[]} options.to - Recipient email(s)
 * @param {string} options.subject - Email subject
 * @param {string} [options.text] - Plain text body
 * @param {string} [options.html] - HTML body
 * @param {Object[]} [options.personalization] - Personalization objects: { email, data }
 * @param {string} [options.from] - From email (default MAILERSEND_FROM)
 * @param {string} [options.fromName] - From name (default MAILERSEND_FROM_NAME)
 */
export async function sendEmail({
  to,
  subject,
  text,
  html,
  personalization = [],
  from,
  fromName,
}) {
  if (!API_TOKEN) {
    throw new Error("MAILERSEND_API_KEY (or API_KEY) is not set");
  }
  if (!to || !subject || (!text && !html)) {
    throw new Error(
      "Email 'to', 'subject', and at least one of 'text' or 'html' are required"
    );
  }

  const recipientsArray = Array.isArray(to) ? to : [to];

  const payload = {
    from: {
      email: from || MAILERSEND_FROM,
      name: fromName || MAILERSEND_FROM_NAME,
    },
    to: recipientsArray.map((addr) => ({
      email: addr,
      name: addr.split("@")[0],
    })),
    subject,
    text,
    html,
  };

  if (personalization.length) {
    payload.personalization = personalization;
  }

  const response = await fetch(MAILERSEND_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_TOKEN}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorMessage = `MailerSend error: ${response.status}`;
    try {
      const data = await response.json();
      if (data?.message) {
        errorMessage += ` - ${data.message}`;
      }
    } catch {
      // ignore parse errors
    }
    throw new Error(errorMessage);
  }

  return true;
}
