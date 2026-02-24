import Link from "next/link";

export default function NotFound() {
    return (
        <main className="relative min-h-screen flex items-center justify-center px-6">
            <div className="text-center animate-fade-in-up">
                <div className="text-6xl mb-6" aria-hidden="true">🔍</div>
                <h1 className="text-4xl font-extrabold tracking-tight mb-3">
                    <span className="gradient-text">404</span>
                </h1>
                <h2 className="text-xl font-semibold text-[--color-text-secondary] mb-4">
                    Page Not Found
                </h2>
                <p className="text-sm text-[--color-text-muted] max-w-md mx-auto mb-8">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
                <Link
                    href="/"
                    className="btn-primary inline-flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[--color-accent-cyan]"
                >
                    <span>← Back to Home</span>
                </Link>
            </div>
        </main>
    );
}
