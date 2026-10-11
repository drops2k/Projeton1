import { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { authClient } from './lib/supabase.js';
import { Dashboard } from './App.jsx';

function LoginPage({ onLogin, loading, error, configured }) {
 return <main className="auth-page">
  <section className="auth-visual">
   <div className="auth-brand"><div className="brand-mark"><span>n</span></div><div><strong>nexa<span>+</span></strong><small>ÁREA FINANCEIRA</small></div></div>
   <div className="auth-promo"><div className="auth-kicker">✦ &nbsp; SIMPLES. DIGITAL. SEGURO.</div><h1>Sua vida financeira,<br/><span>em um só lugar.</span></h1><p>Acesse sua área financeira e acompanhe suas informações com praticidade.</p><div className="auth-benefits"><div><span>♧</span><div><strong>Acesso protegido</strong><small>Entre usando sua conta Google.</small></div></div><div><span>↗</span><div><strong>Tudo organizado</strong><small>Uma visão clara da sua área financeira.</small></div></div></div></div>
   <div className="auth-visual-foot">© 2026 ProjetoN1 · Plataforma em desenvolvimento</div>
  </section>
  <section className="auth-form-side"><div className="auth-form-card"><div className="auth-mobile-brand"><div className="brand-mark"><span>n</span></div><strong>nexa<span>+</span></strong></div><div className="auth-form-icon"><ShieldCheck size={23}/></div><div className="auth-eyebrow">BEM-VINDO DE VOLTA</div><h2>Entre na sua conta</h2><p className="auth-intro">Use sua conta Google para continuar.</p>
   <button className="google-button" onClick={onLogin} disabled={loading || !configured}><svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.05 13.22l7.98 6.19C11.93 13.72 17.4 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.74 7.18l7.72 5.99c4.51-4.17 7.06-10.32 7.06-17.64z"/><path fill="#FBBC05" d="M10.03 28.59A14.4 14.4 0 0 1 9.25 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.53 2.57 10.78l7.46-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.81l-7.72-5.99c-2.14 1.43-4.88 2.28-8.19 2.28-6.6 0-12.07-4.22-14.06-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>{loading?'Conectando com Google…':'Continuar com Google'}</button>
   {!configured && <div className="auth-config-note">A tela está pronta, mas o login real precisa de configuração do Supabase. Adicione as variáveis de ambiente para ativar o botão.</div>}
   {error && <div className="auth-error" role="alert">{error}</div>}
   <div className="auth-separator"><span>ACESSO SEGURO</span></div><div className="auth-security">Não pedimos sua senha do Google. A autenticação acontece na página oficial do Google.</div><p className="auth-terms">Ao continuar, você concorda com os termos de uso e a política de privacidade do projeto.</p>
  </div></section>
 </main>;
}
export default function AuthApp() {
 const [session,setSession]=useState(null); const [loading,setLoading]=useState(true); const [signingIn,setSigningIn]=useState(false); const [error,setError]=useState('');
 const {supabase,configured}=authClient;
 useEffect(()=>{if(!configured||!supabase){setLoading(false);return;} supabase.auth.getSession().then(({data,error:e})=>{if(e)setError(e.message);setSession(data?.session??null);setLoading(false);}); const {data:listener}=supabase.auth.onAuthStateChange((_event,s)=>{setSession(s);setSigningIn(false);});return()=>listener.subscription.unsubscribe();},[configured,supabase]);
 const signIn=async()=>{if(!supabase){setError('Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.');return;}setSigningIn(true);setError('');const {error:e}=await supabase.auth.signInWithOAuth({provider:'google',options:{redirectTo:window.location.origin}});if(e){setError(e.message);setSigningIn(false);}};
 const signOut=async()=>{if(supabase)await supabase.auth.signOut();setSession(null);};
 if(loading)return <div className="auth-loading">Verificando sessão segura…</div>;
 return session?<Dashboard user={session.user} onSignOut={signOut}/>:<LoginPage onLogin={signIn} loading={signingIn} error={error} configured={configured}/>;
}