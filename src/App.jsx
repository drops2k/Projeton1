import { useState } from 'react';
import {
  Activity, ArrowDownLeft, ArrowLeftRight, ArrowUpRight, Bell, Building2,
  Check, ChevronDown, CircleHelp, CreditCard, Eye, EyeOff, FileText, Home,
  Menu, MoreHorizontal, Plus, QrCode, Search, Settings, ShieldCheck, Smartphone,
  Sparkles, Wallet, X
} from 'lucide-react';

const money = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const transactions = [
  { title: 'Mercado Primavera', detail: 'Hoje, 14:32 · Cartão de débito', amount: -86.40, icon: 'market' },
  { title: 'Pix recebido', detail: 'Hoje, 11:08 · Marina Oliveira', amount: 250.00, icon: 'pix' },
  { title: 'Plano de celular', detail: 'Ontem, 18:21 · Pagamento', amount: -49.90, icon: 'phone' },
  { title: 'Café do Centro', detail: 'Ontem, 09:15 · Cartão de débito', amount: -18.50, icon: 'coffee' },
];

const navItems = [
  { label: 'Visão geral', icon: Home },
  { label: 'Minha conta', icon: Wallet },
  { label: 'Transferências Pix', icon: ArrowLeftRight },
  { label: 'Cartões', icon: CreditCard },
  { label: 'Pagamentos', icon: FileText },
  { label: 'Extrato', icon: Activity },
];

function App() {
  const [active, setActive] = useState('Visão geral');
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [notice, setNotice] = useState('');
  const [showAll, setShowAll] = useState(false);

  const action = (name) => {
    setNotice(name + ' estará disponível quando a plataforma conectar um provedor financeiro autorizado. Esta versão usa apenas dados demonstrativos.');
    window.setTimeout(() => setNotice(''), 5000);
  };

  return (
    <div className="app-shell">
      <aside className={'sidebar ' + (mobileMenu ? 'sidebar-open' : '')}>
        <div className="brand">
          <div className="brand-mark"><span>n</span></div>
          <div><strong>nexa<span>+</span></strong><small>ÁREA FINANCEIRA</small></div>
          <button className="icon-button mobile-close" onClick={() => setMobileMenu(false)} aria-label="Fechar menu"><X size={19}/></button>
        </div>
        <div className="workspace-label">MENU PRINCIPAL</div>
        <nav className="nav-list">
          {navItems.map(({ label, icon: Icon }) => (
            <button key={label} className={'nav-item ' + (active === label ? 'nav-active' : '')}
              onClick={() => { setActive(label); setMobileMenu(false); if (label !== 'Visão geral') action(label); }}>
              <Icon size={18} strokeWidth={1.8}/><span>{label}</span>
              {label === 'Transferências Pix' && <span className="nav-dot"/>}
            </button>
          ))}
        </nav>
        <div className="sidebar-spacer"/>
        <div className="help-card">
          <div className="help-icon"><CircleHelp size={18}/></div>
          <strong>Precisa de ajuda?</strong>
          <p>Estamos preparando um espaço para você.</p>
          <button onClick={() => action('Central de ajuda')}>Acessar suporte <span>↗</span></button>
        </div>
        <button className="nav-item settings-item" onClick={() => action('Configurações')}><Settings size={18}/><span>Configurações</span></button>
        <div className="sidebar-foot"><span className="online-dot"/> Ambiente demonstrativo</div>
      </aside>

      {mobileMenu && <button className="scrim" onClick={() => setMobileMenu(false)} aria-label="Fechar menu"/>}

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-button mobile-menu" onClick={() => setMobileMenu(true)} aria-label="Abrir menu"><Menu size={21}/></button>
            <div className="breadcrumb">Workspace <span>/</span> <strong>{active}</strong></div>
          </div>
          <div className="topbar-actions">
            <button className="search-box" onClick={() => action('Busca')}><Search size={17}/><span>Buscar</span><kbd>⌘ K</kbd></button>
            <button className="icon-button notification-button" onClick={() => action('Notificações')} aria-label="Notificações"><Bell size={19}/><i/></button>
            <div className="top-divider"/>
            <button className="profile" onClick={() => action('Perfil da conta')}>
              <div className="avatar">FD</div><div className="profile-copy"><strong>Minha conta</strong><small>Conta demonstrativa</small></div><ChevronDown size={15}/>
            </button>
          </div>
        </header>

        <div className="content">
          <div className="welcome-row">
            <div>
              <div className="eyebrow"><Sparkles size={14}/> SUA VIDA FINANCEIRA, MAIS SIMPLES</div>
              <h1>Bom dia! <span className="wave">✳</span></h1>
              <p className="subtitle">Aqui está um resumo da sua conta hoje.</p>
            </div>
            <button className="date-chip"><span className="date-dot"/> Visão de hoje <ChevronDown size={15}/></button>
          </div>

          <div className="demo-banner"><ShieldCheck size={17}/><span><strong>Modo demonstração.</strong> Os valores e lançamentos são fictícios. Nenhuma transação real é executada.</span></div>

          <section className="summary-grid">
            <div className="balance-card">
              <div className="balance-card-top"><span><span className="balance-icon"><Wallet size={17}/></span> Saldo disponível</span>
                <button className="eye-button" onClick={() => setBalanceVisible(!balanceVisible)} aria-label="Mostrar ou ocultar saldo">{balanceVisible ? <Eye size={17}/> : <EyeOff size={17}/>}</button>
              </div>
              <div className="balance-amount">{balanceVisible ? money(8425.70) : '••••••••'}</div>
              <div className="balance-bottom"><span><i/> Conta principal</span><span>•••• 2048</span></div>
              <div className="balance-decoration decoration-one"/><div className="balance-decoration decoration-two"/>
            </div>
            <div className="stat-card">
              <div className="stat-head"><span className="stat-icon incoming"><ArrowDownLeft size={18}/></span><span className="stat-period">Este mês</span></div>
              <p className="stat-label">Entradas</p><div className="stat-amount">{money(4250.00)}</div>
              <div className="stat-foot"><span className="trend-up">↗ 12,8%</span><span>vs. mês anterior</span></div>
            </div>
            <div className="stat-card">
              <div className="stat-head"><span className="stat-icon outgoing"><ArrowUpRight size={18}/></span><span className="stat-period">Este mês</span></div>
              <p className="stat-label">Saídas</p><div className="stat-amount">{money(1834.80)}</div>
              <div className="stat-foot"><span className="trend-neutral">↘ 4,2%</span><span>vs. mês anterior</span></div>
            </div>
          </section>

          <section className="quick-section">
            <div className="section-heading"><div><h2>Acesso rápido</h2><p>O que você deseja fazer hoje?</p></div></div>
            <div className="quick-grid">
              <button className="quick-action primary-action" onClick={() => action('Enviar Pix')}><span className="quick-icon"><ArrowUpRight size={20}/></span><span><strong>Enviar Pix</strong><small>Transferir dinheiro</small></span><span className="quick-arrow">↗</span></button>
              <button className="quick-action" onClick={() => action('Receber Pix')}><span className="quick-icon mint"><ArrowDownLeft size={20}/></span><span><strong>Receber Pix</strong><small>Compartilhar dados</small></span><span className="quick-arrow">↗</span></button>
              <button className="quick-action" onClick={() => action('Pagar conta')}><span className="quick-icon lavender"><QrCode size={20}/></span><span><strong>Pagar conta</strong><small>Usar código ou boleto</small></span><span className="quick-arrow">↗</span></button>
              <button className="quick-action" onClick={() => action('Adicionar dinheiro')}><span className="quick-icon peach"><Plus size={20}/></span><span><strong>Adicionar</strong><small>Adicionar saldo</small></span><span className="quick-arrow">↗</span></button>
            </div>
          </section>

          <section className="lower-grid">
            <div className="panel transactions-panel">
              <div className="panel-heading"><div><h2>Movimentações recentes</h2><p>Acompanhe as últimas atividades da conta</p></div><button className="text-link" onClick={() => setShowAll(!showAll)}>{showAll ? 'Ver menos' : 'Ver extrato'} <span>↗</span></button></div>
              <div className="transaction-list">
                {(showAll ? [...transactions, ...transactions] : transactions).map((tx, index) => (
                  <div className="transaction-row" key={tx.title + index}>
                    <div className={'transaction-icon ' + (tx.amount > 0 ? 'tx-in' : '')}>{tx.amount > 0 ? <ArrowDownLeft size={18}/> : tx.icon === 'phone' ? <Smartphone size={18}/> : <CreditCard size={18}/>}</div>
                    <div className="transaction-copy"><strong>{tx.title}</strong><span>{tx.detail}</span></div>
                    <div className={'transaction-amount ' + (tx.amount > 0 ? 'positive' : '')}>{tx.amount > 0 ? '+' : '−'} {money(Math.abs(tx.amount))}</div>
                  </div>
                ))}
              </div>
              <div className="panel-footnote"><span className="footnote-dot"/> Dados de exemplo para visualização</div>
            </div>
            <div className="panel account-panel">
              <div className="panel-heading"><div><h2>Detalhes da conta</h2><p>Seus dados bancários</p></div><button className="icon-button small-icon" onClick={() => action('Detalhes da conta')} aria-label="Mais detalhes"><MoreHorizontal size={19}/></button></div>
              <div className="account-type"><div className="account-type-icon"><Building2 size={20}/></div><div><strong>Conta digital</strong><span>Conta principal</span></div><span className="status-pill"><i/> Ativa (demo)</span></div>
              <div className="account-details"><div><span>Agência</span><strong>0001</strong></div><div><span>Conta</span><strong>•••••-2048</strong></div><div><span>Tipo de conta</span><strong>Conta de demonstração</strong></div></div>
              <button className="outline-button" onClick={() => action('Dados da conta')}>Ver dados da conta <span>↗</span></button>
              <div className="security-note"><div><ShieldCheck size={17}/></div><p><strong>Sua segurança importa</strong><span>Recursos de segurança e autenticação serão configurados na próxima etapa.</span></p></div>
            </div>
          </section>
          <footer className="footer"><span>© 2026 ProjetoN1 · Protótipo de interface</span><span><ShieldCheck size={13}/> Ambiente de testes <span className="footer-separator">·</span> <button onClick={() => action('Privacidade')}>Privacidade</button></span></footer>
        </div>
      </main>

      {notice && <div className="toast"><div className="toast-icon"><Check size={17}/></div><div><strong>Protótipo interativo</strong><p>{notice}</p></div><button onClick={() => setNotice('')} aria-label="Fechar aviso"><X size={17}/></button></div>}
    </div>
  );
}

export default App;
