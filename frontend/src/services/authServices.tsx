
import axios from "axios";
import { LOGIN_PATH, REGISTER_PATH } from "../constants/ApiContants";
import type { ILoginRequest, ILoginResponse } from "../models/interfaces/Auth";
import ApiHelper from "../utils/ApiHelper";
import type { IRegisterResponse, IRegisterUser } from "../models/interfaces/Users";

export const loginUser= async (request: ILoginRequest): Promise<ILoginResponse> =>{
    try {
        const apiHelper= new ApiHelper();
        const response= await apiHelper.postJson(LOGIN_PATH, request);
       
        return response as ILoginResponse;
    } catch (error:unknown) {
        if(axios.isAxiosError(error)){
            if(error.response?.status===401){
                throw new Error("Wrong email or password");
            }
            throw new Error(error.response?.data?.message || "Unexpected error occurs. Please try again later.");
        }
        console.error("Unexpected error: ", error);
        throw new Error("Lỗi không xác định!");
    }
}

export const registerUser= async (request:IRegisterUser): Promise<IRegisterResponse>=>{
    try {
        const apiHelper= new ApiHelper();
        const response= await apiHelper.postJson(REGISTER_PATH, request);
        return response as IRegisterResponse;
    } catch (error) {
        if(axios.isAxiosError(error)){
            throw new Error(error.response?.data?.error || "Unexpected error occurs. Please try again later.");
        }
        console.error("Unexpected error: ", error);
        throw new Error("Unexpected error occurs. Please try again later.");
    }
}