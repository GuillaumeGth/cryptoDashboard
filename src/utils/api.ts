import env from "react-dotenv";
const getApiUrl = () => {
    return env.API_URL;
    if (env.NODE_ENV === 'production') {
        return env.API_URL;
    }
    return env.API_URL_LOCAL;
}
export default getApiUrl;