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

function MoveFileDialogue() {
    const params = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const [isOpen, setOpen] = useState(false);
    const [value, setValue] = useState("");
    const [fileId, setFileId] = useState<string>();
    const { currentPath } = useTopPanelStore();
    const { moveFile, subError, subResponse } = useFileStore();

    useEffect(() => {
        if (params.has("mt")) {
            setOpen(true);
            setFileId(`${params.get("mt")}`);
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

    async function handleMove() {
        toast.info("Moving your file");

        setOpen(false);

        await moveFile(fileId,currentPath,value);

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
                    <DialogTitle>Move File</DialogTitle>
                    <DialogDescription>
                        Move your file to another directory.
                    </DialogDescription>
                </DialogHeader>
                <Input placeholder="/path/to/store" onChange={(e) => setValue(e.target.value)} />
                <DialogFooter>
                    <DialogClose render={<Button variant={"secondary"} >Cancel</Button>}>
                    </DialogClose>
                    <Button variant={"default"} onClick={handleMove}>Move</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default MoveFileDialogue