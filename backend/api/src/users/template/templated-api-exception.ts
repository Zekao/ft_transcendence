import { buildTemplatedApiExceptionDecorator } from "@nanogiants/nestjs-swagger-api-exception-decorator";

export const UserApiException = buildTemplatedApiExceptionDecorator({
  statusCode: "$status",
  message: "User :id not found",
  error: "$description",
});

export const AvatarApiException = buildTemplatedApiExceptionDecorator({
  statusCode: "$status",
  message: "Cannot delete default avatar",
  error: "$description",
});
