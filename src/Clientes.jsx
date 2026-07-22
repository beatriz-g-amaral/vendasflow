import { useState, useEffect } from 'react';
import apiService from './apiService';

function Clientes({ token, empresaId }) {
  const [clientes, setClientes] = useState([]);
  const [formData, setFormData] = useState({ nome: '', telefone: '', endereco: '' });
  const [mensagem, setMensagem] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const data = await apiService('/clientes.php');
        setClientes(data.clientes);
      } catch (error) {
        setMensagem(error.message || 'Falha ao buscar clientes.');
      }
    };
    fetchClientes();
  }, [token, empresaId, refreshKey]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await apiService('/clientes.php', 'POST', formData);
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
          <h4 className="card-title">Novo Cliente</h4>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="nomeCliente" className="form-label">Nome Completo:</label>
                <input
                  type="text"
                  id="nomeCliente"
                  className="form-control"
                  required
                  value={formData.nome}
                  onChange={e => setFormData({ ...formData, nome: e.target.value })}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="telCliente" className="form-label">Telefone:</label>
                <input
                  type="text"
                  id="telCliente"
                  className="form-control"
                  value={formData.telefone}
                  onChange={e => setFormData({ ...formData, telefone: e.target.value })}
                />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="endCliente" className="form-label">Endereço:</label>
              <input
                type="text"
                id="endCliente"
                className="form-control"
                value={formData.endereco}
                onChange={e => setFormData({ ...formData, endereco: e.target.value })}
              />
            </div>
            <button type="submit" className="btn btn-primary">Salvar Cliente</button>
          </form>
          {mensagem && <div className="alert alert-info mt-3">{mensagem}</div>}
        </div>
      </div>

      <div className="mt-4 card">
        <div className="card-body">
          <h4 className="card-title">Clientes Cadastrados</h4>
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
                {clientes.length > 0 ? (
                  clientes.map(cliente => (
                    <tr key={cliente.id}>
                      <td>{cliente.nome}</td>
                      <td>{cliente.telefone}</td>
                      <td>{cliente.endereco}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">Nenhum cliente cadastrado.</td>
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

export default Clientes;
