import dotenv from 'dotenv'

import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('__filename', __filename)
console.log('__dirname', __dirname)

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const env = {
    port: process.env.port,
    node_env: (process.env.NODE_ENV === 'development') ? 'development' : 'production',
    app_url: process.env.APP_URL,
    database_url: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD
}



export default env