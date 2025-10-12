import { execSync } from 'child_process';

const command = `wrangler pages dev ./public --port 3000 --compatibility-date=2024-01-01 --d1 DB=algran-db --r2 R2=boutique-images --binding ADMIN_PASSWORD=admin123 --binding CLOUDFLARE_R2_PUBLIC_URL=https://pub-b38679a01a274648827751df94818418.r2.dev`;

console.log('Starting development server...');
execSync(command, { stdio: 'inherit' });