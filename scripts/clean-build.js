/**
 * Clean build preparation
 * Xóa cache, kill processes cũ trên port 3000, chuẩn bị cho build sạch
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT_DIR = path.resolve(__dirname, '..');
const NEXT_DIR = path.join(PROJECT_DIR, '.next');

console.log('[clean-build] Cleaning up...');

// 1. Kill processes trên port 3000
if (process.platform === 'win32') {
    try {
        const netstat = execSync('netstat -ano | findstr ":3000 " | findstr "LISTENING"', {
            encoding: 'utf8',
            stdio: ['pipe', 'pipe', 'ignore'],
        });
        const pids = [...new Set(
            netstat.split('\n')
                .map(line => line.trim().split(/\s+/).pop())
                .filter(pid => pid && /^\d+$/.test(pid))
        )];
        for (const pid of pids) {
            console.log(`[clean-build] Killing PID ${pid} on port 3000`);
            try { execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' }); } catch { }
        }
    } catch {
        // No processes on port 3000
    }
}

// 2. Xóa .next cache
if (fs.existsSync(NEXT_DIR)) {
    console.log('[clean-build] Removing .next cache...');
    fs.rmSync(NEXT_DIR, { recursive: true, force: true });
}

// 3. Xóa tsconfig.tsbuildinfo (stale incremental data)
const tsBuildInfo = path.join(PROJECT_DIR, 'tsconfig.tsbuildinfo');
if (fs.existsSync(tsBuildInfo)) {
    console.log('[clean-build] Removing tsconfig.tsbuildinfo...');
    fs.unlinkSync(tsBuildInfo);
}

console.log('[clean-build] ✓ Clean complete');
