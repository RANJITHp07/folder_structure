import axios from "axios";

const baseURL = process.env.NODE_ENV === 'production'
    ? "https://imagepasswordgenerator-1.onrender.com"
    : "http://localhost:5000";


const Api = axios.create({
    baseURL: baseURL,
});

export default Api;