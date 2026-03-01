import { NextRequest, NextResponse } from "next/server";
import { createOrGetKey } from "@/lib/apiKeyStore";
import { getCorsHeaders, handleCorsPreFlight, checkRateLimit, getRateLimitHeaders } from "@/lib/apiMiddleware";

export const runtime = "nodejs";

const GOOGLE_TOKEN_INFO_URL = "https://oauth2.googleapis.com/tokeninfo";

export async function OPTIONS(req: NextRequest) {
    return handleCorsPreFlight(req);
}

export async function POST(req: NextRequest) {
    const corsHeaders = getCorsHeaders(req);

    try {
        // Rate limiting check (stricter for auth: 10 req/min)
        const rateLimitResponse = checkRateLimit(req, "auth");
        if (rateLimitResponse) return rateLimitResponse;

        const body = await req.json();
        const { credential } = body;

        if (!credential) {
            return NextResponse.json(
                { error: "Missing Google credential token" },
                { status: 400, headers: corsHeaders }
            );
        }

        // Verify Google token
        const verifyRes = await fetch(`${GOOGLE_TOKEN_INFO_URL}?id_token=${credential}`);
        if (!verifyRes.ok) {
            return NextResponse.json(
                { error: "Invalid Google token" },
                { status: 401, headers: corsHeaders }
            );
        }

        const googleUser = await verifyRes.json();
        const { sub: googleId, email, name, picture } = googleUser;

        if (!googleId || !email) {
            return NextResponse.json(
                { error: "Could not extract user info from Google token" },
                { status: 400, headers: corsHeaders }
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
        }, {
            headers: {
                ...corsHeaders,
                ...getRateLimitHeaders(req, "auth"),
            },
        });

    } catch (error) {
        console.error("Auth error:", error);
        return NextResponse.json(
            { error: "Authentication failed" },
            { status: 500, headers: corsHeaders }
        );
    }
}
