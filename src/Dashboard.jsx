import React from 'react';

function Dashboard() {
  return (
    <div>
      <h2 className="page-title">Dashboard</h2>
      <p className="lead">Bem-vindo ao seu painel de controle VendasFlow.</p>
      
      <div className="row">
        {/* Aqui você pode adicionar cards de estatísticas no futuro */}
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Vendas Pendentes</h5>
              <p className="card-text fs-2 fw-bold">12</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Clientes Ativos</h5>
              <p className="card-text fs-2 fw-bold">4</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Total Arrecadado (Mês)</h5>
              <p className="card-text fs-2 fw-bold">R$ 1.234,56</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
