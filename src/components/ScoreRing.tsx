"use client";

import { useState, useEffect } from "react";

interface ScoreRingProps {
    score: number;
    label: string;
}

export default function ScoreRing({ score, label }: ScoreRingProps) {
    const size = 100, sw = 5, r = (size - sw) / 2, c = 2 * Math.PI * r;
    const offset = c - (score / 100) * c;
    const [on, setOn] = useState(false);
    useEffect(() => { const t = setTimeout(() => setOn(true), 100); return () => clearTimeout(t); }, []);
    const color = score >= 70 ? "var(--color-accent-red)" : score <= 30 ? "var(--color-accent-green)" : "var(--color-accent-amber)";

    return (
        <div className="relative inline-flex items-center justify-center score-ring-overlay shrink-0">
            <svg width={size} height={size} className="score-ring" aria-hidden="true">
                <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={sw} fill="none" className="score-ring-bg" />
                <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={sw} fill="none" stroke={color}
                    strokeDasharray={c} strokeDashoffset={on ? offset : c} strokeLinecap="round" className="score-ring-fill" />
            </svg>
            <div className="absolute flex flex-col items-center">
                <span className={`text-xl font-bold ${score >= 70 ? 'score-color-high' : score <= 30 ? 'score-color-low' : 'score-color-medium'}`}>{score}</span>
                <span className="text-[8px] text-[--color-text-muted] uppercase tracking-widest">{label}</span>
            </div>
        </div>
    );
}
