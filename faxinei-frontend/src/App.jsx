import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Cadastro from './pages/Cadastro';
import Login from './pages/Login';
import Painel from './pages/Painel';
import Perfil from './pages/Perfil';
import Sobre from './pages/Sobre';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 font-sans">
        <Navbar />
        
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/painel" element={<Painel />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/sobre" element={<Sobre />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;