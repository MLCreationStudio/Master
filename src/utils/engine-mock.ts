/**
 * LASTRO ENGINE — ACSD MOCK_DATA_GENERATOR
 * Este script simula o comportamento da Edge Function que processará o cálculo real.
 */

export const generateDiagnosticMock = (url: string) => {
  const score = Math.floor(Math.random() * 40) + 40; // 40-80
  
  return {
    diagnosticoId: crypto.randomUUID(),
    url,
    scoreData: {
      score,
      level: score > 70 ? 'SCALABLE' : score > 55 ? 'HIGH_STABILITY' : 'CRITICAL_RISK',
      status: score > 50 ? 'VIABLE' : 'UNVIABLE',
    },
    metrics: [
      { key: 'cac_predicted', value: 45.12 },
      { key: 'roas_target', value: 4.2 },
      { key: 'tax_impact_2026', value: 0.12 }
    ],
    logs: [
      { step: 'VARREDURA', message: 'Iniciando varredura na URL: ' + url },
      { step: 'ACSD_PROJECTION', message: 'Aplicando projeção tributária 2026...' },
      { step: 'FINAL_SCORE', message: 'Score de Lastro calculado: ' + score }
    ]
  };
};
