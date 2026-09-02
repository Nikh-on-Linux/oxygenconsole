"use client"
import { FileIcon, FileTextIcon, FileX2, MoreVerticalIcon } from 'lucide-react'
import React from 'react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuGroup,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuSeparator,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useTopPanelStore } from '@/lib/store/TopPanelStore';
import { useNavigationStore } from '@/lib/store/mediaStore'

function FileBox({ filename = "SampleFile very big text..tx and someh", fileid = "", filetype = "txt" }) {
    const { currentPath } = useTopPanelStore();
    const { setBackPath } = useNavigationStore();
    const router = useRouter();
    const handleMoveFile = () => {
        router.push(`?mt=${filename}`);
    }
    const handleDeleteFile = () => {
        router.push(`?defi=${fileid}`);
    }
    const handleFileOpen = () => {
        setBackPath(`/dashboard/myair/${currentPath}`);
        router.push(`/dashboard/media/${fileid}`);
    }
    return (
        <div className='w-37 aspect-square  py-2 group hover:bg-accent/50 rounded-lg ' onDoubleClick={handleFileOpen} >
            <ContextMenu>
                <ContextMenuTrigger className={"flex relative flex-col items-center justify-center gap-6 h-full"}>
                    <div className='w-fit px-2 aspect-square flex items-center justify-center rounded-xl bg-accent' >
                        <FileTextIcon className='w-6 h-6 stroke-1 text-muted-foreground' />
                    </div>
                    <span className='font-sans  max-w-full line-clamp-2 text-center'>{filename}</span>
                </ContextMenuTrigger>
                <ContextMenuContent className={"data-[starting-style]:opacity-0 data-[starting-style]:scale-95 data-[ending-style]:opacity-0 data-[ending-style]:scale-95 transition duration-150"}>
                    <ContextMenuGroup>
                        <ContextMenuSub>
                            <ContextMenuSubTrigger>Open</ContextMenuSubTrigger>
                            <ContextMenuSubContent>
                                <ContextMenuItem>Open</ContextMenuItem>
                                <ContextMenuItem>Open in new Tab</ContextMenuItem>
                                <ContextMenuItem>Open in new Window</ContextMenuItem>
                            </ContextMenuSubContent>
                        </ContextMenuSub>
                    </ContextMenuGroup>
                    <ContextMenuSeparator />
                    <ContextMenuGroup>
                        <ContextMenuItem>Download</ContextMenuItem>
                        <ContextMenuItem onClick={handleMoveFile} >Move to</ContextMenuItem>
                        <ContextMenuItem>Rename</ContextMenuItem>
                    </ContextMenuGroup>
                    <ContextMenuSeparator />
                    <ContextMenuGroup>
                        <ContextMenuItem onClick={handleDeleteFile}>
                            <span className='text-destructive' >Delete</span>
                        </ContextMenuItem>
                    </ContextMenuGroup>
                </ContextMenuContent>
            </ContextMenu>

        </div>
    )
}

export default FileBox