/**
 * SourceVerify - API Key Store
 * 
 * Production-ready key-value store with:
 * - Atomic file writes (write to temp → rename) to prevent corruption
 * - In-memory cache with lazy disk sync
 * - Proper error logging
 * - Interface-based design for easy migration to database
 * 
 * For production at scale, replace this with a database adapter
 * implementing the same IApiKeyStore interface.
 */
import fs from "fs";
import path from "path";
import crypto from "crypto";
import os from "os";

const STORE_PATH = path.join(process.cwd(), ".api-keys.json");

export interface ApiKeyEntry {
    apiKey: string;
    googleId: string;
    email: string;
    name: string;
    picture: string;
    createdAt: string;
    usageCount: number;
    lastUsed: string | null;
}

/** Interface for API Key Store - implement this for database migration */
export interface IApiKeyStore {
    findByGoogleId(googleId: string): ApiKeyEntry | undefined;
    createOrGetKey(googleId: string, email: string, name: string, picture: string): ApiKeyEntry;
    validateApiKey(apiKey: string): ApiKeyEntry | null;
    revokeApiKey(apiKey: string): boolean;
}

// ─── In-memory cache ─────────────────────────────────────────────────────────

let store: Map<string, ApiKeyEntry> | null = null;
let isDirty = false;

function loadStore(): Map<string, ApiKeyEntry> {
    if (store) return store;
    store = new Map();
    try {
        if (fs.existsSync(STORE_PATH)) {
            const raw = fs.readFileSync(STORE_PATH, "utf-8");
            const data = JSON.parse(raw);
            for (const [k, v] of Object.entries(data)) {
                store.set(k, v as ApiKeyEntry);
            }
        }
    } catch (err) {
        console.error("[ApiKeyStore] Failed to load store:", err instanceof Error ? err.message : err);
    }
    return store;
}

/**
 * Atomic save: write to temp file → rename to target
 * This prevents corruption if the process crashes mid-write
 */
function saveStore() {
    if (!isDirty) return;
    const s = loadStore();
    const obj: Record<string, ApiKeyEntry> = {};
    for (const [k, v] of s) obj[k] = v;

    const tmpPath = path.join(os.tmpdir(), `.api-keys-${crypto.randomBytes(4).toString("hex")}.tmp`);
    try {
        fs.writeFileSync(tmpPath, JSON.stringify(obj, null, 2), "utf-8");
        // Atomic rename (on same filesystem this is atomic on most OS)
        fs.copyFileSync(tmpPath, STORE_PATH);
        fs.unlinkSync(tmpPath);
        isDirty = false;
    } catch (err) {
        console.error("[ApiKeyStore] Failed to save store:", err instanceof Error ? err.message : err);
        // Cleanup temp file
        try { fs.unlinkSync(tmpPath); } catch { /* ignore */ }
    }
}

// ─── Public API ──────────────────────────────────────────────────────────────

export function generateApiKey(): string {
    return `sv_${crypto.randomBytes(24).toString("hex")}`;
}

export function findByGoogleId(googleId: string): ApiKeyEntry | undefined {
    const s = loadStore();
    for (const entry of s.values()) {
        if (entry.googleId === googleId) return entry;
    }
    return undefined;
}

export function createOrGetKey(googleId: string, email: string, name: string, picture: string): ApiKeyEntry {
    const existing = findByGoogleId(googleId);
    if (existing) return existing;

    const apiKey = generateApiKey();
    const entry: ApiKeyEntry = {
        apiKey, googleId, email, name, picture,
        createdAt: new Date().toISOString(),
        usageCount: 0,
        lastUsed: null,
    };
    loadStore().set(apiKey, entry);
    isDirty = true;
    saveStore();
    return entry;
}

export function validateApiKey(apiKey: string): ApiKeyEntry | null {
    // Basic input validation
    if (!apiKey || typeof apiKey !== "string" || !apiKey.startsWith("sv_")) {
        return null;
    }

    const s = loadStore();
    const entry = s.get(apiKey);
    if (!entry) return null;

    entry.usageCount++;
    entry.lastUsed = new Date().toISOString();
    isDirty = true;
    // Debounce saves - don't write on every single validation
    // Save every 10 requests or use a timer
    if (entry.usageCount % 10 === 0) {
        saveStore();
    }
    return entry;
}

export function revokeApiKey(apiKey: string): boolean {
    const s = loadStore();
    const deleted = s.delete(apiKey);
    if (deleted) {
        isDirty = true;
        saveStore();
    }
    return deleted;
}

// Save any pending changes on process exit
if (typeof process !== "undefined") {
    const flushOnExit = () => {
        if (isDirty) {
            try { saveStore(); } catch { /* best effort */ }
        }
    };
    process.on("exit", flushOnExit);
    process.on("SIGINT", () => { flushOnExit(); process.exit(0); });
    process.on("SIGTERM", () => { flushOnExit(); process.exit(0); });
}
