export interface IResponse {
  code?: number;
  state?: boolean;
  message?: string;
  token?: string;
}

export interface IErrorCatch {
  message?: string[];
  error?: string;
  statusCode?: number;
}
