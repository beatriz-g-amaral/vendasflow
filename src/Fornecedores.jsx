import { useState, useEffect } from 'react';
import apiService from './apiService';

function Fornecedores({ token, empresaId }) {
  const [fornecedores, setFornecedores] = useState([]);
  const [formData, setFormData] = useState({ nome: '', telefone: '', endereco: '' });
  const [mensagem, setMensagem] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchFornecedores = async () => {
      try {
        const data = await apiService('/fornecedores.php');
        setFornecedores(data.fornecedores);
      } catch (error) {
        setMensagem(error.message || 'Falha ao buscar fornecedores.');
      }
    };
    fetchFornecedores();
  }, [token, empresaId, refreshKey]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await apiService('/fornecedores.php', 'POST', formData);
      setMensagem(data.mensagem);
      setFormData({ nome: '', telefone: '', endereco: '' });
      setRefreshKey(oldKey => oldKey + 1);
    } catch (error) {
      setMensagem(error.message || 'Erro ao conectar com a API.');
    }
  };

  return (
    <>
      <div className="card">
        <div className="card-body">
          <h4 className="card-title">Novo Fornecedor</h4>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="nomeFornecedor" className="form-label">Nome:</label>
                <input
                  type="text"
                  id="nomeFornecedor"
                  className="form-control"
                  required
                  value={formData.nome}
                  onChange={e => setFormData({ ...formData, nome: e.target.value })}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="telFornecedor" className="form-label">Telefone:</label>
                <input
                  type="text"
                  id="telFornecedor"
                  className="form-control"
                  value={formData.telefone}
                  onChange={e => setFormData({ ...formData, telefone: e.target.value })}
                />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="endFornecedor" className="form-label">Endereço:</label>
              <input
                type="text"
                id="endFornecedor"
                className="form-control"
                value={formData.endereco}
                onChange={e => setFormData({ ...formData, endereco: e.target.value })}
              />
            </div>
            <button type="submit" className="btn btn-primary">Salvar Fornecedor</button>
          </form>
          {mensagem && <div className="alert alert-info mt-3">{mensagem}</div>}
        </div>
      </div>

      <div className="mt-4 card">
        <div className="card-body">
          <h4 className="card-title">Fornecedores Cadastrados</h4>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Telefone</th>
                  <th>Endereço</th>
                </tr>
              </thead>
              <tbody>
                {fornecedores.length > 0 ? (
                  fornecedores.map(fornecedor => (
                    <tr key={fornecedor.id}>
                      <td>{fornecedor.nome}</td>
                      <td>{fornecedor.telefone}</td>
                      <td>{fornecedor.endereco}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">Nenhum fornecedor cadastrado.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default Fornecedores;
