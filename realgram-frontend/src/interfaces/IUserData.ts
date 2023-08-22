import ILibraryImage from "./ILibraryImage";
import IUserPost from "./IUserPost";

export default interface IUserData {
  _id: string;
  name: string;
  email: string;
  username: string;
  description: string;
  profilePhoto: File | string;
  posts: IUserPost[];
  library: ILibraryImage[];
  followers: IUserData[];
  following: IUserData[];
  createdAt: string;
  updatedAt: string;
}
