import IPostComment from "./IPostComment";
import IUserData from "./IUserData";

export default interface IUserPost {
  _id: string;
  title: string;
  body: string;
  photo: string;
  likes: IUserData[];
  dislikes: IUserData[];
  comentarios: IPostComment[];
  postedBy: IUserData;
  createdAt: string;
  updatedAt: string;
}
