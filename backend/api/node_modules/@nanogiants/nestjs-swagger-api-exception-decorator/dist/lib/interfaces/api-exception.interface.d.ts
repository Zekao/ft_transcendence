import { HttpException, Type } from '@nestjs/common';
export declare type Exception<T extends HttpException> = Type<T> | T;
export declare type ExceptionOrExceptionArrayFunc<T extends HttpException> = () => Exception<T> | Exception<T>[];
export declare type ExceptionArguments<T extends HttpException> = ExceptionOrExceptionArrayFunc<T>;
