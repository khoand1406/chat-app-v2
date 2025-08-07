
import axios from "axios";
import { LOGIN_PATH } from "../constants/ApiContants";
import type { ILoginRequest, ILoginResponse } from "../models/interfaces/Auth";
import ApiHelper from "../utils/ApiHelper";

export const loginUser= async (request: ILoginRequest): Promise<ILoginResponse> =>{
    try {
        const apiHelper= new ApiHelper();
        const response= await apiHelper.postJson(LOGIN_PATH, request);
        console.log(response);
        return response as ILoginResponse;
    } catch (error:unknown) {
        if(axios.isAxiosError(error)){
            if(error.response?.status===401){
                throw new Error("Wrong email or password");
            }
            throw new Error(error.response?.data?.message || "Lỗi khi gọi API.");
        }
        console.error("Unexpected error: ", error);
        throw new Error("Lỗi không xác định!");
    }
}