import { Request } from 'express';

import { IUser } from 'src/core/users/interface/IUser.interface';

export interface ICustomRequest extends Request {
  userExtract?: IUser;
}
