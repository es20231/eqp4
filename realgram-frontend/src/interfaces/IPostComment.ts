import IUserData from "./IUserData";

export default interface IPostComment {
  _id: string;
  text: string;
  postedBy: IUserData;
  createdAt: string;
  updatedAt: string;
}
