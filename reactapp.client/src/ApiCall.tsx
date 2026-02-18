import axios, { AxiosError } from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
export async function callAPI(APIFunctionCall: string, data: JSON) {
  const baseURL = import.meta.env.VITE_SERVER_URL;
  const config: AxiosRequestConfig = {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST",
      mode: "cors",
      "Content-Encoding": "gzip, br",
    },
    baseURL,
    timeout: 2000000,
  };
  return axios
    .post(APIFunctionCall, data, config)
    .then((response: AxiosResponse) => response.data)
    .catch((error: AxiosError) => {
      console.error(
        `API call error: ${error.message}, is AxiosError: ${error.isAxiosError}.`,
      );
      return null;
    });
}
export default callAPI;
