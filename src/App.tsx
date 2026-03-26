import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Diagnostico from './pages/Diagnostico';
import Conversa from './pages/Conversa';
import Processando from './pages/Processando';
import Resultado from './pages/Resultado';
import ProcessandoCarga from './pages/ProcessandoCarga';
import TransicaoGTM from './pages/TransicaoGTM';
import PlanoGTM from './pages/PlanoGTM';
import Tracker from './pages/Tracker';
import Manifesto from './pages/Manifesto';
import Briefing from './pages/Briefing';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/diagnostico" element={<Diagnostico />} />
        <Route path="/conversa" element={<Conversa />} />
        <Route path="/processando-carga" element={<ProcessandoCarga />} />
        <Route path="/processando" element={<Processando />} />
        <Route path="/resultado" element={<Resultado />} />
        <Route path="/transicao-gtm" element={<TransicaoGTM />} />
        <Route path="/plano-gtm" element={<PlanoGTM />} />
        <Route path="/tracker" element={<Tracker />} />
        <Route path="/manifesto" element={<Manifesto />} />
        <Route path="/briefing" element={<Briefing />} />
      </Routes>
    </BrowserRouter>
  );
}
