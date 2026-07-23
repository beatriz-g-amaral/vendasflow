import { useState, useEffect } from 'react';
import { GearFill } from 'react-bootstrap-icons';
import apiService from './apiService';

function Configuracoes({ token, empresaId }) {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  useEffect(() => {
    if (token && empresaId) {
      fetchWebhook();
    }
  }, [token, empresaId]);

  const fetchWebhook = async () => {
    try {
      const data = await apiService('/webhook.php');
      setWebhookUrl(data.webhook_url || '');
    } catch (error) {
      setErro(error.message || 'Erro ao carregar configuração do webhook.');
    }
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setErro('');
    setSucesso('');

    try {
      const data = await apiService('/webhook.php', 'PUT', {
        webhook_url: webhookUrl.trim()
      });
      setSucesso(data.mensagem || 'Webhook atualizado com sucesso!');
    } catch (error) {
      setErro(error.message || 'Erro ao salvar configuração do webhook.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h4 className="page-title">
          <GearFill className="me-2" />Configurações
        </h4>

        {erro && (
          <div className="alert alert-danger alert-dismissible fade show">
            {erro}
            <button type="button" className="btn-close" onClick={() => setErro('')}></button>
          </div>
        )}
        {sucesso && (
          <div className="alert alert-success alert-dismissible fade show">
            {sucesso}
            <button type="button" className="btn-close" onClick={() => setSucesso('')}></button>
          </div>
        )}

        <div className="card">
          <div className="card-header">
            <strong>Webhook de Notificações</strong>
          </div>
          <div className="card-body">
            <p className="text-muted">
              Configure a URL do webhook para onde as notificações de pagamentos 
              pendentes serão enviadas. Este webhook é usado pelo sistema de 
              verificação de vencimentos para enviar lembretes de pagamento.
            </p>
            <form onSubmit={handleSalvar}>
              <div className="mb-3">
                <label htmlFor="webhookUrl" className="form-label fw-semibold">
                  URL do Webhook
                </label>
                <input
                  type="url"
                  className="form-control"
                  id="webhookUrl"
                  placeholder="https://exemplo.com/webhook"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                />
                <div className="form-text">
                  Exemplo: http://192.168.0.42:3000/webhooks/incoming/pagamentos
                </div>
              </div>
              <button 
                type="submit" 
                className="btn btn-success"
                disabled={salvando}
              >
                {salvando ? 'Salvando...' : 'Salvar'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Configuracoes;
