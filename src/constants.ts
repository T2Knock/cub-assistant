import type { ContentfulStatusCode } from "hono/utils/http-status";

export const STATUS_CODE = {
  BAD_REQUEST: {
    code: 400,
    message: "Bad Request",
  },
  INTERNAL_SERVER_ERROR: {
    code: 500,
    message: "Internal Server Error",
  },
  SUCESS: {
    code: 200,
    message: "OK",
  },
} as const;

type StatusEntry = {
  code: ContentfulStatusCode;
  message: string;
};

export type StatusCodeKey = keyof typeof STATUS_CODE;

export type StatusCodeType = {
  [K in keyof typeof STATUS_CODE]: StatusEntry;
};
