import env from "react-dotenv";
const getApiUrl = () => {
    if (env.NODE_ENV === 'production') {
        return env.API_URL;
    }
    return env.API_URL_LOCAL;
}
export default getApiUrl;