import { BadRequestException } from '@nestjs/common';

export function ResponseFormat(data: any, isSucces = true, statusCode = 200) {
  return { data, isSucces, statusCode };
}

export function HandleService(err: any) {
  if (err instanceof BadRequestException) {
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
