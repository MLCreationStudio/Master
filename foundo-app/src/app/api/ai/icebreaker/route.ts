import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI();

export async function POST(req: Request) {
  try {
    const { currentUser, matchUser } = await req.json();

    if (!currentUser || !matchUser) {
      return NextResponse.json({ error: "Dados dos usuários não fornecidos." }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "A chave da API (OPENAI_API_KEY) não está configurada." },
        { status: 500 }
      );
    }

    const systemPrompt = `
    Você é o 'Clip Matchmaker', a inteligência cognitiva de elite dentro do Clip (rede de startups B2B).
    Dois usuários acabaram de dar "Match" e demonstraram interesse mútuo. Sua tarefa é sugerir 3 'Icebreakers' (mensagens iniciais) para o Usuário Atual enviar ao Usuário Alvo.

    Contexto do Usuário que VAI ENVIAR a mensagem (Usuário Atual):
    Nome: ${currentUser.name}
    Role: ${currentUser.role}
    Skill principal: ${currentUser.skills || "Estratégia"}

    Contexto do Usuário ALVO (Quem vai RECEBER a mensagem):
    Nome: ${matchUser.name}
    Role: ${matchUser.role}
    Bio/Projeto: ${matchUser.project || matchUser.bio || "Inovação"}
    Necessidade atual: ${matchUser.seeking || "Sinergia"}

    Diretrizes dos 3 icebreakers:
    Icebreaker 1: Abordagem Técnica Direta (Focada em construir e sinergia de ferramentas).
    Icebreaker 2: Focada em Visão de Negócios / Mercado / Problema.
    Icebreaker 3: Mais casual, quebrando o gelo sobre a cidade/background e querendo agendar um café rápido ou call.

    NÃO crie respostas genéricas (ex: "Oi, tudo bem?"). Seja agressivamente direto, empático e de alto nível. Use uma linguagem corporativa descontraída e moderna (startup).
    
    FORMATAÇÃO: 
    Retorne ESTRITAMENTE em formato JSON (parseável), seguindo esta estrutura:
    {
      "icebreakers": [
        "Mensagem 1",
        "Mensagem 2",
        "Mensagem 3"
      ]
    }
    NÃO retorne formatação markdown como \`\`\`json, retorne apenas o JSON bruto stringificado.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: systemPrompt }],
      temperature: 0.8,
      response_format: { type: "json_object" }
    });

    const contentStr = response.choices[0]?.message?.content;
    if (!contentStr) {
      throw new Error("Resposta Nula da OpenAI");
    }

    // Validação Segura do JSON retornado pela OpenAI
    let parsedObj;
    try {
      parsedObj = JSON.parse(contentStr);
    } catch (err) {
      throw new Error("Erro de Parse do JSON da OpenAI.");
    }

    return NextResponse.json({ icebreakers: parsedObj.icebreakers || [] });
  } catch (error: any) {
    console.error("OpenAI Icebreaker Error:", error);
    return NextResponse.json(
      { error: "Falha ao gerar conexões neurais para o Match." },
      { status: 500 }
    );
  }
}
