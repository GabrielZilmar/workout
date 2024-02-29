import { HttpStatus } from '@nestjs/common';

type EmailSenderErrorParams = {
  message: string;
  code: number;
  payload: unknown;
};

type EmailSenderErrorCreateParams = {
  message: string;
  code?: number;
  payload?: unknown;
};

export default class EmailSenderError extends Error {
  public readonly code: number;
  public readonly payload: unknown;

  constructor({ message, code, payload }: EmailSenderErrorParams) {
    super(message);
    this.payload = payload;
    this.code = code;
    this.name = 'email-sender';
  }

  public static create({
    message,
    code = HttpStatus.INTERNAL_SERVER_ERROR,
    payload = null,
  }: EmailSenderErrorCreateParams) {
    return new EmailSenderError({ message, code, payload });
  }
}
