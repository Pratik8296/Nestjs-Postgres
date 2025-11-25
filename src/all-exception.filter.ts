import { Catch, HttpException, HttpStatus, ArgumentsHost } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { Request, Response } from "express";
import { LoggerService } from "./logger/logger.service";
import { PrismaClientValidationError } from "generated/prisma/runtime/client";

type ResponseObject = {
    statusCode: number;
    timestamp: string;
    path: string;
    response: string | object;
};

@Catch()
export class AllExceptionFilter extends BaseExceptionFilter {
    private readonly logger = new LoggerService
        (AllExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const responseObject: ResponseObject = {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            timestamp: new Date().toUTCString(),
            path: request.url,
            response: '',
        };

        if (exception instanceof HttpException) {
            responseObject.statusCode = exception.getStatus();
            responseObject.response = exception.getResponse();
        } else if (exception instanceof PrismaClientValidationError) {
            responseObject.statusCode = 422;
            responseObject.response = exception.message.replaceAll(/\n/g, '');
        } else {
            responseObject.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            responseObject.response = 'Something went wrong';
        }

        response.status(responseObject.statusCode).json(responseObject);
        this.logger.error(responseObject.response, AllExceptionFilter.name);

        super.catch(exception, host);
    }
}