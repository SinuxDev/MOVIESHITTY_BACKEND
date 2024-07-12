import { BadRequestException, UnauthorizedException } from '@nestjs/common';

export function ResponseFormat(
  data: any,
  isSucces = true,
  statusCode = 200,
  message = "message didn't include",
) {
  return { data, isSucces, statusCode, message };
}

export function HandleService(err: any) {
  if (
    err instanceof BadRequestException ||
    err instanceof UnauthorizedException
  ) {
    return {
      message: err.getResponse()['message'] || err.message,
      isSuccess: false,
      statusCode: err.getStatus(),
    };
  } else {
    return {
      message: 'An expected error occured',
      isSuccess: false,
      statusCode: 500,
    };
  }
}
