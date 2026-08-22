"use client"
import React from 'react'
import { ChevronDownIcon, FilePlus2Icon, FolderPlusIcon, PlusIcon } from 'lucide-react'
import { ButtonGroup } from './ui/button-group'
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSearchParams, useRouter } from 'next/navigation'



function NewItemButton() {
    const router = useRouter();
    function CreateNewFile() {
        router.push('?ni=file');
    }
    function CreateNewFolder() {
        router.push('?ni=folder');
    }
    return (
        <ButtonGroup>
            <Button onClick={CreateNewFolder} >
                <PlusIcon />
                <span>New</span>
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger render={<Button size={"icon"} variant="default" />}>
                    <ChevronDownIcon />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuGroup>
                        <DropdownMenuItem onClick={CreateNewFile} >
                            <FilePlus2Icon />
                            <span>New File</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={CreateNewFolder} >
                            <FolderPlusIcon />
                            <span>New Folder</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </ButtonGroup>
    )
}

export default NewItemButton