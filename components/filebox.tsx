"use client"
import { FileIcon, FileTextIcon, FileX2, MoreVerticalIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
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
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Input } from '@/components/ui/input';
import { useFileStore } from '@/lib/store/FolderFileStore'
import { toast } from 'sonner'

function FileBox({ filename = "SampleFile very big text..tx and someh", fileid = "", filetype = "txt" }) {
    const { currentPath } = useTopPanelStore();
    const { setBackPath } = useNavigationStore();
    const [isRenameOpen, setRenameOpen] = useState(false);
    const { renameFile, subLoading, subResponse } = useFileStore();
    const [nameValue, setNameValue] = useState("");
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

    // useEffect(() => {
    //     if (subResponse.message && subResponse.suc) {
    //         if (!subResponse.suc) {
    //             toast.error(subResponse.message);
    //             return;
    //         }
    //         toast.success(subResponse.message);
    //     }
    // }, [subLoading])

    const handleFileRename = async () => {
        setRenameOpen(false);
        toast.info("Renaming file");
        await renameFile(filename, currentPath, nameValue);
    }
    return (
        <div className='w-37 aspect-square  py-2 group hover:bg-accent/50 rounded-lg ' onDoubleClick={handleFileOpen} >
            <Dialog open={isRenameOpen} onOpenChange={setRenameOpen} >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Rename File</DialogTitle>
                    </DialogHeader>
                    <Input placeholder='e.g, file123' onChange={(e) => setNameValue(e.target.value)} />
                    <DialogFooter>
                        <DialogClose render={<Button variant={"secondary"}>Cancel</Button>} />
                        <Button onClick={handleFileRename} >Rename</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
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
                                <ContextMenuItem onClick={handleFileOpen} >Open</ContextMenuItem>
                                <ContextMenuItem>Open in new Tab</ContextMenuItem>
                                <ContextMenuItem>Open in new Window</ContextMenuItem>
                            </ContextMenuSubContent>
                        </ContextMenuSub>
                    </ContextMenuGroup>
                    <ContextMenuSeparator />
                    <ContextMenuGroup>
                        <ContextMenuItem>Download</ContextMenuItem>
                        <ContextMenuItem onClick={handleMoveFile} >Move to</ContextMenuItem>
                        <ContextMenuItem onClick={() => setRenameOpen(true)}>Rename</ContextMenuItem>
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