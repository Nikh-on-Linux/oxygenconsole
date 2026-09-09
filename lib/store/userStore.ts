import { create } from "zustand";
import { fetchDashboardItems, fetchUserInformation } from "@/lib/api/user";
import { DashboardItems } from "../types/user";

interface UserInformationStore {
    username: string | null;
    email: string | null;
    isLogin: boolean | null;
    dashboardItems:DashboardItems | null;

    setUsename: (name: string) => void;
    setEmail: (email: string) => void;
    fetchInformation: () => Promise<boolean>;
    fetchItems: ()=> Promise<void>;
    reset: () => void;
}

export const useUserInformationStore = create<UserInformationStore>((set) => ({
    username: null,
    email: null,
    isLogin: null,
    dashboardItems: null,

    setUsename: (name: string) =>
        set({
            username: name,
        }),

    setEmail: (email: string) => {
        set({
            email: email
        })
    },

    fetchInformation: async () => {
        try {
            const response = await fetchUserInformation();
            if (!response.suc) {
                set({
                    isLogin: false
                });
                return false;
            }

            set({
                username: response.data.name,
                email: response.data.email,
                isLogin: true
            })

            return true;
        }
        catch(err){
            console.log(err);
            return false;
        }
    },

    fetchItems: async()=>{
        try{
            const response = await fetchDashboardItems();
            if(response.suc){
                set({
                    dashboardItems:response
                })
                return;
            }
        }
        catch(err){
            console.log(err);
        }
    },

    reset: () =>
        set({
            username: null,
            email: null
        }),
}));