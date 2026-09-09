"use client"
import React, { useEffect } from 'react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { AppSidebar } from '@/components/app-sidebar';
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import StatusBar from '@/components/statusbar';
import UploadBar from '@/components/uploadbar';
import ProcessIndicator from '@/components/processIndicator';
import { useRouter } from 'next/navigation';
import { useUserInformationStore } from '@/lib/store/userStore';


function Dashboardlayout({ children }: { children: React.ReactNode }) {
    const { isLogin, fetchInformation, fetchItems } = useUserInformationStore();
    const router = useRouter();
    useEffect(() => {
        async function usr() {  
            const res = await fetchInformation();
            if(!res){
                router.push("/login");
            }

            await fetchItems();
        }
        usr();
    }, [isLogin])
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <main className='w-full h-full overflow-hidden' >
                    <StatusBar />
                    {children}
                    <UploadBar />
                    <ProcessIndicator />
                </main>
            </SidebarInset>
        </SidebarProvider>

    )
}

export default Dashboardlayout