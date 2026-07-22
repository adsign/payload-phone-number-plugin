import { withPayload } from '@payloadcms/next/withPayload';
import { fileURLToPath } from 'url';
import path from 'path';

const dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/admin',
                permanent: false,
            },
        ];
    },
    webpack: (webpackConfig) => {
        webpackConfig.resolve.extensionAlias = {
            '.cjs': ['.cts', '.cjs'],
            '.js': ['.ts', '.tsx', '.js', '.jsx'],
            '.mjs': ['.mts', '.mjs'],
        };
        return webpackConfig;
    },
    serverExternalPackages: ['mongodb-memory-server'],
    devIndicators: false,
    // Temporarily required when developing on Windows until Next.js fixes Turbopack Sass resolution.
    // See: https://github.com/vercel/next.js/issues/86431
    sassOptions: {
        loadPaths: ['./node_modules/@payloadcms/ui/dist/scss/'],
    },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
