import { FileIcon, MoreVerticalIcon } from 'lucide-react'
import React from 'react'
import { Button } from './ui/button'
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
} from "@/components/ui/context-menu"

function FileBox({ filename = "SampleFile very big text..tx and someh", filetype = "txt" }) {
    return (
        <div className='w-37 aspect-square  py-2 group hover:bg-accent/50 rounded-lg ' >
            <ContextMenu>
                <ContextMenuTrigger className={"flex relative flex-col items-center gap-3"}>
                    <FileIcon className='w-[5rem] h-[5rem] stroke-1 text-muted-foreground' />
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
                        <ContextMenuItem>Move to</ContextMenuItem>
                        <ContextMenuItem>Rename</ContextMenuItem>
                    </ContextMenuGroup>
                    <ContextMenuSeparator />
                    <ContextMenuGroup>
                        <ContextMenuItem>
                            <span className='text-destructive' >Delete</span>
                        </ContextMenuItem>
                    </ContextMenuGroup>
                </ContextMenuContent>
            </ContextMenu>

        </div>
    )
}

export default FileBox