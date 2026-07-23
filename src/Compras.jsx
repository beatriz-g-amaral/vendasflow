import { useState, useEffect } from 'react';
import ListaCompras from './ListaCompras';
import apiService from './apiService';

const getFormattedDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

function Compras({ token, empresaId }) {
  const [fornecedores, setFornecedores] = useState([]);
  const [formData, setFormData] = useState({ 
    fornecedor_id: '', 
    valor_entrada: '', 
    valor_parcela: '', 
    numero_parcelas: '' 
  });
  const [datasParcelas, setDatasParcelas] = useState([]);
  const [mensagem, setMensagem] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchFornecedores = async () => {
      try {
        const data = await apiService('/fornecedores.php');
        setFornecedores(data.fornecedores);
      } catch (error) {
        setMensagem(`Erro ao carregar fornecedores: ${error.message}`);
      }
    };
    fetchFornecedores();
  }, [token, empresaId]);

  useEffect(() => {
    const numParcelas = parseInt(formData.numero_parcelas, 10);
    if (numParcelas > 0) {
      const hoje = new Date();
      const novasDatas = Array.from({ length: numParcelas }, (_, i) => {
        const dataVencimento = new Date(hoje);
        dataVencimento.setDate(hoje.getDate() + (i + 1) * 7);
        return getFormattedDate(dataVencimento);
      });
      setDatasParcelas(novasDatas);
    } else {
      setDatasParcelas([]);
    }
  }, [formData.numero_parcelas]);

  const handleDataParcelaChange = (index, novaData) => {
    const novasDatas = [...datasParcelas];
    novasDatas[index] = novaData;
    setDatasParcelas(novasDatas);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (datasParcelas.some(data => !data)) {
      setMensagem('Por favor, preencha todas as datas de vencimento das parcelas.');
      return;
    }

    const payload = { ...formData, datas_parcelas: datasParcelas };

    try {
      const data = await apiService('/compras.php', 'POST', payload);
      setMensagem(data.mensagem);

      setFormData({ fornecedor_id: '', valor_entrada: '', valor_parcela: '', numero_parcelas: '' });
      setDatasParcelas([]);
      setRefreshKey(oldKey => oldKey + 1);

    } catch (error) {
      setMensagem(error.message || 'Erro ao conectar com a API.');
    }
  };

  return (
    <>
      <div className="card">
        <div className="card-body">
          <h4 className="card-title">Nova Compra</h4>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="fornecedorSelect" className="form-label">Fornecedor:</label>
              <select
                id="fornecedorSelect"
                className="form-select"
                required
                value={formData.fornecedor_id}
                onChange={e => setFormData({ ...formData, fornecedor_id: e.target.value })}
              >
                <option value="" disabled>Selecione um fornecedor</option>
                {fornecedores.map(fornecedor => (
                  <option key={fornecedor.id} value={fornecedor.id}>
                    {fornecedor.nome}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="row">
              <div className="col-md-3 mb-3">
                <label htmlFor="entradaInput" className="form-label">Entrada (R$):</label>
                <input 
                  type="number"
                  id="entradaInput"
                  className="form-control"
                  placeholder="0.00"
                  step="0.01"
                  value={formData.valor_entrada}
                  onChange={e => setFormData({...formData, valor_entrada: e.target.value})}
                />
              </div>
              <div className="col-md-3 mb-3">
                <label htmlFor="parcelaInput" className="form-label">Valor da Parcela (R$):</label>
                <input 
                  type="number"
                  id="parcelaInput"
                  className="form-control"
                  placeholder="0.00"
                  step="0.01"
                  required
                  value={formData.valor_parcela}
                  onChange={e => setFormData({...formData, valor_parcela: e.target.value})}
                />
              </div>
              <div className="col-md-3 mb-3">
                <label htmlFor="numParcelasInput" className="form-label">Nº de Parcelas:</label>
                <input 
                  type="number"
                  id="numParcelasInput"
                  className="form-control"
                  placeholder="0"
                  required
                  value={formData.numero_parcelas}
                  onChange={e => setFormData({...formData, numero_parcelas: e.target.value})}
                />
              </div>
            </div>

            {datasParcelas.length > 0 && (
              <div className="mt-3">
                <h5>Datas das Parcelas</h5>
                <div className="row">
                  {datasParcelas.map((data, index) => (
                    <div className="col-md-3 mb-2" key={index}>
                      <label htmlFor={`data-parcela-${index}`} className="form-label small">
                        {index + 1}ª Parcela:
                      </label>
                      <input
                        type="date"
                        id={`data-parcela-${index}`}
                        className="form-control"
                        value={data}
                        onChange={(e) => handleDataParcelaChange(index, e.target.value)}
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button type="submit" className="btn btn-primary mt-3">
              Registrar Compra
            </button>
          </form>

          {mensagem && <div className={`alert ${mensagem.includes('sucesso') ? 'alert-success' : 'alert-danger'} mt-3`}>{mensagem}</div>}
        </div>
      </div>

      <ListaCompras token={token} empresaId={empresaId} refreshKey={refreshKey} onCompraUpdated={() => setRefreshKey(oldKey => oldKey + 1)} />
    </>
  );
}

export default Compras;
