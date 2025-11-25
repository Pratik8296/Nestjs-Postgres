import { Injectable, ConsoleLogger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { promises as fsPromises } from 'fs';
import { time } from 'console';

@Injectable()
export class LoggerService extends ConsoleLogger {
    async logToFile(entry: any) {
        const formattedEntry = `${Intl.DateTimeFormat('en-US', {
            dateStyle: 'short',
            timeStyle: 'short',
            timeZone: 'UTC'
        }).format(new Date())}\t${entry}\n`;

        try {
            if (!fs.existsSync(path.join(__dirname, '..', '..', 'logs'))) {
                await fsPromises.mkdir(path.join(__dirname, '..', '..', 'logs'));
            }

            await fsPromises.appendFile(path.join(__dirname, '..', '..', 'logs', 'logFile.log'), formattedEntry);
        } catch (error: any) {
            if (error instanceof Error) {
                console.error(error.message);
            }
        }
    }
    log(message: unknown, context?: unknown) {
        const entry = `${context}\t${message}`;
        this.logToFile(entry);
        super.log(message, context);
    }

    error(message: unknown, stack?: unknown, context?: unknown): void {
        const entry = `${context}\t${message}`;
        this.logToFile(entry);
        super.error(entry, stack, context);
    }
}
