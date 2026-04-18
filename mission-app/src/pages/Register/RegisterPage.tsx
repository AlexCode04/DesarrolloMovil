import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { registerUser, saveUserData } from '../../services/firebase';
import { INITIAL_MISSIONS } from '../../services/missions';

const RegisterPage: React.FC = () => {
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!email || !password || !confirm) { setError('Completa todos los campos.'); return; }
        if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres.'); return; }
        if (password !== confirm) { setError('Las contraseñas no coinciden.'); return; }
        setLoading(true);
        try {
            const cred = await registerUser(email, password);
            await saveUserData(cred.user.uid, {
                points: 0,
                missions: INITIAL_MISSIONS.map(m => ({ id: m.id, completed: false })),
                email: email,
                displayName: email.split('@')[0],
            });
            history.replace('/home');
        } catch (err: any) {
            const msg = err.code === 'auth/email-already-in-use'
                ? 'Ese correo ya está registrado.'
                : err.code === 'auth/weak-password'
                    ? 'La contraseña es muy débil.'
                    : 'Error al registrarse. Intenta de nuevo.';
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
                        Crea tu cuenta y empieza a completar misiones.
                    </p>
                </div>

                <h5 style={{ fontFamily: 'var(--font-display)', marginBottom: '1.5rem', color: 'var(--text)' }}>
                    Crear cuenta
                </h5>

                {error && (
                    <div className="mb-3 p-3" style={{ borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: 'var(--danger)', background: 'rgba(255,59,92,0.08)', border: '1px solid rgba(255,59,92,0.2)' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister}>
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
                        />
                    </div>
                    <div className="mb-3">
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Contraseña
                        </label>
                        <input
                            type="password"
                            className="form-control form-control-dark w-100"
                            placeholder="Mínimo 6 caracteres"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Confirmar contraseña
                        </label>
                        <input
                            type="password"
                            className="form-control form-control-dark w-100"
                            placeholder="Repite tu contraseña"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn-primary-custom w-100 mb-3" disabled={loading}>
                        {loading ? (
                            <span>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Creando cuenta…
                            </span>
                        ) : 'Crear cuenta →'}
                    </button>
                </form>

                <div className="text-center">
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>¿Ya tienes cuenta? </span>
                    <button
                        onClick={() => history.push('/login')}
                        style={{ border: 'none', background: 'transparent', color: 'var(--primary)', padding: 0, fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'var(--font-body)' }}
                    >
                        Inicia sesión
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;