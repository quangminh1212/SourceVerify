"use client";

import { useState, useEffect } from "react";
import type { AnalysisSignal } from "@/lib/types";

interface RadarChartProps {
    signals: AnalysisSignal[];
    t: (key: string) => string;
}

export default function RadarChart({ signals, t }: RadarChartProps) {
    const [on, setOn] = useState(false);
    useEffect(() => { const timer = setTimeout(() => setOn(true), 300); return () => clearTimeout(timer); }, []);

    const size = 240, cx = size / 2, cy = size / 2, maxR = 85;
    const n = signals.length;
    const levels = [25, 50, 75, 100];

    const angleFor = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
    const pointAt = (i: number, val: number) => {
        const a = angleFor(i), r = (val / 100) * maxR;
        return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
    };

    const gridPolygons = levels.map(lv =>
        Array.from({ length: n }, (_, i) => pointAt(i, lv)).map(p => `${p.x},${p.y}`).join(" ")
    );

    const dataPoints = signals.map((s, i) => pointAt(i, on ? s.score : 0));
    const dataPolygon = dataPoints.map(p => `${p.x},${p.y}`).join(" ");

    const labelR = maxR + 20;

    return (
        <div className="radar-section">
            <div className="radar-container">
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="radar-svg">
                    {/* Grid levels */}
                    {gridPolygons.map((pts, i) => (
                        <polygon key={i} points={pts} fill="none" stroke="var(--color-border-subtle)" strokeWidth="0.7" opacity={0.5 + i * 0.1} />
                    ))}
                    {/* Axis lines */}
                    {signals.map((_, i) => {
                        const end = pointAt(i, 100);
                        return <line key={i} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="var(--color-border-subtle)" strokeWidth="0.5" opacity="0.4" />;
                    })}
                    {/* Data fill */}
                    <polygon points={dataPolygon} className="radar-fill" />
                    {/* Data stroke */}
                    <polygon points={dataPolygon} fill="none" className="radar-stroke" />
                    {/* Data dots */}
                    {dataPoints.map((p, i) => {
                        const score = signals[i].score;
                        const color = score >= 70 ? "var(--color-accent-red)" : score <= 40 ? "var(--color-accent-green)" : "var(--color-accent-amber)";
                        return <circle key={i} cx={p.x} cy={p.y} r={3} fill={color} className="radar-dot" />;
                    })}
                    {/* Labels */}
                    {signals.map((s, i) => {
                        const a = angleFor(i);
                        const lx = cx + labelR * Math.cos(a), ly = cy + labelR * Math.sin(a);
                        const anchor = Math.abs(Math.cos(a)) < 0.1 ? "middle" : Math.cos(a) > 0 ? "start" : "end";
                        const score = s.score;
                        const color = score >= 70 ? "var(--color-accent-red)" : score <= 40 ? "var(--color-accent-green)" : "var(--color-accent-amber)";
                        return (
                            <text key={i} x={lx} y={ly} textAnchor={anchor} dominantBaseline="central" className="radar-label">
                                {t(s.nameKey) || s.name} <tspan fill={color} fontWeight="700">{s.score}</tspan>
                            </text>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
}
