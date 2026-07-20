import { useState } from 'react';
import Login from './Login';
import Vendas from './Vendas';
import Clientes from './Clientes';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [paginaAtual, setPaginaAtual] = useState('dashboard'); // Página inicial

  const handleLoginSuccess = (newToken) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
  };

  const renderPagina = () => {
    switch (paginaAtual) {
      case 'dashboard':
        return <Dashboard token={token} />;
      case 'vendas':
        return <Vendas token={token} />;
      case 'clientes':
        return <Clientes token={token} />;
      default:
        return <Dashboard token={token} />;
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
      />
      <main className="main-content">
        {renderPagina()}
      </main>
    </div>
  );
}

export default App;
