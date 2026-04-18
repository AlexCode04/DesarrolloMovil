// src/pages/Login/LoginPage.tsx
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { loginUser } from '../../services/firebase';

const LoginPage: React.FC = () => {
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!email || !password) { setError('Completa todos los campos.'); return; }
        setLoading(true);
        try {
            await loginUser(email, password);
            history.replace('/home');
        } catch (err: any) {
            const msg = err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password'
                ? 'Correo o contraseña incorrectos.'
                : err.code === 'auth/user-not-found'
                    ? 'No existe una cuenta con ese correo.'
                    : 'Error al iniciar sesión. Intenta de nuevo.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card fade-in">
                <div className="mb-4">
                    <div className="auth-logo mb-1">Mission<span>Quest</span></div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        Completa misiones, gana puntos, domina el ranking.
                    </p>
                </div>

                <h5 style={{ fontFamily: 'var(--font-display)', marginBottom: '1.5rem', color: 'var(--text)' }}>
                    Iniciar sesión
                </h5>

                {error && (
                    <div className="alert-dark mb-3 p-3" style={{ borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: 'var(--danger)', background: 'rgba(255,59,92,0.08)', border: '1px solid rgba(255,59,92,0.2)' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Correo
                        </label>
                        <input
                            type="email"
                            className="form-control form-control-dark w-100"
                            placeholder="tu@correo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                        />
                    </div>
                    <div className="mb-4">
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Contraseña
                        </label>
                        <input
                            type="password"
                            className="form-control form-control-dark w-100"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                        />
                    </div>

                    <button type="submit" className="btn-primary-custom w-100 mb-3" disabled={loading}>
                        {loading ? (
                            <span>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Ingresando…
                            </span>
                        ) : 'Entrar →'}
                    </button>
                </form>

                <div className="text-center">
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>¿No tienes cuenta? </span>
                    <button
                        className="btn-outline-custom ms-1"
                        onClick={() => history.push('/register')}
                        style={{ border: 'none !important', background: 'transparent !important', color: 'var(--primary) !important', padding: '0 !important', fontSize: '0.875rem !important', cursor: 'pointer', fontFamily: 'var(--font-body)' }}
                    >
                        Regístrate
                    </button>
                </div>

                {/* Demo hint */}
                <div style={{ marginTop: '2rem', padding: '0.8rem', background: 'var(--surface2)', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <strong style={{ color: 'var(--text)' }}>Demo:</strong> Crea una cuenta nueva con cualquier correo para probar la app.
                </div>
            </div>
        </div>
    );
};

export default LoginPage;