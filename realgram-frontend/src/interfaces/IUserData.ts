import ILibraryImage from "./ILibraryImage";
import IUserPost from "./IUserPost";

export default interface IUserData {
  _id: string;
  name: string;
  email: string;
  username: string;
  description: string;
  profileImage?: string;
  posts?: IUserPost[];
  library?: ILibraryImage[];
  followers?: string[];
  following?: string[];
  createdAt: string;
  updatedAt: string;
}
