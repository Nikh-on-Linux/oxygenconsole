"use client"
import React from 'react';
import { SidebarTrigger } from './ui/sidebar';
import PathNavigation from './path';
import { Button } from '@/components/ui/button';
import { CloudUploadIcon } from 'lucide-react';
import Link from 'next/link';
import { useTopPanelStore } from '@/lib/store/TopPanelStore';

function StatusBar() {
    const action = useTopPanelStore((s)=>s.action);
    return (
        <header className="flex justify-between h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 px-4">
            <div className='flex items-center ' >
                <div className="flex items-center gap-2 ">
                    <SidebarTrigger className="-ml-1" />
                </div>
                <PathNavigation />
            </div>
            <div>
                {action}
            </div>
        </header>
    )
}

export default StatusBar