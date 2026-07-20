import { useState, useEffect, useMemo } from 'react';
import { API_URL } from './apiConfig';

function ListaVendas({ token, refreshKey, onVendaUpdated }) {
  const [vendas, setVendas] = useState([]);
  const [erro, setErro] = useState('');
  const [filtros, setFiltros] = useState({ cliente: '', dataInicio: '', dataFim: '' });

  const handleMarcarComoPago = async (vendaId) => {
    try {
      const response = await fetch(`${API_URL}/marcarpago.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id: vendaId }),
      });
      const data = await response.json();
      if (data.sucesso) {
        onVendaUpdated(); 
      } else {
        setErro(data.mensagem || 'Falha ao marcar como pago.');
      }
    } catch (error) {
      setErro('Erro de conexão ao marcar como pago.');
    }
  };

  useEffect(() => {
    const fetchVendas = async () => {
      setErro('');
      try {
        const response = await fetch(`${API_URL}/listavendas.php`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.sucesso) {
          setVendas(data.vendas);
        } else {
          setErro(data.mensagem || 'Falha ao buscar vendas.');
        }
      } catch (error) {
        setErro('Erro de conexão ao buscar vendas.');
      }
    };

    if (token) {
      fetchVendas();
    }
  }, [token, refreshKey]);

  const vendasFiltradas = useMemo(() => {
    return vendas.filter(venda => {
      const nomeCliente = venda.cliente_nome.toLowerCase();
      const filtroCliente = filtros.cliente.toLowerCase();
      
      // Converte a data de DD/MM/YYYY para um objeto Date do JS
      const [dia, mes, ano] = venda.data_vencimento.split('/');
      const dataVencimento = new Date(`${ano}-${mes}-${dia}`);

      const dataInicio = filtros.dataInicio ? new Date(filtros.dataInicio) : null;
      const dataFim = filtros.dataFim ? new Date(filtros.dataFim) : null;

      // Lógica de filtragem
      const matchCliente = nomeCliente.includes(filtroCliente);
      const matchDataInicio = !dataInicio || dataVencimento >= dataInicio;
      const matchDataFim = !dataFim || dataVencimento <= dataFim;

      return matchCliente && matchDataInicio && matchDataFim;
    });
  }, [vendas, filtros]);

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  if (erro) {
    return <p className="text-danger">{erro}</p>;
  }

  return (
    <div className="mt-4 card">
      <div className="card-body">
        <h4 className="card-title">Vendas Registradas</h4>
        
        {/* Filtros */}
        <div className="row mb-3 g-3 align-items-end">
          <div className="col-md-5">
            <label htmlFor="filtro-cliente" className="form-label">Filtrar por Cliente:</label>
            <input 
              type="text"
              id="filtro-cliente"
              name="cliente"
              className="form-control"
              placeholder="Nome do cliente..."
              value={filtros.cliente}
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
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">Cliente</th>
                <th scope="col">Valor (R$)</th>
                <th scope="col">Vencimento</th>
                <th scope="col">Status</th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody>
              {vendasFiltradas.length > 0 ? (
                vendasFiltradas.map((venda) => (
                  <tr key={venda.id}>
                    <td>{venda.cliente_nome}</td>
                    <td>{venda.valor}</td>
                    <td>{venda.data_vencimento}</td>
                    <td>
                      <span className={`badge ${venda.status_pagamento === 'pago' ? 'bg-success' : 'bg-warning'}`}>
                        {venda.status_pagamento}
                      </span>
                    </td>
                    <td>
                      {venda.status_pagamento === 'pendente' && (
                        <button 
                          className="btn btn-sm btn-outline-success"
                          onClick={() => handleMarcarComoPago(venda.id)}
                        >
                          Marcar como Pago
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    Nenhuma venda encontrada para os filtros aplicados.
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

export default ListaVendas;