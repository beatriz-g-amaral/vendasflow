import { useState } from 'react';
import Login from './Login';
import Vendas from './Vendas';
import Clientes from './Clientes';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import Usuarios from './Usuarios';
import Configuracoes from './Configuracoes';
import Fornecedores from './Fornecedores';
import Compras from './Compras';

function App() {
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [empresaId, setEmpresaId] = useState(localStorage.getItem('empresaId'));
  const [empresaNome, setEmpresaNome] = useState(localStorage.getItem('empresaNome'));
  const [usuarioInfo, setUsuarioInfo] = useState(null);
  const [paginaAtual, setPaginaAtual] = useState('dashboard');

  const handleLoginSuccess = (newToken, newEmpresaId, newEmpresaNome, userInfo) => {
    localStorage.setItem('authToken', newToken);
    if (newEmpresaId) {
      localStorage.setItem('empresaId', newEmpresaId);
      localStorage.setItem('empresaNome', newEmpresaNome);
    }
    setToken(newToken);
    setEmpresaId(newEmpresaId);
    setEmpresaNome(newEmpresaNome);
    setUsuarioInfo(userInfo);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('empresaId');
    localStorage.removeItem('empresaNome');
    setToken(null);
    setEmpresaId(null);
    setEmpresaNome(null);
  };

  const renderPagina = () => {
    switch (paginaAtual) {
      case 'dashboard':
        return <Dashboard token={token} empresaId={empresaId} />;
      case 'vendas':
        return <Vendas token={token} empresaId={empresaId} />;
      case 'clientes':
        return <Clientes token={token} empresaId={empresaId} />;
      case 'usuarios':
        return <Usuarios token={token} empresaId={empresaId} />;
      case 'configuracoes':
        return <Configuracoes token={token} empresaId={empresaId} />;
      case 'fornecedores':
        return <Fornecedores token={token} empresaId={empresaId} />;
      case 'compras':
        return <Compras token={token} empresaId={empresaId} />;
      default:
        return <Dashboard token={token} empresaId={empresaId} />;
    }
  };

  if (!token) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="wrapper">
      <Sidebar 
        paginaAtual={paginaAtual}
        setPaginaAtual={setPaginaAtual}
        handleLogout={handleLogout}
        empresaNome={empresaNome}
      />
      <main className="main-content">
        {renderPagina()}
      </main>
    </div>
  );
}

export default App;
