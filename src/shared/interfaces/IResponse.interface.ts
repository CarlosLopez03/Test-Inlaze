export interface IResponse {
  code?: number;
  state?: boolean;
  message?: string;
  token?: string;
  data?: Array<object>;
}

export interface IErrorCatch {
  message?: string[];
  error?: string;
  statusCode?: number;
}
