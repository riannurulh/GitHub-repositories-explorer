import axios from "axios";

const PostCreate = axios.create({
  baseURL: "https://api.github.com",
});

export default PostCreate;
