import { describe, it, expect } from 'vitest';
import { AIEvaluator } from './ai-evaluator';

describe('Lastro QA AI - Testes Integrados M1 e Motores', () => {

  describe('Avaliação Dialética e Respostas LLM', () => {
    it('deve extrair o ICP de forma satisfatória segundo a IA de Teste', async () => {
      // Simula a resposta de uma Edge Function
      const mockEdgeFunctionOutput = "O cliente ideal é o dono de clínica classe A/B buscando procedimentos de estética avançada e high ticket.";
      
      const criteria = [
        "classe", // Tem perfil socioeconômico
        "estética", // Tem dor/interesse principal
      ];

      const avaliacao = await AIEvaluator.evaluateOutput(mockEdgeFunctionOutput, criteria);

      expect(avaliacao.pass).toBe(true);
      expect(avaliacao.score).toBeGreaterThanOrEqual(70);
      console.log('🤖 IA Evaluator Reason:', avaliacao.reasoning);
    });

    it('deve reprovar respostas genéricas demais', async () => {
      const mockBadOutput = "Cliente é qualquer um que queira comprar.";
      
      const criteria = [
        "idade",
        "renda"
      ];

      const avaliacao = await AIEvaluator.evaluateOutput(mockBadOutput, criteria);

      expect(avaliacao.pass).toBe(false);
      expect(avaliacao.score).toBeLessThan(70);
    });
  });

  describe('Validação do Motor M3 - Matemática de Ciclos', () => {
    it('deve aprovar scores com budget suficiente para 3 ciclos', async () => {
      // Budget: R$ 5000 (Mídia = 2800)
      // CAC esperado = 250
      // Ciclos = 2800 / 250 = 11.2 (Suficiente > 3)
      const avaliacao = await AIEvaluator.evaluateScoreMath(5000, 250, 3);
      
      expect(avaliacao.pass).toBe(true);
    });

    it('deve alertar zona de risco quando ciclos < 1', async () => {
      // Budget: R$ 1000 (Mídia = 560)
      // CAC esperado = 600
      // Ciclos = 560 / 600 = 0.93 (Crítico < 1)
      const avaliacao = await AIEvaluator.evaluateScoreMath(1000, 600, 1);
      
      expect(avaliacao.pass).toBe(false);
    });
  });
});
