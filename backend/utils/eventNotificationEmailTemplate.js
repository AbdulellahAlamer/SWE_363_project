const eventNotificationEmailTemplate = ({
  name,
  eventName,
  eventDate,
  location,
  description,
  actionUrl,
}) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${eventName || "Upcoming event"}</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background: #f5f8ff;
        font-family: "Segoe UI", Roboto, Arial, sans-serif;
        color: #0f172a;
      }
      .wrapper {
        max-width: 640px;
        margin: 32px auto;
        background: #ffffff;
        border-radius: 16px;
        box-shadow: 0 16px 48px rgba(15, 23, 42, 0.08);
        overflow: hidden;
        border: 1px solid #e0e7ff;
      }
      .header {
        background: linear-gradient(135deg, #1d4ed8, #2563eb, #1e3a8a);
        color: #e0f2fe;
        padding: 28px 32px;
      }
      .header h1 {
        margin: 0;
        font-size: 22px;
        letter-spacing: 0.5px;
      }
      .content {
        padding: 28px 32px 32px;
        line-height: 1.6;
      }
      .content h2 {
        margin: 0 0 12px;
        font-size: 20px;
        color: #0f172a;
      }
      .pill {
        display: inline-block;
        padding: 10px 14px;
        background: #e0ecff;
        color: #1d4ed8;
        border-radius: 999px;
        font-weight: 600;
        font-size: 13px;
        letter-spacing: 0.2px;
        margin: 12px 0 18px;
      }
      .cta {
        display: inline-block;
        padding: 12px 18px;
        background: #1d4ed8;
        color: #ffffff;
        border-radius: 10px;
        text-decoration: none;
        font-weight: 600;
        margin: 10px 0 16px;
        box-shadow: 0 10px 30px rgba(37, 99, 235, 0.25);
      }
      .cta:hover {
        background: #1b4ad8;
      }
      .footer {
        padding: 18px 32px 28px;
        font-size: 12px;
        color: #475569;
        border-top: 1px solid #e2e8f0;
        background: #f8fafc;
      }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <div class="header">
        <h1>KFUPM Clubs Hub</h1>
      </div>
      <div class="content">
        <span class="pill">Event update</span>
        <h2>${eventName || "Upcoming event"}</h2>
        <p>Hi ${name || "there"},</p>
        <p>${description || "We have a new event you might be interested in."}</p>
        <p><strong>Date:</strong> ${eventDate || "TBA"}</p>
        <p><strong>Location:</strong> ${location || "TBA"}</p>
        ${
          actionUrl
            ? `<a class="cta" href="${actionUrl}" target="_blank" rel="noopener noreferrer">View event</a>`
            : ""
        }
      </div>
      <div class="footer">
        You are receiving this notification because you follow club updates on KFUPM Clubs Hub.
      </div>
    </div>
  </body>
</html>
`;

export default eventNotificationEmailTemplate;
