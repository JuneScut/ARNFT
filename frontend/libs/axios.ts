import axios from "axios";
import { Toast } from "antd-mobile";

axios.defaults.timeout = 100000;
axios.defaults.baseURL = "https://asia-east2-test-35968.cloudfunctions.net/";
// axios.defaults.baseURL = "http://127.0.0.1:5001/test-35968/asia-east2/";

axios.interceptors.request.use(
  (config) => {
    config.headers = {
      "Content-Type": "application/json",
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const RETURN_CODE = {
  SUCCESS: 0,
  ERROR_PARAMS: -1,
  ERROR_ETHER: -2,
};

axios.interceptors.response.use(
  (response) => {
    if (response.data.code === RETURN_CODE.ERROR_PARAMS) {
      console.log("ERROR_PARAMS");
    } else if (response.data.code === RETURN_CODE.ERROR_ETHER) {
      console.log("ERROR_ETHER");
    }
    return response;
  },
  (error) => {
    console.log("请求出错：", error);
  }
);

export function get(url: string, params: object = {}): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .get(url, { params: params })
      .then((response) => {
        // TODO: 统一错误提示
        const { data } = response;
        const { code } = data;
        if (code === RETURN_CODE.SUCCESS) {
          resolve(response.data.data);
        } else {
          resolve(response);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function post(url: string, params: object = {}): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post(url, params)
      .then((response) => {
        // TODO: 统一错误提示
        console.log({ response });
        const { data } = response;
        const { code } = data;
        switch (code) {
          case RETURN_CODE.SUCCESS:
            resolve(response.data.data);
            break;
          case RETURN_CODE.ERROR_ETHER:
            Toast.show("Oops, ether internal error!");
            reject(response.data);
            break;
          case RETURN_CODE.ERROR_PARAMS:
            Toast.show("Parameter Error!");
            reject(response.data);
          default:
            resolve(response.data);
            break;
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}
