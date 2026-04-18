import React from 'react';
import { Mission } from '../services/missions';

interface Props {
    mission: Mission;
    onAction: () => void;
    actionLabel: string;
    actionLoading?: boolean;
    actionActive?: boolean;
    extra?: React.ReactNode;
}

const MissionCard: React.FC<Props> = ({
    mission,
    onAction,
    actionLabel,
    actionLoading,
    actionActive,
    extra,
}) => {
    const statusClass = mission.completed ? 'status-completed' : mission.locked ? 'status-locked' : 'status-pending';
    const statusLabel = mission.completed ? '✓ Completada' : mission.locked ? '🔒 Bloqueada' : '● Pendiente';

    return (
        <div className={`mission-card ${mission.completed ? 'completed' : ''} ${mission.locked ? 'locked' : ''}`}>
            <div className="d-flex align-items-start gap-3">
                <div className="mission-icon">{mission.icon}</div>
                <div className="flex-1" style={{ flex: 1 }}>
                    <div className="d-flex align-items-center justify-content-between mb-1">
                        <p className="mission-title">{mission.title}</p>
                        <span className={`status-badge ${statusClass}`}>{statusLabel}</span>
                    </div>
                    <p className="mission-desc mb-2">{mission.description}</p>

                    {extra && <div className="mb-2">{extra}</div>}

                    <div className="d-flex align-items-center justify-content-between">
                        <span className="mission-points">+{mission.points} pts</span>
                        {!mission.completed && !mission.locked && (
                            <button
                                className={`btn-mission ${actionActive ? 'active-geo' : ''}`}
                                onClick={onAction}
                                disabled={actionLoading}
                            >
                                {actionLoading ? (
                                    <span>
                                        <span className="spinner-border spinner-border-sm me-1" style={{ width: '0.75rem', height: '0.75rem' }} role="status" aria-hidden="true"></span>
                                        Cargando…
                                    </span>
                                ) : actionLabel}
                            </button>
                        )}
                        {mission.completed && (
                            <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 600 }}>
                                ✓ Completada
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MissionCard;