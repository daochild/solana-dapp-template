import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    turbopack: {
        resolveAlias: {
            "@components": "./src/components",
            "@lib": "./src/lib"
        },
        resolveExtensions: [".ts", ".tsx", ".js", ".jsx", ".mjs", ".json"],
        root: process.cwd()
    },
    output: "standalone", // for Docker support
    eslint: {
        ignoreDuringBuilds: true, // disable eslint during builds
    },
    typescript: {
        ignoreBuildErrors: true, // disable typescript errors during builds
    },
    productionBrowserSourceMaps: false, // do not produce source maps for production build
};

export default nextConfig;
