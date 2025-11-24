import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
        // Ensure the PrismaClient constructor always receives an options object
        // (the generated runtime assumes the constructor arg is an object).
        // Provide the Postgres adapter so engine validation passes.
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        // Log the DATABASE_URL so we can diagnose connection issues.
        // (This will help verify that .env is loaded at runtime.)
        // eslint-disable-next-line no-console
        console.log('Prisma DATABASE_URL=', process.env.DATABASE_URL);
        // Create adapter with explicit connection config so it uses the same
        // DATABASE_URL as other clients (and so it doesn't try localhost by default).
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const AdapterFactory = require('@prisma/adapter-pg').PrismaPg;
        // Build pg config from env. Allow opt-in SSL via DB_SSL env var.
        const connectionString = process.env.DATABASE_URL;
        const useSsl = process.env.DB_SSL === 'true' || process.env.DB_SSL === '1';
        const adapterConfig: any = connectionString ? { connectionString } : {};
        if (useSsl) {
            adapterConfig.ssl = { rejectUnauthorized: false };
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const adapter = new AdapterFactory(adapterConfig);
        // Log adapter config (non-sensitive) to help debug connection attempts.
        // eslint-disable-next-line no-console
        console.log('Prisma adapter config:', { host: adapter.config?.host, port: adapter.config?.port, database: adapter.config?.database });
        super({ adapter } as any);
    }
    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}

export default PrismaService;