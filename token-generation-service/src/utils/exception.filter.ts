import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { BadRequestError } from '../utils/errors.utils';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        let status: number;
        let data: string | object = {};
        let message: string;

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            data = exception.getResponse();
        }

        if (exception instanceof BadRequestError) {
            status = 400;
            message = exception.message;
        }

        console.error(exception);

        response.status(status || HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: status || HttpStatus.INTERNAL_SERVER_ERROR,
            message: message || 'Internal Server Error',
            data: data,
        });
    }
}
