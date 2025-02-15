import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async rewrites() {
        return [
            {
                source: "/api/:path*", // 프론트엔드에서 /api/ 로 시작하는 요청을
                destination: "http://localhost:8090/:path*", // 백엔드 서버로 프록시
            },
        ];
    },
};

export default nextConfig;
