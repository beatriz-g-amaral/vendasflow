import React from 'react';
import { HouseDoorFill, CashStack, PeopleFill } from 'react-bootstrap-icons';

function Sidebar({ paginaAtual, setPaginaAtual, handleLogout, empresaNome }) {
  const NavLink = ({ pagina, nome, icon }) => (
    <li className="nav-item">
      <a 
        href="#" 
        className={`nav-link ${paginaAtual === pagina ? 'active' : ''}`}
        onClick={(e) => {
          e.preventDefault();
          setPaginaAtual(pagina);
        }}
      >
        {icon}
        <span className="ms-2">{nome}</span>
      </a>
    </li>
  );

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <a href="#" className="sidebar-brand">VendasFlow</a>
        {empresaNome && <div className="sidebar-empresa">{empresaNome}</div>}
      </div>
      <ul className="nav nav-pills flex-column">
        <NavLink pagina="dashboard" nome="Dashboard" icon={<HouseDoorFill />} />
        <NavLink pagina="vendas" nome="Vendas" icon={<CashStack />} />
        <NavLink pagina="clientes" nome="Clientes" icon={<PeopleFill />} />
      </ul>
      <div className="sidebar-footer">
        <button className="btn btn-danger w-100" onClick={handleLogout}>
          Sair
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
