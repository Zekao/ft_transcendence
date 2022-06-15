"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvatarApiException = exports.UserApiException = void 0;
const nestjs_swagger_api_exception_decorator_1 = require("@nanogiants/nestjs-swagger-api-exception-decorator");
exports.UserApiException = (0, nestjs_swagger_api_exception_decorator_1.buildTemplatedApiExceptionDecorator)({
    statusCode: "$status",
    message: "User :id not found",
    error: "$description",
});
exports.AvatarApiException = (0, nestjs_swagger_api_exception_decorator_1.buildTemplatedApiExceptionDecorator)({
    statusCode: "$status",
    message: "Cannot delete default avatar",
    error: "$description",
});
//# sourceMappingURL=templated-api-exception.js.map