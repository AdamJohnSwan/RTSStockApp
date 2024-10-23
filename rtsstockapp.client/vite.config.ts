import { fileURLToPath, URL } from 'node:url';

import { CommonServerOptions, defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';
import fs from 'fs';
import { env } from 'process';


const certFilePath = env.VITE_CERT_FILE_PATH;
const keyFilePath = env.VITE_KEY_FILE_PATH;

let https: CommonServerOptions["https"] | undefined = undefined;
if (certFilePath && keyFilePath) {
    if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
        throw new Error("Cert paths defined but files do not exist.")
    }
    https = {
        key: fs.readFileSync(keyFilePath),
        cert: fs.readFileSync(certFilePath),
    };
}

const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
    env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'https://localhost:7225';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [plugin()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        proxy: {
            '^/api': {
                target,
                secure: false
            }
        },
        port: 5173,
        https: https
    }
})
