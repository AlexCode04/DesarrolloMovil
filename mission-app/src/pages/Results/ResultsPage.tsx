import React from 'react';
import { useHistory } from 'react-router-dom';
import { IonContent, IonPage } from '@ionic/react';
import { User } from 'firebase/auth';
import { useMissions } from '../../hooks/useMissions';
import { TOTAL_POINTS } from '../../services/missions';

interface Props { user: User }

const ResultsPage: React.FC<Props> = ({ user }) => {
    const history = useHistory();
    const { missions, points } = useMissions(user);
    const completed = missions.filter(m => m.completed).length;
    const total = missions.length;
    const allDone = completed === total;

    const pct = Math.round((completed / total) * 100);

    const getStatus = () => {
        if (allDone) return { emoji: '🏆', label: 'Héroe Completado', color: 'var(--success)' };
        if (completed >= 2) return { emoji: '⚡', label: 'Casi Ahí', color: 'var(--warning)' };
        if (completed === 1) return { emoji: '🔥', label: 'Comenzando', color: 'var(--primary)' };
        return { emoji: '💤', label: 'Sin Misiones', color: 'var(--text-muted)' };
    };

    const status = getStatus();

    return (
        <IonPage>
            <IonContent fullscreen className="home-content">
                <div className="app-shell" style={{ minHeight: '100vh' }}>
            <nav className="app-navbar d-flex align-items-center justify-content-between sticky-top">
                <button
                    onClick={() => history.push('/home')}
                    style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)', borderRadius: 'var(--radius-sm)', padding: '0.35rem 0.75rem', fontSize: '0.8rem', cursor: 'pointer' }}
                >
                    ← Volver
                </button>
                <div className="navbar-brand-custom">Mission<span>Quest</span></div>
                <div style={{ width: 60 }} />
            </nav>

            <div className="container py-4" style={{ maxWidth: 560 }}>
                <div className="results-hero fade-in">
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{status.emoji}</div>
                    <div className="results-score">{points}</div>
                    <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-display)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '0.5rem' }}>
                        puntos totales
                    </p>
                    <div style={{
                        display: 'inline-block',
                        background: `rgba(${status.color === 'var(--success)' ? '0,217,126' : '255,77,0'},0.12)`,
                        border: `1px solid ${status.color}33`,
                        borderRadius: '50px',
                        padding: '0.4rem 1.2rem',
                        marginTop: '1rem',
                        fontFamily: 'var(--font-display)',
                        fontWeight: 700,
                        color: status.color,
                        fontSize: '0.9rem',
                    }}>
                        {status.label}
                    </div>
                </div>

                <div className="row g-3 my-4">
                    <div className="col-6 slide-up delay-1">
                        <div className="stat-card">
                            <div className="stat-value" style={{ color: 'var(--success)' }}>{completed}</div>
                            <div className="stat-label">Completadas</div>
                        </div>
                    </div>
                    <div className="col-6 slide-up delay-2">
                        <div className="stat-card">
                            <div className="stat-value">{total - completed}</div>
                            <div className="stat-label">Pendientes</div>
                        </div>
                    </div>
                </div>

                <div className="slide-up delay-2 mb-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem' }}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>Progreso Total</span>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>{pct}%</span>
                    </div>
                    <div className="progress-custom">
                        <div className="progress-bar-custom" style={{ width: `${pct}%`, height: '100%' }} />
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
                        {completed} de {total} misiones · {TOTAL_POINTS - points} puntos disponibles
                    </div>
                </div>

                <div className="slide-up delay-3 mb-4">
                    <h6 style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                        Detalle de misiones
                    </h6>
                    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                        {missions.map((m, i) => (
                            <div
                                key={m.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.9rem 1rem',
                                    borderBottom: i < missions.length - 1 ? '1px solid var(--border)' : 'none',
                                    background: m.completed ? 'rgba(0,217,126,0.04)' : 'transparent',
                                }}
                            >
                                <span style={{ fontSize: '1.2rem' }}>{m.icon}</span>
                                <span style={{ flex: 1, fontSize: '0.9rem', fontWeight: 500 }}>{m.title}</span>
                                {m.completed ? (
                                    <span style={{ color: 'var(--success)', fontSize: '0.8rem', fontWeight: 700 }}>+{m.points} pts ✓</span>
                                ) : (
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{m.points} pts</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="slide-up delay-4 text-center">
                    <button className="btn-primary-custom" onClick={() => history.push('/home')}>
                        Volver al inicio →
                    </button>
                </div>
            </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default ResultsPage;