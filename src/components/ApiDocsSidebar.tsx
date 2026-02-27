"use client";

const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

export default function ApiDocsSidebar() {
    return (
        <aside className="api-docs-sidebar">
            <nav className="sticky top-16 py-6 px-4">
                {/* Getting Started */}
                <p className="api-sidebar-title">Getting Started</p>
                <div className="api-sidebar-group">
                    <a href="#overview" className="api-sidebar-link" onClick={scrollTo("overview")}>Overview</a>
                    <a href="#auth" className="api-sidebar-link" onClick={scrollTo("auth")}>Authentication</a>
                    <a href="#auth" className="api-sidebar-link api-sidebar-sub" onClick={scrollTo("auth")}>API Key</a>
                    <a href="#rate-limits" className="api-sidebar-link api-sidebar-sub" onClick={scrollTo("rate-limits")}>Rate Limits</a>
                </div>

                {/* Endpoint */}
                <p className="api-sidebar-title">Endpoint</p>
                <div className="api-sidebar-group">
                    <a href="#endpoint" className="api-sidebar-link" onClick={scrollTo("endpoint")}>Base URL</a>
                    <a href="#headers" className="api-sidebar-link api-sidebar-sub" onClick={scrollTo("headers")}>Headers</a>
                    <a href="#request-body" className="api-sidebar-link api-sidebar-sub" onClick={scrollTo("request-body")}>Request Body</a>
                </div>

                {/* Response */}
                <p className="api-sidebar-title">Response</p>
                <div className="api-sidebar-group">
                    <a href="#response" className="api-sidebar-link" onClick={scrollTo("response")}>Response Format</a>
                    <a href="#verdict-values" className="api-sidebar-link api-sidebar-sub" onClick={scrollTo("verdict-values")}>Verdict Values</a>
                    <a href="#error-codes" className="api-sidebar-link api-sidebar-sub" onClick={scrollTo("error-codes")}>Error Codes</a>
                </div>

                {/* Code Examples */}
                <p className="api-sidebar-title">Code Examples</p>
                <div className="api-sidebar-group">
                    <a href="#examples" className="api-sidebar-link" onClick={scrollTo("examples")}>Quick Start</a>
                    <a href="#examples" className="api-sidebar-link api-sidebar-sub" onClick={scrollTo("examples")}>cURL / Python / JS</a>
                    <a href="#examples" className="api-sidebar-link api-sidebar-sub" onClick={scrollTo("examples")}>Go / Ruby / PHP</a>
                    <a href="#examples" className="api-sidebar-link api-sidebar-sub" onClick={scrollTo("examples")}>Java / C# / Rust</a>
                </div>
            </nav>
        </aside>
    );
}
