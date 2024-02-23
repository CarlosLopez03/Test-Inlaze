export interface IPublications {
  _id?: string;
  title?: string;
  content?: string;
  likes?: number;
  userId?: string;
  userLikes?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
