## 📋 Descrição do Projeto — **VendasFlow**

O **VendasFlow** é um sistema web completo de **gestão de vendas** com suporte a **múltiplas empresas**, dividido em duas partes:

---

### 🔧 Backend — `api-vendasflow` (PHP)

API REST construída em **PHP puro** com **MySQL**, utilizando:

- **Autenticação JWT** via `firebase/php-jwt` — tokens Bearer para proteger os endpoints
- **Variáveis de ambiente** via `vlucas/phpdotenv` — configuração do banco e chave secreta
- **CORS** habilitado para comunicação com o frontend em React

**Endpoints principais:**
| Endpoint | Descrição |
|---|---|
| login.php | Autenticação do usuário, retorna token JWT + lista de empresas vinculadas |
| auth.php | Middleware de autenticação — valida token e header `X-Empresa-Id` |
| empresas.php | CRUD de empresas + vínculo/desvinculo de usuários |
| clientes.php | CRUD de clientes (filtrados por empresa) |
| index.php | Criação de vendas parceladas (com ou sem entrada) |
| listavendas.php | Listagem de vendas com filtro por empresa |
| dashboard.php | Dados do dashboard financeiro |
| usuarios.php | Gestão de usuários |
| criarusuario.php | Criação de novos usuários |
| excluirvenda.php / marcarpago.php / verificarvencimentos.php | Ações complementares |

**Arquitetura multi-empresas:**
- Tabela `empresas` + tabela `empresa_usuario` (vínculo N:N)
- Tabelas `vendas` e `clientes` possuem coluna `empresa_id` para isolamento por empresa
- O middleware auth.php lê o header `X-Empresa-Id` e valida se o usuário tem permissão

---

### 🎨 Frontend — `vendasflow` (React + Vite)

**Single Page Application** construída com **React 19** + **Vite 8**, com as seguintes páginas:

| Página | Componente | Descrição |
|---|---|---|
| Login | `Login.jsx` | Autenticação em 2 etapas (credenciais → seleção de empresa) |
| Dashboard | `Dashboard.jsx` | Visão geral financeira |
| Vendas | `Vendas.jsx` | Gestão de vendas e parcelas |
| Clientes | `Clientes.jsx` | CRUD de clientes |
| Usuários | `Usuarios.jsx` | Gestão de usuários do sistema |
| Sidebar | `Sidebar.jsx` | Navegação lateral com nome da empresa |

**Fluxo de uso:**
1. Usuário faz login com credenciais
2. Recebe token JWT + lista de empresas vinculadas
3. Se possui **1 empresa** → é selecionada automaticamente
4. Se possui **várias** → seletor de empresa é exibido
5. O `empresaId` é armazenado em `localStorage` e enviado como header `X-Empresa-Id` em todas as requisições
6. O backend filtra todos os dados pela empresa e valida permissões

---

### 🗄️ Banco de Dados (MySQL)

- Tabelas principais: `usuarios`, `empresas`, `empresa_usuario`, `vendas`, `clientes`
- Relacionamento N:N entre usuários e empresas
- Isolamento de dados por empresa nas tabelas de vendas e clientes

---

### 💡 Resumo

O **VendasFlow** é um sistema **multi-empresas** para controle de vendas parceladas, ideal para pequenos negócios que precisam gerenciar múltiplas empresas (ou filiais) a partir de uma única plataforma, com autenticação segura via JWT e interface moderna em React.