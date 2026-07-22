import { useState, useEffect } from 'react';
import { PersonPlusFill, PersonDashFill, PersonCheckFill } from 'react-bootstrap-icons';
import apiService from './apiService';

function Usuarios({ token, empresaId }) {
  const [usuarios, setUsuarios] = useState([]);
  const [novoUsuario, setNovoUsuario] = useState({ usuario: '', senha: '', nome: '' });
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [criando, setCriando] = useState(false);

  const fetchUsuarios = async () => {
    try {
      const data = await apiService('/usuarios.php');
      setUsuarios(data.usuarios);
    } catch (error) {
      setErro(error.message || 'Erro ao buscar usuários.');
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsuarios();
    }
  }, [token, empresaId]);

  const handleVincular = async (usuarioId) => {
    try {
      await apiService('/empresas.php', 'PUT', {
        acao: 'vincular',
        empresa_id: parseInt(empresaId),
        usuario_id: usuarioId
      });
      setSucesso('Usuário vinculado à empresa!');
      setErro('');
      fetchUsuarios();
    } catch (error) {
      setErro(error.message || 'Erro ao vincular usuário.');
    }
  };

  const handleDesvincular = async (usuarioId) => {
    try {
      await apiService('/empresas.php', 'PUT', {
        acao: 'desvincular',
        empresa_id: parseInt(empresaId),
        usuario_id: usuarioId
      });
      setSucesso('Usuário desvinculado da empresa!');
      setErro('');
      fetchUsuarios();
    } catch (error) {
      setErro(error.message || 'Erro ao desvincular usuário.');
    }
  };

  const handleCriarUsuario = async (e) => {
    e.preventDefault();
    if (!novoUsuario.usuario || !novoUsuario.senha) {
      setErro('Preencha usuário e senha.');
      return;
    }

    setCriando(true);
    setErro('');
    setSucesso('');

    try {
      await apiService('/criarusuario.php', 'POST', {
        usuario: novoUsuario.usuario,
        senha: novoUsuario.senha,
        nome: novoUsuario.nome || novoUsuario.usuario,
        empresa_id: parseInt(empresaId)
      });
      setSucesso('Usuário criado e vinculado à empresa!');
      setNovoUsuario({ usuario: '', senha: '', nome: '' });
      fetchUsuarios();
    } catch (error) {
      setErro(error.message || 'Erro ao criar usuário.');
    } finally {
      setCriando(false);
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h4 className="page-title">Gerenciar Usuários</h4>

        {erro && <div className="alert alert-danger alert-dismissible fade show">{erro}
          <button type="button" className="btn-close" onClick={() => setErro('')}></button>
        </div>}
        {sucesso && <div className="alert alert-success alert-dismissible fade show">{sucesso}
          <button type="button" className="btn-close" onClick={() => setSucesso('')}></button>
        </div>}

        {/* Formulário de novo usuário */}
        <div className="card mb-4">
          <div className="card-header">
            <strong><PersonPlusFill className="me-2" />Criar Novo Usuário</strong>
          </div>
          <div className="card-body">
            <form onSubmit={handleCriarUsuario}>
              <div className="row g-3">
                <div className="col-md-4">
                  <label htmlFor="nome" className="form-label">Nome completo</label>
                  <input
                    type="text"
                    id="nome"
                    className="form-control"
                    placeholder="Nome do usuário"
                    value={novoUsuario.nome}
                    onChange={(e) => setNovoUsuario({ ...novoUsuario, nome: e.target.value })}
                  />
                </div>
                <div className="col-md-3">
                  <label htmlFor="usuario" className="form-label">Usuário *</label>
                  <input
                    type="text"
                    id="usuario"
                    className="form-control"
                    placeholder="Nome de login"
                    value={novoUsuario.usuario}
                    onChange={(e) => setNovoUsuario({ ...novoUsuario, usuario: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-3">
                  <label htmlFor="senha" className="form-label">Senha *</label>
                  <input
                    type="password"
                    id="senha"
                    className="form-control"
                    placeholder="Senha"
                    value={novoUsuario.senha}
                    onChange={(e) => setNovoUsuario({ ...novoUsuario, senha: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-2 d-flex align-items-end">
                  <button type="submit" className="btn btn-primary w-100" disabled={criando}>
                    {criando ? 'Criando...' : 'Criar'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Tabela de usuários */}
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">Nome</th>
                <th scope="col">Usuário</th>
                <th scope="col">Vínculo</th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length > 0 ? (
                usuarios.map((u) => (
                  <tr key={u.id}>
                    <td>{u.nome || '-'}</td>
                    <td>{u.usuario}</td>
                    <td>
                      {u.vinculado == 1 ? (
                        <span className="badge bg-success">Vinculado</span>
                      ) : (
                        <span className="badge bg-secondary">Não vinculado</span>
                      )}
                    </td>
                    <td>
                      {u.vinculado == 1 ? (
                        <button
                          className="btn btn-sm btn-outline-warning"
                          onClick={() => handleDesvincular(u.id)}
                        >
                          <PersonDashFill className="me-1" />Desvincular
                        </button>
                      ) : (
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleVincular(u.id)}
                        >
                          <PersonCheckFill className="me-1" />Vincular
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Usuarios;
