import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(token: string, email: string) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const resetUrl = `${baseUrl}/admin/reset-password?token=${token}`;

  await resend.emails.send({
    from: "KTS Admin <noreply@kts.org.pl>",
    to: email,
    subject: "Reset hasła — Panel Admina KTS",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #0d1f40;">Reset hasła KTS</h2>
        <p>Otrzymaliśmy prośbę o reset hasła do panelu administracyjnego.</p>
        <p>Kliknij poniższy przycisk, aby ustawić nowe hasło:</p>
        <a href="${resetUrl}"
           style="display:inline-block;background:#c8a951;color:#0d1f40;padding:12px 24px;border-radius:6px;font-weight:bold;text-decoration:none;margin:16px 0;">
          Resetuj hasło
        </a>
        <p style="color:#666;font-size:14px;">Link jest ważny przez 1 godzinę.<br>
        Jeśli nie prosiłeś o reset hasła, zignoruj tę wiadomość.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
        <p style="color:#999;font-size:12px;">Krakowskie Towarzystwo Strzeleckie</p>
      </div>
    `,
  });
}
