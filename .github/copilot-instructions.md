# VendasFlow — Instruções para o Copilot

## 📋 Visão Geral
Sistema de **gestão de vendas parceladas** com suporte a **múltiplas empresas**. 
- Backend: **PHP puro + MySQL + JWT** (`/api-vendasflow/`)
- Frontend: **React 19 + Vite + Bootstrap 5** (`/vendasflow/`)

## 🌐 API (PHP)
- Roda em `http://192.168.0.38:8000`
- Autenticação via `Authorization: Bearer <token>` (JWT HS256)
- Header obrigatório: `X-Empresa-Id` (case-insensitive)
- Headers padrão em todos endpoints: CORS, Content-Type: application/json

### Endpoints
| Endpoint | Métodos | Descrição |
|---|---|---|
| `/login.php` | POST | Autenticação → token + empresas[] + usuario |
| `/empresas.php` | GET, POST, PUT | CRUD empresas + vincular/desvincular usuários |
| `/clientes.php` | GET, POST | CRUD clientes (filtrados por empresa) |
| `/index.php` | POST | Criar venda parcelada (com ou sem entrada) |
| `/listavendas.php` | GET | Listar vendas (filtradas por empresa) |
| `/dashboard.php` | GET | Dados financeiros (pendências, recebido, clientes) |
| `/usuarios.php` | GET | Listar usuários da empresa |
| `/criarusuario.php` | POST | Criar usuário |
| `/excluirvenda.php` | POST | Excluir venda |
| `/marcarpago.php` | POST | Marcar venda como paga |
| `/webhook.php` | GET, PUT | Configurar URL do webhook de notificações |
| `/fornecedores.php` | GET, POST | CRUD fornecedores (filtrados por empresa) |
| `/compras.php` | POST | Criar compra (parcelada ou única) |
| `/listacompras.php` | GET | Listar compras (filtradas por empresa) |
| `/excluircompra.php` | POST | Excluir compra |
| `/marcarcomprapago.php` | POST | Marcar compra como paga |

### Auth Middleware (auth.php)
1. Lê `Authorization: Bearer <token>`
2. Decodifica JWT com `JWT_SECRET_KEY` (HS256)
3. Extrai `usuario_id` do `$decoded->sub`
4. Lê `X-Empresa-Id` dos headers e valida vínculo em `empresa_usuario`
5. Define `$usuario_id` e `$empresa_id`

## 🗄️ Banco de Dados
- `usuarios` (id, nome, usuario UNIQUE, senha)
- `empresas` (id, nome, cnpj, created_at)
- `empresa_usuario` (empresa_id FK, usuario_id FK) — vínculo N:N
- `vendas` (id, cliente_id FK, cliente_nome, valor, data_vencimento, status_pagamento, empresa_id FK, data_pagamento, notificacao_enviada DEFAULT 0)
- `clientes` (id, nome, telefone, empresa_id FK, endereco, bairro, cidade)
- `configuracoes` (id, empresa_id FK, chave, valor, UNIQUE empresa_id+chave) — configurações por empresa
- `fornecedores` (id, nome, telefone, empresa_id FK, endereco, bairro, cidade)
- `compras` (id, fornecedor_id FK, fornecedor_nome, valor, data_vencimento, status_pagamento, empresa_id FK, data_pagamento, notificacao_enviada DEFAULT 0)

### Regras
- Vendas e Compras são parcelas individuais (N parcelas = N registros)
- Status: `pendente` | `pago`
- Todas as queries incluem `WHERE empresa_id = :empresa_id`
- `cliente_nome` em vendas é denormalizado
- `fornecedor_nome` em compras é denormalizado

## 🎨 Frontend (React)
- State global em `App.jsx`: token, empresaId, empresaNome, paginaAtual
- Login em 2 etapas: credenciais → seleção de empresa (se múltiplas)
- Dados salvos em `localStorage`: authToken, empresaId, empresaNome
- `apiService.js` — fetch wrapper com headers automáticos
- `apiConfig.js` — `API_URL` do backend

### Páginas (Sidebar)
- Dashboard (`HouseDoorFill`)
- Vendas (`CashStack`)
- Clientes (`PeopleFill`)
- Fornecedores (`TruckFill`)
- Compras (`CartFill`)
- Usuários (`PersonFill`)
- Configurações (`GearFill`) — webhook URL editável

## 🚀 Como Executar
```bash
# Backend
cd api-vendasflow && php -S 0.0.0.0:8000

# Frontend
cd vendasflow && npm run dev
```
