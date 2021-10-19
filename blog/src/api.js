import axios from "axios";

const API = axios.create({ baseURL: 'https://blogss-post.herokuapp.com' });

export default API;