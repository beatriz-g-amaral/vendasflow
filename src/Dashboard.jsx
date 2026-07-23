import { useState, useEffect } from 'react';
import apiService from './apiService';

function Dashboard({ token }) {
  const [stats, setStats] = useState({
    vendas_pendentes: 0,
    clientes_ativos: 0,
    fornecedores_ativos: 0,
    total_arrecadado_mes: 0,
    total_a_receber_mes: 0,
    total_a_pagar_mes: 0
  });
  const [erro, setErro] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) return;
      try {
        const data = await apiService('/dashboard.php');
        setStats(data.dados);
      } catch (error) {
        setErro(error.message || 'Erro de conexão ao buscar dados do dashboard.');
      }
    };
    fetchStats();
  }, [token]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value || 0);
  };

  if (erro) {
    return <div className="alert alert-danger">{erro}</div>;
  }

  return (
    <div>
      <h2 className="page-title">Dashboard</h2>
      <p className="lead">Bem-vindo ao seu painel de controle VendasFlow.</p>
      
      <div className="row">
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Vendas Pendentes</h5>
              <p className="card-text fs-2 fw-bold">{stats.vendas_pendentes}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Clientes Ativos</h5>
              <p className="card-text fs-2 fw-bold">{stats.clientes_ativos}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Fornecedores</h5>
              <p className="card-text fs-2 fw-bold">{stats.fornecedores_ativos}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-md-4">
          <div className="card text-center border-success">
            <div className="card-body">
              <h5 className="card-title text-success">Arrecadado (Mês)</h5>
              <p className="card-text fs-2 fw-bold text-success">{formatCurrency(stats.total_arrecadado_mes)}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center border-warning">
            <div className="card-body">
              <h5 className="card-title text-warning">A Receber (Mês)</h5>
              <p className="card-text fs-2 fw-bold text-warning">{formatCurrency(stats.total_a_receber_mes)}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center border-danger">
            <div className="card-body">
              <h5 className="card-title text-danger">A Pagar (Mês)</h5>
              <p className="card-text fs-2 fw-bold text-danger">{formatCurrency(stats.total_a_pagar_mes)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
