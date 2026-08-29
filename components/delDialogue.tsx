"use client"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import React, { useEffect, useState } from 'react';
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useTopPanelStore } from "@/lib/store/TopPanelStore";
import { useFileStore } from "@/lib/store/FolderFileStore";
import { toast } from "@/components/ui/sonner"

function DeleteFileDialogue() {
    const params = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const [isOpen, setOpen] = useState(false);
    const [fileId, setFileId] = useState<string>();
    const { currentPath } = useTopPanelStore();
    const { deleteFile, subError, subResponse } = useFileStore();

    useEffect(() => {
        if (params.has("defi")) {
            setOpen(true);
            setFileId(`${params.get("defi")}`);
            return;
        }

        setOpen(false);
        setFileId("");
        return;
    }, [params])
    useEffect(() => {
        if (!isOpen) {
            replace(`${pathname}`, { scroll: false });
            return;
        }
    }, [isOpen])

    async function handleDelete() {
        toast.info("Deleting your file");

        setOpen(false);

        await deleteFile(fileId,currentPath);

        if(subError){
            toast.error(subError)
            return;
        }

        toast.success(subResponse.message);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete File</DialogTitle>
                    <DialogDescription>
                        File deleted cannot be recovered.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose render={<Button variant={"secondary"} >Cancel</Button>}>
                    </DialogClose>
                    <Button variant={"destructive"} onClick={handleDelete}>Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteFileDialogue;