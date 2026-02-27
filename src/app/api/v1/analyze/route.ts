import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/apiKeyStore";
import { analyzeImageBuffer } from "@/lib/serverAnalyzer";

export const runtime = "nodejs";
export const maxDuration = 30;

const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-API-Key",
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: CORS_HEADERS });
}

export async function POST(req: NextRequest) {
    try {
        // Validate API key
        const apiKey = req.headers.get("x-api-key") || req.headers.get("authorization")?.replace("Bearer ", "");
        if (!apiKey) {
            return NextResponse.json(
                { error: "Missing API key. Include X-API-Key header or Authorization: Bearer <key>" },
                { status: 401, headers: CORS_HEADERS }
            );
        }

        const user = validateApiKey(apiKey);
        if (!user) {
            return NextResponse.json(
                { error: "Invalid API key" },
                { status: 403, headers: CORS_HEADERS }
            );
        }

        // Parse request
        const contentType = req.headers.get("content-type") || "";
        let buffer: Buffer;
        let fileName = "uploaded.jpg";

        if (contentType.includes("multipart/form-data")) {
            const formData = await req.formData();
            const file = formData.get("image") as File | null;
            if (!file) {
                return NextResponse.json(
                    { error: "No 'image' field in form data" },
                    { status: 400, headers: CORS_HEADERS }
                );
            }
            fileName = file.name;
            const arrayBuffer = await file.arrayBuffer();
            buffer = Buffer.from(arrayBuffer);
        } else if (contentType.includes("application/json")) {
            const body = await req.json();
            if (!body.image) {
                return NextResponse.json(
                    { error: "Missing 'image' field (base64 encoded)" },
                    { status: 400, headers: CORS_HEADERS }
                );
            }
            const base64Data = body.image.replace(/^data:image\/\w+;base64,/, "");
            buffer = Buffer.from(base64Data, "base64");
            fileName = body.fileName || "uploaded.jpg";
        } else {
            // Raw binary
            const arrayBuffer = await req.arrayBuffer();
            buffer = Buffer.from(arrayBuffer);
        }

        // Validate size (max 10MB)
        if (buffer.length > 10 * 1024 * 1024) {
            return NextResponse.json(
                { error: "Image too large. Maximum 10MB." },
                { status: 413, headers: CORS_HEADERS }
            );
        }

        // Analyze
        const result = await analyzeImageBuffer(buffer, fileName);

        return NextResponse.json({
            success: true,
            data: result,
            meta: {
                apiVersion: "v1",
                timestamp: new Date().toISOString(),
            },
        }, { headers: CORS_HEADERS });

    } catch (error) {
        console.error("API analyze error:", error);
        return NextResponse.json(
            { error: "Analysis failed", message: error instanceof Error ? error.message : "Unknown error" },
            { status: 500, headers: CORS_HEADERS }
        );
    }
}
