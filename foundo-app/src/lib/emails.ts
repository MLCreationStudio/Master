import { resend } from "./resend";

const FROM_EMAIL = "Clip <onboarding@resend.dev>"; // Change to a verified domain when ready

export async function sendAdmissionConfirmation(email: string, name: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Recebemos sua admissão | Clip",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h1 style="color: #6366F1;">Olá, ${name}!</h1>
          <p>Sua admissão para o <strong>Clip</strong> foi recebida com sucesso.</p>
          <p>Nosso time de curadoria revisa cada perfil pessoalmente para garantir o melhor matchmaking possível. Esse processo costuma levar até <strong>48 horas</strong>.</p>
          <p>Fique de olho no seu e-mail, te avisaremos assim que tivermos uma resposta.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #999;">Clip — Conectando o ecossistema builder do Brasil.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Error sending admission confirmation email:", error);
      return { error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Failed to send email:", err);
    return { error: err };
  }
}

export async function sendStatusUpdateEmail(email: string, name: string, status: "active" | "rejected") {
  const isApproved = status === "active";
  const subject = isApproved 
    ? "Bem-vindo ao Clip! Sua admissão foi aprovada" 
    : "Atualização sobre sua admissão no Clip";

  const message = isApproved
    ? `
      <h1 style="color: #6366F1;">Parabéns, ${name}!</h1>
      <p>Sua admissão foi aprovada. Você já pode acessar a plataforma e começar a descobrir matches!</p>
      <div style="margin: 30px 0;">
        <a href="https://master-sigma-azure.vercel.app/deck" style="background-color: #6366F1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Explorar Matches agora</a>
      </div>
    `
    : `
      <h1>Olá, ${name}.</h1>
      <p>Agradecemos seu interesse no Clip e por compartilhar sua trajetória conosco.</p>
      <p>No momento, decidimos não seguir com sua admissão para o grupo exclusivo. Isso não é um reflexo do seu potencial, mas sim um alinhamento com os critérios específicos de matchmaking do momento.</p>
      <p>Desejamos muito sucesso em sua jornada builder!</p>
    `;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: subject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          ${message}
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #999;">Clip — Conectando o ecossistema builder do Brasil.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Error sending status update email:", error);
      return { error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Failed to send email:", err);
    return { error: err };
  }
}
