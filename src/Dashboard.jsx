import { useState, useEffect } from 'react';
import { API_URL } from './apiConfig';

function Dashboard({ token }) {
  const [stats, setStats] = useState({
    vendas_pendentes: 0,
    clientes_ativos: 0,
    total_arrecadado_mes: 0,
    total_a_receber_mes: 0
  });
  const [erro, setErro] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) return; // Não faz a chamada se o token não estiver disponível
      try {
        const response = await fetch(`${API_URL}/dashboard.php`, {
          headers: { 
            'Authorization': `Bearer ${token}` // Garante que o token seja enviado
          }
        });
        const data = await response.json();
        if (data.sucesso) {
          setStats(data.dados);
        } else {
          setErro(data.mensagem || 'Falha ao buscar estatísticas.');
        }
      } catch (error) {
        setErro('Erro de conexão ao buscar dados do dashboard.');
      }
    };
    fetchStats();
  }, [token]);

  // Função para formatar valores como moeda
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value || 0); // Garante que não quebre com valores nulos
  };

  if (erro) {
    return <div className="alert alert-danger">{erro}</div>;
  }

  return (
    <div>
      <h2 className="page-title">Dashboard</h2>
      <p className="lead">Bem-vindo ao seu painel de controle VendasFlow.</p>
      
      <div className="row">
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Vendas Pendentes</h5>
              <p className="card-text fs-2 fw-bold">{stats.vendas_pendentes}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Clientes Ativos</h5>
              <p className="card-text fs-2 fw-bold">{stats.clientes_ativos}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Arrecadado (Mês)</h5>
              <p className="card-text fs-2 fw-bold">{formatCurrency(stats.total_arrecadado_mes)}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">A Receber (Mês)</h5>
              <p className="card-text fs-2 fw-bold">{formatCurrency(stats.total_a_receber_mes)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
