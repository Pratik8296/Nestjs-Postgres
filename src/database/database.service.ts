import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
        const AdapterFactory = require('@prisma/adapter-pg').PrismaPg;
        const connectionString = process.env.DATABASE_URL;
        const useSsl = process.env.DB_SSL === 'true' || process.env.DB_SSL === '1';
        const adapterConfig: any = connectionString ? { connectionString } : {};
        if (useSsl) {
            adapterConfig.ssl = { rejectUnauthorized: false };
        }
        const adapter = new AdapterFactory(adapterConfig);
        super({ adapter } as any);
    }
    async onModuleInit() {
        await this.$connect()
            .then(() => console.log('Prisma database connected'))
            .catch((err) => {
                console.error('Prisma database connection error:', err);
                process.exitCode = 1;
            });
    }

    async onModuleDestroy() {
        await this.$disconnect().then(() => console.log('Prisma database disconnected'));
    }
}

export default PrismaService;