import { NextResponse } from "next/server";
import OpenAI from "openai";

// Inicializa o cliente OpenAI. OpeAI buscará automaticamente o `process.env.OPENAI_API_KEY`
const openai = new OpenAI();

export async function POST(req: Request) {
  try {
    const { rawPitch, role, projectStage } = await req.json();

    if (!rawPitch) {
      return NextResponse.json({ error: "O pitch original é obrigatório." }, { status: 400 });
    }

    // Validação de chave para evitar crash silencioso
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "A chave da API (OPENAI_API_KEY) não está configurada no servidor." },
        { status: 500 }
      );
    }

    const systemPrompt = `
    Você é o 'Clip AI', o assistente cognitivo premium focado num ecossistema de startups de elite.
    Sua missão é atuar como um otimizador de Copywriting para Foundadores e Builders.
    O usuário vai te fornecer um 'Pitch de Elevador' ou 'Bio' mal escrito ou cru.
    Você vai reescrevê-lo adotando um tom de ALTA AUTORIDADE, técnico, direto ao ponto e envolvente.
    Remova jargões excessivos se forem vazios, mas retenha tecnologias chaves (ex: AWS, React, Python).
    
    Perfil do Usuário atual: ${role === 'founder' ? 'Diretor/Fundador' : 'Especialista/Builder'}
    Estágio Relatado: ${projectStage || 'Não divulgado'}
    
    INSTRUÇÕES CRÍTICAS:
    1. Retorne APENAS o pitch reescrito, sem introduções ("Aqui está o seu pitch:") nem aspas.
    2. O máximo deve ser de 3 frases contundentes e curtas.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Aqui está meu rascunho. Deixe isso de cair o queixo:\n\n${rawPitch}` },
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    const refinedPitch = response.choices[0]?.message?.content?.trim();

    return NextResponse.json({ refinedPitch });
  } catch (error: any) {
    console.error("OpenAI Error:", error);
    return NextResponse.json(
      { error: "Falha na inteligência artificial." },
      { status: 500 }
    );
  }
}
