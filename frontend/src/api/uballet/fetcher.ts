import axios from "axios";
import { UBALLET_API_URL } from "../../env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const uballetAxios = axios.create({
    baseURL: UBALLET_API_URL,
});
  
let chain = 'sepolia';

uballetAxios.interceptors.request.use(
    async (config) => {
        config.headers["Chain"] = chain;
        const token = await getUballetToken();
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export function setChainHeader(blockchain: string) {
    chain = blockchain
}

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