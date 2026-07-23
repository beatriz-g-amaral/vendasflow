import { useState, useEffect, useMemo } from 'react';
import apiService from './apiService';

function ListaCompras({ token, empresaId, refreshKey, onCompraUpdated }) {
  const [compras, setCompras] = useState([]);
  const [erro, setErro] = useState('');
  const [filtros, setFiltros] = useState({ fornecedor: '', dataInicio: '', dataFim: '' });

  const handleMarcarComoPago = async (compraId) => {
    try {
      await apiService('/marcarcomprapago.php', 'POST', { id: compraId });
      onCompraUpdated();
    } catch (error) {
      setErro(error.message || 'Erro de conexão ao marcar como pago.');
    }
  };

  const handleExcluirCompra = async (compraId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta compra?')) {
      return;
    }
    try {
      await apiService('/excluircompra.php', 'POST', { id: compraId });
      onCompraUpdated();
    } catch (error) {
      setErro(error.message || 'Erro de conexão ao excluir compra.');
    }
  };

  useEffect(() => {
    const fetchCompras = async () => {
      setErro('');
      try {
        const data = await apiService('/listacompras.php');
        setCompras(data.compras);
      } catch (error) {
        setErro(error.message || 'Erro de conexão ao buscar compras.');
      }
    };

    if (token) {
      fetchCompras();
    }
  }, [token, empresaId, refreshKey]);

  const comprasFiltradas = useMemo(() => {
    return compras.filter(compra => {
      const nomeFornecedor = compra.fornecedor_nome.toLowerCase();
      const filtroFornecedor = filtros.fornecedor.toLowerCase();

      const [dia, mes, ano] = compra.data_vencimento.split('/');
      const dataVencimento = new Date(`${ano}-${mes}-${dia}`);

      const dataInicio = filtros.dataInicio ? new Date(filtros.dataInicio) : null;
      const dataFim = filtros.dataFim ? new Date(filtros.dataFim) : null;

      const matchFornecedor = nomeFornecedor.includes(filtroFornecedor);
      const matchDataInicio = !dataInicio || dataVencimento >= dataInicio;
      const matchDataFim = !dataFim || dataVencimento <= dataFim;

      return matchFornecedor && matchDataInicio && matchDataFim;
    });
  }, [compras, filtros]);

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  if (erro) {
    return <p className="text-danger">{erro}</p>;
  }

  return (
    <div className="card">
      <div className="card-body">
        <h4 className="page-title">Compras Registradas</h4>

        <div className="row mb-3 g-3 align-items-end">
          <div className="col-md-5">
            <label htmlFor="filtro-fornecedor" className="form-label">Filtrar por Fornecedor:</label>
            <input
              type="text"
              id="filtro-fornecedor"
              name="fornecedor"
              className="form-control"
              placeholder="Nome do fornecedor..."
              value={filtros.fornecedor}
              onChange={handleFiltroChange}
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="filtro-data-inicio" className="form-label">De:</label>
            <input
              type="date"
              id="filtro-data-inicio"
              name="dataInicio"
              className="form-control"
              value={filtros.dataInicio}
              onChange={handleFiltroChange}
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="filtro-data-fim" className="form-label">Até:</label>
            <input
              type="date"
              id="filtro-data-fim"
              name="dataFim"
              className="form-control"
              value={filtros.dataFim}
              onChange={handleFiltroChange}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">Fornecedor</th>
                <th scope="col">Valor (R$)</th>
                <th scope="col">Vencimento</th>
                <th scope="col">Status</th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody>
              {comprasFiltradas.length > 0 ? (
                comprasFiltradas.map((compra) => (
                  <tr key={compra.id}>
                    <td>{compra.fornecedor_nome}</td>
                    <td>{compra.valor}</td>
                    <td>{compra.data_vencimento}</td>
                    <td>
                      <span className={`badge bg-${compra.status_pagamento === 'pago' ? 'success' : 'warning'}`}>
                        {compra.status_pagamento}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        {compra.status_pagamento === 'pendente' && (
                          <button
                            className="btn btn-sm btn-outline-success"
                            onClick={() => handleMarcarComoPago(compra.id)}
                          >
                            Marcar como Pago
                          </button>
                        )}
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleExcluirCompra(compra.id)}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    Nenhuma compra encontrada para os filtros aplicados.
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

export default ListaCompras;
