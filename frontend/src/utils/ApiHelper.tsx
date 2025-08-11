import axios from "axios";
import { BaseUrl } from "../constants/ApiContants";
import {toast} from "react-toastify"
class ApiHelper{
    [x:string]: any;
    baseUrl: string;
    constructor() {
        this.baseUrl = BaseUrl;
    }

    private handleError(error: any) {
        if(error.response && error.response.status === 403) {
            const errorMessage = error.response.data.message || 'Forbidden';
            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                });
        
        }else if(error.response && error.response.status ===401){
            const errorMessage= error.response.data.message || 'Login failed'
            throw new Error(errorMessage);
        }else{
            console.error('An unexpected error occurred:', error.response.data || error.message || error);
            throw new Error('An unexpected error occurred:', error.response.data || error.message || error)
        }
    }


    async postJson(endpoint: string, data: any) {
        try{
            const token= localStorage.getItem('accessToken');
            const response= await axios.post(`${this.baseUrl}${endpoint}`, data, {
                headers: {
                    'Content-Type': 'application/json', 
                    "Authorization": `Bearer ${token}`
                }
            });
            return response.data;
        }catch(error:any ){
            if (axios.isAxiosError(error)) {
        throw error;
      }

      // Trường hợp lỗi không phải từ Axios
      console.error("Lỗi không phải Axios:", error);
      throw new Error("Lỗi không xác định trong postJson.");
        }

    }
    async post(url: string, data: any): Promise<any> {
    try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.post(`${this.baseUrl}${url}`, data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error: any) {
        this.handleError(error);
    }
  }

  async postFormData(url:string, data:any):Promise<any>{
    try {
        const token= localStorage.getItem("accessToken");
        const response= await axios.post(`${this.baseUrl}${url}`, data, {
            headers: {
                "Content-Type":"multipart/form-data",
                'Authorization': `Bearer ${token}`
            }
        
        })
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
        throw error;
      }

      // Trường hợp lỗi không phải từ Axios
      console.error("Lỗi không phải Axios:", error);
      throw new Error("Lỗi không xác định trong postJson.");
    }
  }
    async get(url: string): Promise<any> {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.get(`${this.baseUrl}${url}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

        return response.data;
    } catch (error: any) {
        this.handleError(error);
    }
}
}

export default ApiHelper;