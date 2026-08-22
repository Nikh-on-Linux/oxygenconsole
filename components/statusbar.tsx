"use client"
import React from 'react';
import { SidebarTrigger } from './ui/sidebar';
import PathNavigation from './path';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CloudUploadIcon } from 'lucide-react';
import Link from 'next/link';
import { useTopPanelStore } from '@/lib/store/TopPanelStore';

function StatusBar() {
    const action = useTopPanelStore((s) => s.action);
    const pagetitle = useTopPanelStore((s) => s.pagetitle);
    const showBreadCrumbs = useTopPanelStore((s)=>s.showBreadCrumbs);
    const isNested = useTopPanelStore((s)=>s.isNested);
    return (
        <header className="flex justify-between h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 px-4">
            <div className='flex items-center gap-4' >
                <div className="flex items-center ">
                    <SidebarTrigger className="-ml-1" />
                    {
                        isNested?
                        <Button size={"icon-lg"} variant={"ghost"} className={"m-1"}>
                            <ArrowLeft />
                        </Button>
                        :
                        ""
                    }
                    <span className='font-semibold' >{pagetitle}</span>
                </div>
                {
                    showBreadCrumbs ? <PathNavigation /> : ""
                }
            </div>
            <div>
                {action}
            </div>
        </header>
    )
}

export default StatusBar