"use client"
import {
    ArchiveIcon,
    FileCodeIcon,
    FileIcon,
    FileJsonIcon,
    FileTextIcon,
    ImageIcon,
    MusicIcon,
    TableIcon,
    VideoIcon,
} from 'lucide-react'
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


    const handleFileRename = async () => {
        setRenameOpen(false);
        toast.info("Renaming file");
        await renameFile(filename, currentPath, nameValue);
    }

    const handleFileOpenTab = () => {
        setBackPath(`/dashboard/myair/${currentPath}`);
        window.open(`${window.location.origin}/dashboard/media/${fileid}`, '_blank',);
    }

    const handleFileOpenWindow = () => {
        setBackPath(`/dashboard/myair/${currentPath}`);
        window.open(`${window.location.origin}/dashboard/media/${fileid}`, `MediaViewer ${filename}`, "width=1000,height=700,left=100,top=100,resizable=yes");
    }


    function getFileIcon(mimeType = "") {
        if (mimeType.startsWith("image/")) {
            return ImageIcon;
        }

        if (mimeType.startsWith("video/")) {
            return VideoIcon;
        }

        if (mimeType.startsWith("audio/")) {
            return MusicIcon;
        }

        // if (mimeType.startsWith("text/")) {
        //     return FileTextIcon;
        // }

        switch (mimeType) {
            // Documents
            case "application/pdf":
            case "application/msword":
            case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                return FileTextIcon;

            // Spreadsheets
            case "text/csv":
            case "application/vnd.ms-excel":
            case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                return TableIcon;

            // Presentations
            case "application/vnd.ms-powerpoint":
            case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
                return FileTextIcon;

            // Code
            case "application/javascript":
            case "text/javascript":
            case "application/typescript":
            case "text/typescript":
            case "text/css":
            case "text/html":
            case "application/x-httpd-php":
                return FileCodeIcon;

            // JSON
            case "application/json":
                return FileJsonIcon;

            // Archives
            case "application/zip":
            case "application/x-rar-compressed":
            case "application/x-7z-compressed":
            case "application/gzip":
            case "application/x-tar":
                return ArchiveIcon;

            default:
                return FileIcon;
        }
    }

    const FileTypeIcon = getFileIcon(filetype);

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
                        <FileTypeIcon className='w-6 h-6 stroke-1 text-muted-foreground' />
                    </div>
                    <span className='font-sans  max-w-full line-clamp-2 text-center'>{filename}</span>
                </ContextMenuTrigger>
                <ContextMenuContent className={"data-[starting-style]:opacity-0 data-[starting-style]:scale-95 data-[ending-style]:opacity-0 data-[ending-style]:scale-95 transition duration-150"}>
                    <ContextMenuGroup>
                        <ContextMenuSub>
                            <ContextMenuSubTrigger>Open</ContextMenuSubTrigger>
                            <ContextMenuSubContent>
                                <ContextMenuItem onClick={handleFileOpen} >Open</ContextMenuItem>
                                <ContextMenuItem onClick={handleFileOpenTab}>Open in new Tab</ContextMenuItem>
                                <ContextMenuItem onClick={handleFileOpenWindow}>Open in new Window</ContextMenuItem>
                            </ContextMenuSubContent>
                        </ContextMenuSub>
                    </ContextMenuGroup>
                    <ContextMenuSeparator />
                    <ContextMenuGroup>
                        {/* <ContextMenuItem>Download</ContextMenuItem> */}
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