import { apiClient } from "./client";
import { DashboardItems, UserInformation } from "../types/user";

export async function fetchUserInformation(): Promise<UserInformation>{
    const response = await apiClient.get("/user/info");
    return response.data;
}

export async function fetchDashboardItems(): Promise<DashboardItems>{
    const response = await apiClient.get("/user/me");
    return response.data;
}