import { NextRequest, NextResponse } from "next/server";
import { createOrGetKey } from "@/lib/apiKeyStore";

export const runtime = "nodejs";

const GOOGLE_TOKEN_INFO_URL = "https://oauth2.googleapis.com/tokeninfo";

const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: CORS_HEADERS });
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { credential } = body;

        if (!credential) {
            return NextResponse.json(
                { error: "Missing Google credential token" },
                { status: 400, headers: CORS_HEADERS }
            );
        }

        // Verify Google token
        const verifyRes = await fetch(`${GOOGLE_TOKEN_INFO_URL}?id_token=${credential}`);
        if (!verifyRes.ok) {
            return NextResponse.json(
                { error: "Invalid Google token" },
                { status: 401, headers: CORS_HEADERS }
            );
        }

        const googleUser = await verifyRes.json();
        const { sub: googleId, email, name, picture } = googleUser;

        if (!googleId || !email) {
            return NextResponse.json(
                { error: "Could not extract user info from Google token" },
                { status: 400, headers: CORS_HEADERS }
            );
        }

        // Create or retrieve API key
        const entry = createOrGetKey(googleId, email, name || email, picture || "");

        return NextResponse.json({
            success: true,
            data: {
                apiKey: entry.apiKey,
                email: entry.email,
                name: entry.name,
                picture: entry.picture,
                createdAt: entry.createdAt,
                usageCount: entry.usageCount,
            },
        }, { headers: CORS_HEADERS });

    } catch (error) {
        console.error("Auth error:", error);
        return NextResponse.json(
            { error: "Authentication failed" },
            { status: 500, headers: CORS_HEADERS }
        );
    }
}
