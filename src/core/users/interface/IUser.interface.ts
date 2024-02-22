export interface IUser {
  _id?: string;
  userId?: string;
  fullName?: string;
  age?: number;
  email?: string;
  password?: string;
  posts?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
