"use client"
import React, { useEffect, useState } from 'react';
import { ChevronRightIcon, FolderIcon } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
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
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useFileStore } from '@/lib/store/FolderFileStore';
import { useTopPanelStore } from '@/lib/store/TopPanelStore';
import { toast } from 'sonner';

function FolderBox({ foldername = "Sample Folder", folderid }: { foldername?: string, folderid?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [folderpath, setFolderPath] = useState("");
  const [nameValue, setNameValue] = useState("");
  const [pathValue, setPathValue] = useState("");
  const [isRenameOpen, setRenameOpen] = useState(false);
  const [isMoveOpen, setMoveOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const { currentPath } = useTopPanelStore();
  const { renameFolder, subResponse, subLoading, moveFolder, resetItems, deleteFolder, resetSubresponse } = useFileStore();
  useEffect(() => {
    setFolderPath(`${pathname}/${foldername}`);
  }, [pathname])

  async function handleRenameFolder() {
    setRenameOpen(false);
    toast.info("Renaming Folder");
    await renameFolder(nameValue, `${currentPath}/${foldername}`);
  }

  async function handleFolderMove() {
    setMoveOpen(false);
    toast.info("Moving folder");
    await moveFolder(pathValue, `${folderid}`);
  }

  async function handleDeleteFolder(){
    setDeleteOpen(false);
    toast.info("Folder deletion in progress");
    await deleteFolder(`${folderid}`);
  }
  return (
    <>
      <Dialog open={isRenameOpen} onOpenChange={setRenameOpen} >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Folder</DialogTitle>
          </DialogHeader>
          <Input placeholder='e.g, myfolder' onChange={(e) => setNameValue(e.target.value)} />
          <DialogFooter>
            <DialogClose render={<Button variant={"secondary"}>Cancel</Button>} />
            <Button onClick={handleRenameFolder} >Rename</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isDeleteOpen} onOpenChange={setDeleteOpen} >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Folder</DialogTitle>
            <DialogDescription>All sub folders and files present inside this folder will be deleted and cannot be recovered again.</DialogDescription>
          </DialogHeader>
          {/* <Input placeholder='e.g, myfolder' onChange={(e) => setNameValue(e.target.value)} /> */}
          <DialogFooter>
            <DialogClose render={<Button variant={"secondary"}>Cancel</Button>} />
            <Button variant={"destructive"} onClick={handleDeleteFolder} >I understand, Delete folder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isMoveOpen} onOpenChange={setMoveOpen} >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move Folder</DialogTitle>
          </DialogHeader>
          <Input placeholder='Enter: Path/To/Move/This/Folder' onChange={(e) => setPathValue(e.target.value)} />
          <DialogFooter>
            <DialogClose render={<Button variant={"secondary"}>Cancel</Button>} />
            <Button onClick={handleFolderMove} >Move</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ContextMenu>
        <ContextMenuTrigger>
          <div onClick={() => {
            resetItems();
            router.push(folderpath);
          }} className='group max-w-42 hover:border-foreground/20 flex flex-col justify-between overflow-hidden transition-all duration-200 select-none relative px-4 py-4 aspect-square w-full bg-card rounded-xl border border-border/50' >
            <FolderIcon className='w-40 z-0 h-40 absolute opacity-50 -bottom-12 -right-8 stroke-[0.5] text-foreground/10 transition-all group-hover:-bottom-10 group-hover:-right-6 group-hover:text-foreground/20' />
            <div className='flex items-center justify-between' >
              <div className='bg-accent w-fit aspect-square px-2 flex items-center justify-center rounded-xl' >
                <FolderIcon className='w-5 h-5 text-foreground/50 transition-all group-hover:text-foreground/80' />
              </div>
              <ChevronRightIcon className='w-4 h-4 text-foreground/50 transition-all group-hover:text-foreground/80' />
            </div>
            <span className='z-10 font-sans font-medium line-clamp-3 max-w-full' >{foldername}</span>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => setRenameOpen(true)}>Rename</ContextMenuItem>
          <ContextMenuItem onClick={() => setMoveOpen(true)}>Move to</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={() => setDeleteOpen(true)} >
            <span className='text-destructive' >Delete</span>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </>
  )
}

export default FolderBox