/**
 * Simple API Key Store
 * Uses in-memory Map + JSON file persistence
 */
import fs from "fs";
import path from "path";
import crypto from "crypto";

const STORE_PATH = path.join(process.cwd(), ".api-keys.json");

interface ApiKeyEntry {
    apiKey: string;
    googleId: string;
    email: string;
    name: string;
    picture: string;
    createdAt: string;
    usageCount: number;
    lastUsed: string | null;
}

let store: Map<string, ApiKeyEntry> | null = null;

function loadStore(): Map<string, ApiKeyEntry> {
    if (store) return store;
    store = new Map();
    try {
        if (fs.existsSync(STORE_PATH)) {
            const data = JSON.parse(fs.readFileSync(STORE_PATH, "utf-8"));
            for (const [k, v] of Object.entries(data)) {
                store.set(k, v as ApiKeyEntry);
            }
        }
    } catch { /* ignore */ }
    return store;
}

function saveStore() {
    const s = loadStore();
    const obj: Record<string, ApiKeyEntry> = {};
    for (const [k, v] of s) obj[k] = v;
    try {
        fs.writeFileSync(STORE_PATH, JSON.stringify(obj, null, 2));
    } catch { /* ignore */ }
}

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
    saveStore();
    return entry;
}

export function validateApiKey(apiKey: string): ApiKeyEntry | null {
    const s = loadStore();
    const entry = s.get(apiKey);
    if (!entry) return null;
    entry.usageCount++;
    entry.lastUsed = new Date().toISOString();
    saveStore();
    return entry;
}

export function revokeApiKey(apiKey: string): boolean {
    const s = loadStore();
    const deleted = s.delete(apiKey);
    if (deleted) saveStore();
    return deleted;
}
