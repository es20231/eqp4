export default interface IUserPost {
  _id: string;
  title: string;
  body: string;
  photo: string;
  likes: string[];
  dislikes: string[];
  comentarios: string[];
  postedBy: string;
  createdAt: string;
  updatedAt: string;
}
