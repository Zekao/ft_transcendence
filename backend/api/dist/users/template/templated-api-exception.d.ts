export declare const UserApiException: <Exception extends import("@nestjs/common").HttpException>(exceptions: import("@nanogiants/nestjs-swagger-api-exception-decorator/dist/lib/interfaces/api-exception.interface").ExceptionOrExceptionArrayFunc<Exception>, options?: import("@nanogiants/nestjs-swagger-api-exception-decorator/dist/lib/interfaces/options.interface").Options<{
    statusCode: string;
    message: string;
    error: string;
}>) => ClassDecorator & MethodDecorator;
export declare const AvatarApiException: <Exception extends import("@nestjs/common").HttpException>(exceptions: import("@nanogiants/nestjs-swagger-api-exception-decorator/dist/lib/interfaces/api-exception.interface").ExceptionOrExceptionArrayFunc<Exception>, options?: import("@nanogiants/nestjs-swagger-api-exception-decorator/dist/lib/interfaces/options.interface").Options<{
    statusCode: string;
    message: string;
    error: string;
}>) => ClassDecorator & MethodDecorator;
