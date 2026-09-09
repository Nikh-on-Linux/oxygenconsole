import { BaseApiResponse } from "./base";

export interface UserInformation extends BaseApiResponse{
    data:{
        email:string,
        name:string,
        image:string
    }
}

export interface DashboardItems extends BaseApiResponse{
    files:[{
        filename:string,
        mimetype:string,
        file_size:string,
        file_id:string
    }],
    folders:[{
        folder_name:string,
        folder_id:string
    }]
}