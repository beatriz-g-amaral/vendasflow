import { useState } from 'react';

function Login({ onLoginSuccess }) {
  const [formData, setFormData] = useState({ usuario: '', senha: '' });
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem('');

    try {
      const response = await fetch('http://localhost:8000/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.sucesso) {
        onLoginSuccess(data.token);
      } else {
        setMensagem(data.mensagem || 'Falha no login.');
      }
    } catch (error) {
      setMensagem('Erro ao conectar com a API de login.');
    }
  };

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