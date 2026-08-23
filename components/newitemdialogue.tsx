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
import { useTopPanelStore } from '@/lib/store/TopPanelStore';
import { useFileStore } from '@/lib/store/FolderFileStore';
import { Loader2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface responseInterface {
    message: string,
    suc: boolean
}

function NewDialogue() {
    const params = useSearchParams();
    const [fileDialogue, setFileDialogue] = useState(false);
    const [folderDialogue, setFolderDialogue] = useState(false);
    const [foldername, setFoldername] = useState("");
    const currentPath: String = useTopPanelStore((s) => s.currentPath);
    const response: responseInterface = useFileStore((s) => s.response);
    const isLoading = useFileStore((s) => s.isLoading);
    const router = useRouter()
    useEffect(() => {
        if (params.has("ni")) {
            let type = params.get("ni")?.toString();
            type == "file" ? setFileDialogue(true) : setFolderDialogue(true);
        }
    }, [params])

    function createFolder() {
        useFileStore.getState().createFolder(currentPath,foldername);
    }

    useEffect(() => {
        if (response?.suc) {
            alert(response?.message);
            setFolderDialogue(false);
            router.push(`/dashboard/myair${currentPath}/${foldername}`);
        }
    }, [response])

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
                        <Input type='text' placeholder='e.g, Pictures' onChange={(e)=>setFoldername(e.target.value)} />
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose render={<Button type="button" variant={"secondary"}>Close</Button>} />
                        <Button disabled={isLoading ? true : false} onClick={createFolder} variant={'default'}>
                            {
                                isLoading ?
                                    <>
                                        <Loader2Icon />
                                        <span>Creating...</span>
                                    </>
                                    :
                                    <span>Create</span>
                            }
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </section>
    )
}

export default NewDialogue