import axios from "axios";
import { UBALLET_API_URL } from "../../env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const uballetAxios = axios.create({
    baseURL: UBALLET_API_URL,
});
  
uballetAxios.interceptors.request.use(
    async (config) => {
        const token = await getUballetToken();
        if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

const UBALLET_JWT_KEY = "uballet_jwt";

export const getUballetToken = async () => {
    const token = await AsyncStorage.getItem(UBALLET_JWT_KEY);
    return token;
  };
  
export const setUballetToken = async (token: string) => {
    return await AsyncStorage.setItem(UBALLET_JWT_KEY, token);
};

export const removeUballetToken = async () => {
    return await AsyncStorage.removeItem(UBALLET_JWT_KEY);
};

export default uballetAxios