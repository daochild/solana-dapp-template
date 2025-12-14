import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // ---- Build/runtime hygiene
    // output: "standalone",                 // Disabled temporarily due to Windows symlink permissions
    reactStrictMode: true,                // dev-only checks; zero runtime cost in prod
    compress: true,                       // gzip/deflate at framework level
    poweredByHeader: false,               // remove x-powered-by
    generateEtags: true,                  // enable HTTP caching validators
    httpAgentOptions: { keepAlive: true },// reduce socket churn under load
    productionBrowserSourceMaps: false,   // keep: smaller build, faster deploys

    // ---- Lint/TS during CI only (you can flip to true in CI)
    typescript: { ignoreBuildErrors: true },

    // ---- Images: modern formats + saner defaults
    images: {
        formats: ["image/avif", "image/webp"],
        dangerouslyAllowSVG: false,
        minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
    },

    // ---- Static caching headers (works on Node runtime; LB/CDN can override)
    async headers() {
        return [
            {
                source: "/_next/static/:path*",
                headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
            },
            {
                source: "/_next/image/:path*",
                headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
            },
            {
                // your public assets
                source: "/public/:path*",
                headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
            },
            {
                // Security headers for all routes
                source: "/:path*",
                headers: [
                    { key: "X-Frame-Options", value: "DENY" },
                    { key: "X-Content-Type-Options", value: "nosniff" },
                    { key: "X-XSS-Protection", value: "1; mode=block" },
                    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
                ],
            },
        ];
    },

    // ---- Bundle trimming (tree-shake common libs)
    modularizeImports: {
        lodash: { transform: "lodash/{{member}}" },
        "date-fns": { transform: "date-fns/{{member}}" },
        "@mui/material": { transform: "@mui/material/{{member}}" },
        "@mui/icons-material": { transform: "@mui/icons-material/{{member}}" },
    },

    // ---- Keep your Turbopack scheme
    // NOTE: Turbopack options are still evolving; these map to current stable flags.
    // If building with Turbopack in CI, export NEXT_USE_TURBOPACK=1
    // and keep these settings.
    // (If you build with Webpack, these are simply ignored.)
    // --------------------------------------------------------------------------
    // Your existing block preserved & extended with safe knobs:
    // ---- Turbopack configuration
    turbopack: {
        resolveAlias: {
            "@components": "./src/components",
            "@lib": "./src/lib",
        },
        resolveExtensions: [".ts", ".tsx", ".js", ".jsx", ".mjs", ".json"],
        root: process.cwd(),
    },

    // ---- Experimental toggles aligned to your ExperimentalConfig interface
    experimental: {
        // If your CI/VM is RAM-tight, bound workers (set cpus to 2 or 1)
        cpus: 2,
        // Memory/build stability
        turbopackMemoryLimit: 4096, // uncomment if you need to cap GBs

        memoryBasedWorkersCount: true,
        optimizeCss: true,
        serverMinification: true,
        turbopackMinify: true,
        turbopackRemoveUnusedExports: true,
        turbopackFileSystemCacheForDev: true,
        typedEnv: true,
        optimizePackageImports: ["lodash", "date-fns", "@mui/material", "@mui/icons-material", "react-icons"],
    },

    // ---- Keep bundle/prerender output tidy
    // distDir: "dist", // optional: move .next if your infra expects custom dir

    cacheComponents: true, // default in Next 14+, can be omitted
};

export default nextConfig;
