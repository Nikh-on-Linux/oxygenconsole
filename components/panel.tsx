import React from 'react';
import FolderBox from './folderbox';
import { cn } from '@/lib/utils';

function Panel({ children, title, className }: { children?:React.ReactNode, title?: String, className?: String }) {
    return (
        <div className={cn("flex flex-col gap-4 mb-20 mt-5", className)} >
            <span className="font-sans font-semibold text-xl">{title}</span>
            <div className="" >
                {children}
            </div>
        </div>
    )
}

export default Panel