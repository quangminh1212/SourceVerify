/**
 * SourceVerify Benchmark Dashboard
 * Downloads images + runs benchmark + live web UI on port 3456
 */
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

const BENCHMARK_DIR = path.join(__dirname, '..', 'public', 'benchmark');
const AI_TARGET = 5000, REAL_TARGET = 5000;
const MAX_PROCESS_DIMENSION = 1024;
const PORT = 3456;

// ===== State =====
const state = {
  phase: 'init', // init, downloading, benchmarking, done
  download: { aiDone: 0, aiTotal: 0, realDone: 0, realTotal: 0, failed: 0 },
  benchmark: { current: 0, total: 0, currentFile: '', currentDir: '', phase: '' },
  results: { tp: 0, fn: 0, fp: 0, tn: 0, aiUnc: 0, realUnc: 0 },
  errors: [],
  startTime: Date.now(),
  log: []
};

function addLog(msg) { state.log.push(`[${new Date().toLocaleTimeString()}] ${msg}`); if (state.log.length > 100) state.log.shift(); console.log(msg); }

// ===== Dashboard HTML =====
function dashboardHTML() {
  const s = state, d = s.download, b = s.benchmark, r = s.results;
  const elapsed = ((Date.now() - s.startTime) / 1000).toFixed(0);
  const strictTotal = r.tp + r.fn + r.fp + r.tn;
  const strictAcc = strictTotal > 0 ? ((r.tp + r.tn) / strictTotal * 100).toFixed(1) : '0.0';
  const precision = (r.tp + r.fp) > 0 ? (r.tp / (r.tp + r.fp) * 100).toFixed(1) : '0.0';
  const recall = (r.tp + r.fn) > 0 ? (r.tp / (r.tp + r.fn) * 100).toFixed(1) : '0.0';
  const pct = b.total > 0 ? (b.current / b.total * 100).toFixed(1) : '0';
  const dpct = (d.aiTotal + d.realTotal) > 0 ? ((d.aiDone + d.realDone) / (d.aiTotal + d.realTotal) * 100).toFixed(1) : '0';

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>SourceVerify Benchmark</title>
<meta http-equiv="refresh" content="3">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0d1117;color:#c9d1d9;font-family:'Segoe UI',sans-serif;padding:20px}
h1{color:#58a6ff;margin-bottom:15px;font-size:24px}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-bottom:15px}
.card{background:#161b22;border:1px solid #30363d;border-radius:8px;padding:15px}
.card h2{color:#8b949e;font-size:13px;text-transform:uppercase;margin-bottom:8px}
.big{font-size:36px;font-weight:700;color:#58a6ff}
.green{color:#3fb950}.red{color:#f85149}.yellow{color:#d29922}.purple{color:#bc8cff}
.bar{background:#21262d;border-radius:4px;height:20px;margin:8px 0;overflow:hidden}
.fill{height:100%;border-radius:4px;transition:width .5s}
.fill-blue{background:linear-gradient(90deg,#1f6feb,#58a6ff)}
.fill-green{background:linear-gradient(90deg,#238636,#3fb950)}
.fill-red{background:linear-gradient(90deg,#da3633,#f85149)}
.status{display:inline-block;padding:3px 10px;border-radius:12px;font-size:12px;font-weight:600}
.status-run{background:#1f6feb33;color:#58a6ff}.status-done{background:#23863633;color:#3fb950}
.status-dl{background:#d2992233;color:#d29922}
table{width:100%;border-collapse:collapse;margin-top:8px}
td{padding:4px 8px;border-bottom:1px solid #21262d;font-size:13px}
td:first-child{color:#8b949e}td:last-child{text-align:right;font-weight:600}
.log{background:#0d1117;border:1px solid #30363d;border-radius:6px;padding:10px;max-height:200px;overflow-y:auto;font-family:monospace;font-size:11px;line-height:1.6}
.current{background:#1f6feb22;border:1px solid #1f6feb;border-radius:6px;padding:10px;margin-top:10px;font-size:13px}
.err{color:#f85149;font-size:12px}
</style></head><body>
<h1>🔬 SourceVerify Benchmark Dashboard</h1>
<p style="margin-bottom:15px">
  <span class="status ${s.phase === 'done' ? 'status-done' : s.phase === 'downloading' ? 'status-dl' : 'status-run'}">
    ${s.phase === 'init' ? '⏳ Initializing' : s.phase === 'downloading' ? '📥 Downloading' : s.phase === 'benchmarking' ? '🔬 Benchmarking' : '✅ Complete'}
  </span>
  &nbsp; ⏱ ${elapsed}s elapsed
</p>

${s.phase === 'downloading' ? `
<div class="card">
  <h2>📥 Download Progress</h2>
  <div class="grid">
    <div><span style="color:#8b949e">AI Images:</span> <b>${d.aiDone}/${d.aiTotal}</b></div>
    <div><span style="color:#8b949e">Real Images:</span> <b>${d.realDone}/${d.realTotal}</b></div>
  </div>
  <div class="bar"><div class="fill fill-blue" style="width:${dpct}%"></div></div>
  <div style="text-align:center;font-size:13px">${dpct}% — Failed: <span class="red">${d.failed}</span></div>
</div>` : ''}

${s.phase === 'benchmarking' || s.phase === 'done' ? `
<div class="grid">
  <div class="card">
    <h2>📊 Overall</h2>
    <div class="big ${parseFloat(strictAcc) >= 95 ? 'green' : parseFloat(strictAcc) >= 90 ? 'yellow' : 'red'}">${strictAcc}%</div>
    <div style="font-size:12px;color:#8b949e">Strict Accuracy (${r.tp + r.tn}/${strictTotal})</div>
    <div class="bar"><div class="fill ${parseFloat(strictAcc) >= 95 ? 'fill-green' : 'fill-red'}" style="width:${strictAcc}%"></div></div>
    <table>
      <tr><td>Precision</td><td>${precision}%</td></tr>
      <tr><td>Recall</td><td>${recall}%</td></tr>
      <tr><td>Target</td><td class="${parseFloat(strictAcc) >= 95 ? 'green' : 'red'}">≥ 95%</td></tr>
    </table>
  </div>
  <div class="card">
    <h2>📈 Progress</h2>
    <div class="big purple">${b.current}/${b.total}</div>
    <div class="bar"><div class="fill fill-blue" style="width:${pct}%"></div></div>
    <div style="font-size:12px;color:#8b949e">${pct}% — Phase: ${b.phase}</div>
  </div>
</div>
<div class="grid">
  <div class="card">
    <h2>🤖 AI Detection</h2>
    <table>
      <tr><td>TP (AI→AI)</td><td class="green">${r.tp}</td></tr>
      <tr><td>FN (AI→Real)</td><td class="red">${r.fn}</td></tr>
      <tr><td>Uncertain</td><td class="yellow">${r.aiUnc}</td></tr>
    </table>
  </div>
  <div class="card">
    <h2>📸 Real Detection</h2>
    <table>
      <tr><td>TN (Real→Real)</td><td class="green">${r.tn}</td></tr>
      <tr><td>FP (Real→AI)</td><td class="red">${r.fp}</td></tr>
      <tr><td>Uncertain</td><td class="yellow">${r.realUnc}</td></tr>
    </table>
  </div>
</div>` : ''}

${b.currentFile ? `<div class="current">🖼 Processing: <b>${b.currentFile}</b><br>📁 Dir: <code>${b.currentDir}</code></div>` : ''}

${state.errors.length > 0 ? `<div class="card" style="margin-top:15px"><h2>❌ Misclassified (${state.errors.length})</h2>
<div style="max-height:150px;overflow-y:auto">${state.errors.slice(-20).map(e => `<div class="err">${e.file}: truth=${e.truth}, got=${e.verdict}, score=${e.score}</div>`).join('')}</div></div>` : ''}

<div class="card" style="margin-top:15px"><h2>📋 Log</h2><div class="log">${state.log.slice(-30).map(l => `<div>${l}</div>`).join('')}</div></div>
</body></html>`;
}

// ===== HTTP Server =====
const server = http.createServer((req, res) => {
  if (req.url === '/api') { res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(state)); return; }
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(dashboardHTML());
});
function startServer() {
  return new Promise(resolve => {
    server.listen(PORT, () => { addLog(`Dashboard: http://localhost:${PORT}`); resolve(); });
  });
}

// ===== Signal Functions (same as node_benchmark.js) =====
const AI_SIGS = ["midjourney", "dall-e", "dalle", "stable diffusion", "comfyui", "automatic1111", "a1111", "novelai", "civitai", "invoke ai", "adobe firefly", "firefly", "bing image creator", "leonardo ai", "playground ai", "deep dream", "artbreeder", "nightcafe", "craiyon", "dreamstudio", "flux", "sora", "runway", "pika", "kling", "hailuo", "luma dream", "minimax", "genmo", "ideogram", "recraft", "grok", "gemini", "imagen", "copilot designer", "meta ai", "stability ai", "sdxl", "sd3"];
const CAM_SIGS = ["canon", "nikon", "sony", "fujifilm", "olympus", "panasonic", "leica", "hasselblad", "pentax", "samsung", "apple", "google pixel", "huawei", "xiaomi", "oppo", "oneplus", "vivo", "realme", "motorola", "nokia", "dji", "gopro", "ricoh", "sigma", "phase one"];

// Import all signal functions from node_benchmark.js
const benchmarkPath = path.join(__dirname, 'node_benchmark.js');
const benchmarkCode = fs.readFileSync(benchmarkPath, 'utf8');
// Extract functions by eval-ing the benchmark file in a controlled way
// Instead, we'll require the functions by wrapping
const vm = require('vm');
const sandbox = { require, module: { exports: {} }, exports: {}, console, process, Math, Float64Array, Array, String, parseInt, Buffer, setTimeout, Promise, Date, URL, RegExp, Set, Error };
const wrappedCode = benchmarkCode.replace('runBenchmark().catch(console.error);', '// skip auto-run') + '\nmodule.exports = { analyzeImageFile, calculateVerdict };';
try {
  vm.runInNewContext(wrappedCode, sandbox);
} catch (e) { console.error('VM Error:', e.message); }
const { analyzeImageFile, calculateVerdict: calcVerdict } = sandbox.module.exports;

// ===== Download Logic =====
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    const req = proto.get(url, { headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'image/*,*/*' }, timeout: 30000 }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redir = res.headers.location;
        if (redir.startsWith('/')) { const u = new URL(url); redir = `${u.protocol}//${u.hostname}${redir}`; }
        downloadFile(redir, dest).then(resolve).catch(reject); return;
      }
      if (res.statusCode !== 200) { reject(new Error(`HTTP ${res.statusCode}`)); return; }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => { const buf = Buffer.concat(chunks); if (buf.length < 5000) { reject(new Error('too small')); return; } fs.writeFileSync(dest, buf); resolve(); });
      res.on('error', reject);
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
  });
}

async function downloadImages() {
  state.phase = 'downloading';
  if (!fs.existsSync(BENCHMARK_DIR)) fs.mkdirSync(BENCHMARK_DIR, { recursive: true });

  const existing = (prefix) => { const s = new Set(); for (const f of fs.readdirSync(BENCHMARK_DIR)) { const m = f.match(new RegExp(`^${prefix}(\\d+)\\.jpg$`)); if (m) s.add(parseInt(m[1])); } return s; };
  const existAI = existing('ai_face_'), existReal = existing('real_photo_');
  addLog(`Existing: ${existAI.size} AI, ${existReal.size} real`);

  const aiItems = [], realItems = [];
  for (let i = 1; i <= AI_TARGET; i++) { if (!existAI.has(i)) aiItems.push({ idx: i, url: `https://thispersondoesnotexist.com/?${Date.now()}_${i}`, dest: path.join(BENCHMARK_DIR, `ai_face_${String(i).padStart(4, '0')}.jpg`) }); }
  for (let i = 1; i <= REAL_TARGET; i++) { if (!existReal.has(i)) { const w = 800 + (i % 5) * 100, h = 600 + (i % 4) * 100; realItems.push({ idx: i, url: `https://picsum.photos/${w}/${h}?random=${i}&t=${Date.now()}`, dest: path.join(BENCHMARK_DIR, `real_photo_${String(i).padStart(4, '0')}.jpg`) }); } }

  state.download.aiTotal = aiItems.length;
  state.download.realTotal = realItems.length;
  addLog(`Need to download: ${aiItems.length} AI, ${realItems.length} real`);

  if (aiItems.length === 0 && realItems.length === 0) { addLog('All images already downloaded!'); return; }

  const batch = async (items, type) => {
    const CONC = 10;
    for (let i = 0; i < items.length; i += CONC) {
      const chunk = items.slice(i, i + CONC);
      await Promise.all(chunk.map(async item => {
        for (let retry = 0; retry < 4; retry++) {
          try { await downloadFile(item.url, item.dest); if (type === 'ai') state.download.aiDone++; else state.download.realDone++; return; } catch (e) { await new Promise(r => setTimeout(r, 1000 * (retry + 1))); }
        }
        state.download.failed++;
      }));
      await new Promise(r => setTimeout(r, 200));
    }
  };

  if (aiItems.length > 0) { addLog(`Downloading ${aiItems.length} AI images...`); await batch(aiItems, 'ai'); }
  if (realItems.length > 0) { addLog(`Downloading ${realItems.length} real images...`); await batch(realItems, 'real'); }
  addLog(`Download done! Failed: ${state.download.failed}`);
}

// ===== Benchmark Logic =====
async function runBenchmark() {
  state.phase = 'benchmarking';
  const files = fs.readdirSync(BENCHMARK_DIR);
  const aiFiles = files.filter(f => f.startsWith('ai_face_') && f.endsWith('.jpg')).sort();
  const realFiles = files.filter(f => f.startsWith('real_photo_') && f.endsWith('.jpg')).sort();

  state.benchmark.total = aiFiles.length + realFiles.length;
  addLog(`Benchmark: ${aiFiles.length} AI + ${realFiles.length} real = ${state.benchmark.total}`);

  // Phase 1: AI
  state.benchmark.phase = 'AI Images';
  addLog('Phase 1: Testing AI images...');
  for (let i = 0; i < aiFiles.length; i++) {
    state.benchmark.current = i + 1;
    state.benchmark.currentFile = aiFiles[i];
    state.benchmark.currentDir = BENCHMARK_DIR;
    try {
      const result = await analyzeImageFile(path.join(BENCHMARK_DIR, aiFiles[i]));
      if (result.verdict === 'ai') state.results.tp++;
      else if (result.verdict === 'real') { state.results.fn++; state.errors.push({ file: aiFiles[i], truth: 'ai', verdict: result.verdict, score: result.aiScore }); }
      else state.results.aiUnc++;
    } catch (e) { addLog(`Error: ${aiFiles[i]}: ${e.message}`); }
    if ((i + 1) % 50 === 0) addLog(`AI: ${i + 1}/${aiFiles.length} TP=${state.results.tp} FN=${state.results.fn}`);
  }

  // Phase 2: Real
  state.benchmark.phase = 'Real Images';
  addLog('Phase 2: Testing Real images...');
  for (let i = 0; i < realFiles.length; i++) {
    state.benchmark.current = aiFiles.length + i + 1;
    state.benchmark.currentFile = realFiles[i];
    try {
      const result = await analyzeImageFile(path.join(BENCHMARK_DIR, realFiles[i]));
      if (result.verdict === 'real') state.results.tn++;
      else if (result.verdict === 'ai') { state.results.fp++; state.errors.push({ file: realFiles[i], truth: 'real', verdict: result.verdict, score: result.aiScore }); }
      else state.results.realUnc++;
    } catch (e) { addLog(`Error: ${realFiles[i]}: ${e.message}`); }
    if ((i + 1) % 50 === 0) addLog(`Real: ${i + 1}/${realFiles.length} TN=${state.results.tn} FP=${state.results.fp}`);
  }

  state.phase = 'done';
  state.benchmark.currentFile = '';
  const r = state.results, st = r.tp + r.fn + r.fp + r.tn;
  const acc = st > 0 ? ((r.tp + r.tn) / st * 100).toFixed(1) : '0';
  addLog(`DONE! Strict Accuracy: ${acc}% (${r.tp + r.tn}/${st})`);

  // Save results
  const resultFile = path.join(__dirname, '..', 'benchmark_results.json');
  fs.writeFileSync(resultFile, JSON.stringify({ timestamp: new Date().toISOString(), ...state.results, strictAccuracy: (r.tp + r.tn) / (st || 1), errors: state.errors, totalImages: st }, null, 2));
  addLog(`Results saved: ${resultFile}`);
}

// ===== Main =====
(async () => {
  try {
    await startServer();
    await downloadImages();
    await runBenchmark();
  } catch (e) { addLog(`FATAL: ${e.message}`); console.error(e); }
})();
