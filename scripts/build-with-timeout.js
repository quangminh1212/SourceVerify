/**
 * Build with timeout protection
 * Tự động kill build process nếu chạy quá lâu (mặc định 5 phút)
 * Usage: node scripts/build-with-timeout.js [timeout_minutes]
 */

const { spawn, execSync } = require('child_process');
const path = require('path');

const TIMEOUT_MINUTES = parseInt(process.argv[2] || '5', 10);
const TIMEOUT_MS = TIMEOUT_MINUTES * 60 * 1000;
const PROJECT_DIR = path.resolve(__dirname, '..');

console.log(`\n[build-safe] Starting Next.js build with ${TIMEOUT_MINUTES} minute timeout...`);
console.log(`[build-safe] Working directory: ${PROJECT_DIR}\n`);

// Clean .next cache trước khi build
const nextDir = path.join(PROJECT_DIR, '.next');
const fs = require('fs');
if (fs.existsSync(nextDir)) {
    console.log('[build-safe] Cleaning .next cache...');
    fs.rmSync(nextDir, { recursive: true, force: true });
}

const startTime = Date.now();
const buildProcess = spawn('npx', ['next', 'build'], {
    cwd: PROJECT_DIR,
    stdio: 'inherit',
    shell: true,
    env: {
        ...process.env,
        // Giới hạn memory cho Node để tránh OOM
        NODE_OPTIONS: '--max-old-space-size=4096',
    },
});

let killed = false;

// Timeout handler
const timer = setTimeout(() => {
    killed = true;
    console.error(`\n[build-safe] ⚠ BUILD TIMEOUT after ${TIMEOUT_MINUTES} minutes!`);
    console.error('[build-safe] Killing build process and all child processes...\n');

    try {
        // Kill process tree on Windows
        if (process.platform === 'win32') {
            execSync(`taskkill /T /F /PID ${buildProcess.pid}`, { stdio: 'ignore' });
        } else {
            buildProcess.kill('SIGKILL');
        }
    } catch {
        // Process may have already exited
    }

    process.exit(1);
}, TIMEOUT_MS);

// Progress indicator
const progressInterval = setInterval(() => {
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    const remaining = Math.round((TIMEOUT_MS - (Date.now() - startTime)) / 1000);
    process.stdout.write(`\r[build-safe] Elapsed: ${elapsed}s | Timeout in: ${remaining}s `);
}, 5000);

buildProcess.on('exit', (code) => {
    clearTimeout(timer);
    clearInterval(progressInterval);

    const elapsed = Math.round((Date.now() - startTime) / 1000);

    if (!killed) {
        if (code === 0) {
            console.log(`\n\n[build-safe] ✓ Build completed successfully in ${elapsed}s`);
        } else {
            console.error(`\n\n[build-safe] ✗ Build failed with exit code ${code} after ${elapsed}s`);
        }
        process.exit(code || 0);
    }
});

buildProcess.on('error', (err) => {
    clearTimeout(timer);
    clearInterval(progressInterval);
    console.error(`\n[build-safe] Build process error:`, err.message);
    process.exit(1);
});
