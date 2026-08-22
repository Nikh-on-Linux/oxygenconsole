import React from 'react';
import FolderBox from './folderbox';
import { cn } from '@/lib/utils';

function Panel({ children, title, className }: { children?:React.ReactNode, title?: String, className?: String }) {
    return (
        <div className={cn("flex flex-col gap-4 ", className)} >
            <span className="font-sans font-semibold text-xl">{title}</span>
            <div className="flex flex-row items-center gap-3 flex-wrap" >
                {children}
            </div>
        </div>
    )
}

export default Panel