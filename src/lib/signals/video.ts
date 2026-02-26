/**
 * Video-specific signal analysis
 * Duration, resolution, and format heuristics
 */

import type { AnalysisSignal } from "../types";
import { AI_VIDEO_RESOLUTIONS } from "../constants";

export function analyzeVideoSpecific(file: File, video: HTMLVideoElement): AnalysisSignal {
    const duration = video.duration;
    const { videoWidth: w, videoHeight: h } = video;

    let score = 50;
    let description = "Video analysis";
    let details = `Duration: ${duration.toFixed(1)}s, Resolution: ${w}×${h}`;

    if (duration <= 5) { score += 15; description = "Very short video — common in AI generation"; }
    else if (duration <= 15) score += 5;
    else if (duration > 60) { score -= 15; description = "Long video — less likely fully AI-generated"; }

    for (const [aw, ah] of AI_VIDEO_RESOLUTIONS) {
        if (w === aw && h === ah) { score += 10; details += ". AI-typical resolution"; }
    }

    score = Math.max(0, Math.min(100, score));

    return {
        name: "Video Properties", nameKey: "signal.videoProperties",
        category: "video", score, weight: 1.5,
        description, descriptionKey: duration <= 5 ? "signal.video.short" : duration > 60 ? "signal.video.long" : "signal.video.analysis",
        icon: "▶", details,
    };
}
