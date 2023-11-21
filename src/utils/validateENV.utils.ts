import { cleanEnv, str } from 'envalid';

function validateEnv() {
    cleanEnv(process.env, {
        NODE_ENV: str(),
        PORT: str(),
        DB_URL: str(),
        JWT_SECRET: str(),
        JWT_ACCESS_EXPIRATION_MINUTES: str(),
        JWT_REFRESH_EXPIRATION_DAYS: str(),
        JWT_RESET_PASSWORD_EXPIRATION_MINUTES: str(),
        JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: str(),
        SMTP_HOST: str(),
        SMTP_PORT: str(),
        SMTP_USERNAME: str(),
        SMTP_PASSWORD: str(),
        EMAIL_FROM: str(),
    });
}

export default validateEnv;