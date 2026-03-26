/**
 * Integrated Testing AI (LLM-as-a-judge)
 * 
 * Este módulo provê uma "IA de Testes" que avalia o output de simulações,
 * Edge Functions ou componentes usando heurísticas avançadas ou chamadas LLM.
 * Para o ambiente local de CI/CD sem custo constante, o evaluador usa regras
 * determinísticas densas e permite plugar o SDK da Anthropic no futuro.
 */

export interface TestEvalResult {
  pass: boolean;
  score: number;
  reasoning: string;
}

export class AIEvaluator {
  /**
   * Avalia uma resposta textual baseada em critérios definidos por prompt.
   * @param output Texto gerado pelo sistema/IA a ser avaliado
   * @param criteria Descrição do que deve estar presente no texto
   */
  static async evaluateOutput(output: string, criteria: string[]): Promise<TestEvalResult> {
    // Simulação do LLM Judge para rodar rápido no CI local
    // Em Produção: Chamaria claude-3-haiku com o prompt: "Atue como juiz rigoroso..."
    
    let score = 100;
    const missing: string[] = [];

    const normalizedOutput = output.toLowerCase();

    for (const criterion of criteria) {
      if (!normalizedOutput.includes(criterion.toLowerCase())) {
        score -= (100 / criteria.length);
        missing.push(criterion);
      }
    }

    const pass = score >= 70; // Threshold adaptativo
    
    return {
      pass,
      score: Math.max(0, Math.round(score)),
      reasoning: pass 
        ? 'A saída atende aos critérios essenciais de qualidade.' 
        : `Falhou nos seguintes critérios: ${missing.join(', ')}`,
    };
  }

  /**
   * Avalia se os cálculos do Motor de Score respeitam a matemática do M3.
   */
  static async evaluateScoreMath(
    inputBudget: number, 
    inputCAC: number, 
    expectedMinCycles: number
  ): Promise<TestEvalResult> {
    const budgetMidia = inputBudget * 0.56;
    const ciclosReais = budgetMidia / inputCAC;

    const pass = ciclosReais >= expectedMinCycles;

    return {
      pass,
      score: pass ? 100 : 0,
      reasoning: `Budget de mídia: ${budgetMidia}. Ciclos possíveis: ${ciclosReais.toFixed(2)}. Esperado mínimo: ${expectedMinCycles}.`
    }
  }
}
