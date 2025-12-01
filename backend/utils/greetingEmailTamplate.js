const greetingEmailTemplate = ({ name }) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to KFUPM Clubs Hub</title>
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
        <span class="pill">Welcome aboard</span>
        <h2>Hello ${name || "there"},</h2>
        <p>
          Thanks for joining the KFUPM Clubs Hub! You can now explore clubs,
          stay up to date on events, and connect with fellow students.
        </p>
        <p>
          To get started, sign in with your email and the password you just
          created. We recommend updating your profile and following the clubs
          that match your interests.
        </p>
        <a class="cta" href="https://localhost:5173/login" target="_blank" rel="noopener noreferrer">
          Go to login
        </a>
      </div>
      <div class="footer">
        You received this email because you created an account on KFUPM Clubs
        Hub. If you didn’t sign up, you can ignore this message.
      </div>
    </div>
  </body>
</html>
`;

export default greetingEmailTemplate;
