import { IResponse } from '../interfaces/IResponse.interface';

/**
 * Function to generate a successful response.
 * @param {IResponse} options - Options to customize the answer. By default, the code is 200 and the message is 'sucess'.
 * @returns {IResponse} - The successful response generated.
 */
export const responseSucess = ({
  code = 200,
  message = 'sucess',
  token = undefined,
  data = undefined,
}: IResponse): IResponse => {
  return {
    state: true,
    code,
    message,
    token,
    data,
  };
};

/**
 * Function to generate a failed response.
 * @param {IResponse} options - Options to customize the answer. By default, the code is 404 and the message is 'fail'.
 * @returns {IResponse} - The failed response generated.
 */
export const responseFail = ({
  code = 404,
  message = 'fail',
}: IResponse): IResponse => {
  return {
    state: false,
    code,
    message,
  };
};
