"use client"
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import UploadPage from '@/app/dashboard/upload/page';
import { Input } from './ui/input';
import { Button } from './ui/button';

function NewDialogue() {
    const params = useSearchParams();
    const [fileDialogue, setFileDialogue] = useState(false);
    const [folderDialogue, setFolderDialogue] = useState(false);
    useEffect(() => {
        if (params.has("ni")) {
            let type = params.get("ni")?.toString();
            type == "file" ? setFileDialogue(true) : setFolderDialogue(true);
        }
    }, [params])
    return (
        <section>
            <Dialog open={fileDialogue} onOpenChange={setFileDialogue} >
                <DialogContent className={"sm:max-w-md"} >
                    <DialogHeader>
                        <DialogTitle>Upload File</DialogTitle>
                        <DialogDescription>
                            The file will be uploaded in the current directory.
                        </DialogDescription>
                    </DialogHeader>
                    <UploadPage />
                </DialogContent>
            </Dialog>

            {/* Folder Dialogue */}

            <Dialog open={folderDialogue} onOpenChange={setFolderDialogue} >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create new Folder</DialogTitle>
                        <DialogDescription>
                            The new folder will be created in current directory.
                        </DialogDescription>
                        <span className='mt-4'>Folder name</span>
                        <Input type='text' placeholder='e.g, Pictures' />
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose render={<Button type="button" variant={"secondary"}>Close</Button>} />
                        <Button variant={'default'}>Create</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </section>
    )
}

export default NewDialogue