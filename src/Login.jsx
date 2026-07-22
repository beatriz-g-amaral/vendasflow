import { useState } from 'react';
import apiService from './apiService';

function Login({ onLoginSuccess }) {
  const [formData, setFormData] = useState({ usuario: '', senha: '' });
  const [mensagem, setMensagem] = useState('');
  const [empresas, setEmpresas] = useState([]);
  const [empresaSelecionada, setEmpresaSelecionada] = useState('');
  const [etapa, setEtapa] = useState('login');
  const [tokenTemp, setTokenTemp] = useState(null);
  const [usuarioInfo, setUsuarioInfo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem('');

    try {
      const data = await apiService('/login.php', 'POST', formData);

      if (data.empresas && data.empresas.length > 1) {
        setEmpresas(data.empresas);
        setTokenTemp(data.token);
        setUsuarioInfo(data.usuario);
        setEtapa('selecionar-empresa');
      } else if (data.empresas && data.empresas.length === 1) {
        onLoginSuccess(data.token, data.empresas[0].id, data.empresas[0].nome, data.usuario);
      } else {
        onLoginSuccess(data.token, null, null, data.usuario);
      }
    } catch (error) {
      setMensagem(error.message || 'Erro ao conectar com a API de login.');
    }
  };

  const handleSelecionarEmpresa = () => {
    if (!empresaSelecionada) {
      setMensagem('Selecione uma empresa para continuar.');
      return;
    }
    const empresa = empresas.find(e => e.id === parseInt(empresaSelecionada));
    onLoginSuccess(tokenTemp, empresa.id, empresa.nome, usuarioInfo);
  };

  if (etapa === 'selecionar-empresa') {
    return (
      <div className="login-container">
        <div className="login-card card">
          <div className="card-body">
            <h3 className="card-title text-center">VendasFlow</h3>
            <p className="text-center text-muted mb-4">
              Olá, <strong>{usuarioInfo?.nome || usuarioInfo?.usuario}</strong>!
              Selecione a empresa:
            </p>
            
            <div className="mb-3">
              {empresas.map(emp => (
                <div 
                  key={emp.id} 
                  className={`empresa-option ${empresaSelecionada == emp.id ? 'selected' : ''}`}
                  onClick={() => setEmpresaSelecionada(emp.id)}
                >
                  <div className="empresa-nome">{emp.nome}</div>
                  {emp.cnpj && <div className="empresa-cnpj">CNPJ: {emp.cnpj}</div>}
                </div>
              ))}
            </div>

            <div className="d-grid mt-4">
              <button 
                className="btn btn-primary" 
                onClick={handleSelecionarEmpresa}
                disabled={!empresaSelecionada}
              >
                Acessar Empresa
              </button>
            </div>

            {mensagem && <div className="alert alert-danger mt-3 text-center">{mensagem}</div>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card card">
        <div className="card-body">
          <h3 className="card-title text-center">VendasFlow</h3>
          <p className="text-center text-muted mb-4">Acesse sua conta para continuar</p>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="usuarioInput" className="form-label">Usuário:</label>
              <input 
                type="text" 
                id="usuarioInput"
                className="form-control"
                placeholder="Digite seu usuário"
                required
                value={formData.usuario}
                onChange={e => setFormData({ ...formData, usuario: e.target.value })}
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="senhaInput" className="form-label">Senha:</label>
              <input 
                type="password" 
                id="senhaInput"
                className="form-control"
                placeholder="********"
                required
                value={formData.senha}
                onChange={e => setFormData({ ...formData, senha: e.target.value })}
              />
            </div>

            <div className="d-grid mt-4">
              <button type="submit" className="btn btn-primary">
                Entrar
              </button>
            </div>
          </form>

          {mensagem && <div className="alert alert-danger mt-3 text-center">{mensagem}</div>}
        </div>
      </div>
    </div>
  );
}

export default Login;