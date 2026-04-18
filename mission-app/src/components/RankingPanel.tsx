import React, { useState, useEffect } from 'react';
import { getTopUsers } from '../services/firebase';

interface Props {
    currentUid: string;
    currentPoints: number;
}

interface RankEntry {
    name: string;
    points: number;
    uid: string;
    isMe?: boolean;
}

const FAKE_PLAYERS: RankEntry[] = [
    { uid: 'fake1', name: 'NightHawk99', points: 280 },
    { uid: 'fake2', name: 'TurboGamer', points: 230 },
    { uid: 'fake3', name: 'CodigoX', points: 180 },
    { uid: 'fake4', name: 'ElFenomeno', points: 130 },
];

const RankingPanel: React.FC<Props> = ({ currentUid, currentPoints }) => {
    const [entries, setEntries] = useState<RankEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const buildRanking = async () => {
            const real = await getTopUsers();
            const meEntry: RankEntry = {
                uid: currentUid,
                name: '⭐ Tú',
                points: currentPoints,
                isMe: true,
            };

            const others = real.filter(r => r.uid !== currentUid);
            const base: RankEntry[] = [...FAKE_PLAYERS, ...others].filter(e => e.uid !== currentUid);

            const allEntries = [...base, meEntry].sort((a, b) => b.points - a.points);

            const top5 = allEntries.slice(0, 5);
            const meInTop = top5.some(e => e.isMe);
            if (!meInTop) {
                top5.pop();
                top5.push(meEntry);
                top5.sort((a, b) => b.points - a.points);
            }

            setEntries(top5);
            setLoading(false);
        };
        buildRanking();
    }, [currentUid, currentPoints]);

    const medalClass = (i: number) => {
        if (i === 0) return 'gold';
        if (i === 1) return 'silver';
        if (i === 2) return 'bronze';
        return '';
    };

    const medalEmoji = (i: number) => {
        if (i === 0) return '🥇';
        if (i === 1) return '🥈';
        if (i === 2) return '🥉';
        return `#${i + 1}`;
    };

    return (
        <div>
            <h6 style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                🏆 Ranking Global
            </h6>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                {loading ? (
                    <div className="p-3 text-center">
                        <div className="spinner-border spinner-border-sm" style={{ color: 'var(--primary)' }} role="status"></div>
                    </div>
                ) : (
                    entries.map((entry, i) => (
                        <div
                            key={entry.uid + i}
                            className={`rank-row ${entry.isMe ? 'is-me' : ''}`}
                            style={{ borderBottom: i < entries.length - 1 ? '1px solid var(--border)' : 'none' }}
                        >
                            <div className={`rank-num ${medalClass(i)}`}>{medalEmoji(i)}</div>
                            <div className="rank-avatar">
                                {entry.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="rank-name" style={{ color: entry.isMe ? 'var(--primary)' : 'var(--text)', fontWeight: entry.isMe ? 700 : 500 }}>
                                {entry.name}
                                {entry.isMe && <span style={{ fontSize: '0.7rem', marginLeft: '0.4rem', color: 'var(--text-muted)' }}>(tú)</span>}
                            </div>
                            <div className="rank-points">{entry.points}</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RankingPanel;