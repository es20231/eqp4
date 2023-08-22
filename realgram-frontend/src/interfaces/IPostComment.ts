import IUserData from "./IUserData";

export default interface IPostComment {
  _id: string;
  text: string;
  user: IUserData;
  createdAt: string;
  updatedAt: string;
}
