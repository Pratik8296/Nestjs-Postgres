import { Injectable, ConsoleLogger } from '@nestjs/common';

@Injectable()
export class LoggerService extends ConsoleLogger {
  log(message: unknown, context?: unknown) {
    super.log(message, context);
  }

  error(message: unknown, stack?: unknown, context?: unknown): void {
    super.error(message, stack, context);
  }

  warn(message: unknown, context?: unknown): void {
    super.warn(message, context);
  }

  debug(message: unknown, context?: unknown): void {
    if (process.env.NODE_ENV === 'development') {
      super.debug(message, context);
    }
  }
}
