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
    output: "standalone",
    productionBrowserSourceMaps: false,
};

export default nextConfig;
