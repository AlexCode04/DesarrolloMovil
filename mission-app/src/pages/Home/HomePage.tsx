// src/pages/Home/HomePage.tsx
import React from 'react';
import { useHistory } from 'react-router-dom';
import { IonContent, IonPage } from '@ionic/react';
import { User } from 'firebase/auth';
import { logoutUser } from '../../services/firebase';
import { useMissions } from '../../hooks/useMissions';
import { TOTAL_POINTS } from '../../services/missions';
import MissionCard from '../../components/MissionCard';
import RankingPanel from '../../components/RankingPanel';

interface Props { user: User }

const HomePage: React.FC<Props> = ({ user }) => {
    const history = useHistory();
    const {
        missions, points, loading,
        activeGeo, distanceMoved,
        zenTimer, zenActive,
        completeMission1, startMission2, startMission3, stopMission3,
    } = useMissions(user);

    const completed = missions.filter(m => m.completed).length;
    const total = missions.length;
    const progressPct = Math.round((completed / total) * 100);
    const username = user.email?.split('@')[0] ?? 'Jugador';

    const handleLogout = async () => {
        await logoutUser();
        history.replace('/login');
    };

    if (loading) {
        return (
            <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', background: 'var(--secondary)' }}>
                <div className="text-center">
                    <div className="spinner-border" style={{ color: 'var(--primary)', width: '2.5rem', height: '2.5rem' }} role="status"></div>
                    <p style={{ color: 'var(--text-muted)', marginTop: '1rem', fontFamily: 'var(--font-display)' }}>Cargando misiones…</p>
                </div>
            </div>
        );
    }

    return (
        <IonPage>
            <IonContent fullscreen className="home-content">
                <div className="app-shell">
            <nav className="app-navbar d-flex align-items-center justify-content-between sticky-top">
                <div className="navbar-brand-custom">Mission<span>Quest</span></div>
                <div className="d-flex align-items-center gap-2">
                    <div className="points-badge">⚡ {points}</div>
                    <button
                        onClick={handleLogout}
                        style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)', borderRadius: 'var(--radius-sm)', padding: '0.35rem 0.75rem', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'var(--font-body)' }}
                    >
                        Salir
                    </button>
                </div>
            </nav>

            <div className="container py-4" style={{ maxWidth: 680 }}>
                <div className="fade-in mb-4">
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Bienvenido de vuelta
                    </p>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800 }}>
                        @{username}
                    </h1>
                </div>

                <div className="row g-3 mb-4">
                    <div className="col-4 slide-up delay-1">
                        <div className="stat-card">
                            <div className="stat-value text-primary">{points}</div>
                            <div className="stat-label">Puntos</div>
                        </div>
                    </div>
                    <div className="col-4 slide-up delay-2">
                        <div className="stat-card">
                            <div className="stat-value">{completed}/{total}</div>
                            <div className="stat-label">Misiones</div>
                        </div>
                    </div>
                    <div className="col-4 slide-up delay-3">
                        <div className="stat-card">
                            <div className="stat-value text-accent">{TOTAL_POINTS - points}</div>
                            <div className="stat-label">Restantes</div>
                        </div>
                    </div>
                </div>

                <div className="slide-up delay-2 mb-4">
                    <div className="d-flex justify-content-between mb-2">
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Progreso</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text)' }}>{progressPct}%</span>
                    </div>
                    <div className="progress-custom">
                        <div
                            className="progress-bar-custom"
                            style={{ width: `${progressPct}%`, height: '100%' }}
                        />
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                        {completed} de {total} misiones completadas
                    </div>
                </div>

                {completed === total && (
                    <div className="slide-up mb-4" style={{
                        background: 'linear-gradient(135deg, rgba(0,217,126,0.12) 0%, rgba(255,209,0,0.08) 100%)',
                        border: '1px solid rgba(0,217,126,0.3)',
                        borderRadius: 'var(--radius)',
                        padding: '1.2rem',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏆</div>
                        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--success)', margin: 0 }}>
                            ¡Misiones completadas!
                        </p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.3rem', marginBottom: '0.75rem' }}>
                            Lograste {points} puntos en total.
                        </p>
                        <button
                            className="btn-primary-custom"
                            onClick={() => history.push('/results')}
                        >
                            Ver Resultados →
                        </button>
                    </div>
                )}

                <div className="mb-2">
                    <h6 style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        Misiones activas
                    </h6>
                    <div className="d-flex flex-column gap-3">

                        <div className="slide-up delay-3">
                            <MissionCard
                                mission={missions[0]}
                                actionLabel="📸 Tomar foto"
                                onAction={completeMission1}
                            />
                        </div>

                        <div className="slide-up delay-4">
                            <MissionCard
                                mission={missions[1]}
                                actionLabel={activeGeo ? '📡 Rastreando…' : '🗺️ Iniciar GPS'}
                                actionActive={activeGeo}
                                onAction={startMission2}
                                extra={
                                    activeGeo ? (
                                        <div>
                                            <div className="d-flex justify-content-between" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '3px' }}>
                                                <span>Distancia recorrida</span>
                                                <span style={{ color: distanceMoved >= 30 ? 'var(--success)' : 'var(--text)' }}>{distanceMoved}m / 30m</span>
                                            </div>
                                            <div className="distance-track">
                                                <div className="distance-fill" style={{ width: `${Math.min((distanceMoved / 30) * 100, 100)}%` }} />
                                            </div>
                                        </div>
                                    ) : null
                                }
                            />
                        </div>

                        <div className="slide-up delay-5">
                            <MissionCard
                                mission={missions[2]}
                                actionLabel={zenActive ? '⏸ Cancelar' : '🧘 Empezar quietud'}
                                onAction={zenActive ? stopMission3 : startMission3}
                                extra={
                                    zenActive ? (
                                        <div className="text-center py-2">
                                            <div className="zen-ring active">
                                                <span className="zen-count" style={{ transform: 'none' }}>{zenTimer}</span>
                                            </div>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                                                ¡No te muevas! El teléfono vibrará al terminar.
                                            </p>
                                        </div>
                                    ) : null
                                }
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-4 slide-up delay-5">
                    <RankingPanel currentUid={user.uid} currentPoints={points} />
                </div>

                <div className="text-center mt-4 mb-2">
                    <button
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}
                        onClick={() => history.push('/results')}
                    >
                        Ver pantalla de resultados →
                    </button>
                </div>
                </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default HomePage;