import { loadEnv } from 'vite';
const env = loadEnv('development', process.cwd(), '');
console.log('PORT:', env.PORT);
console.log('parsed:', parseInt(env.PORT || '3000', 10));
