import IUserData from "./IUserData";

export default interface IUserPost {
  _id: string;
  title: string;
  body: string;
  photo: string;
  postedBy: IUserData;
  createdAt: string;
  updatedAt: string;
}
