"use client"
import React from 'react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { PenIcon, Trash2Icon } from 'lucide-react';

export interface datatype {
    name: String,
    isActive: Boolean,
    target: String,
    scopes: String
}

function AgentList({ data, className }: { data: Array<datatype>, className?: String }) {
    return (
        <Table className={cn(className, "border")} >
            <TableCaption>A list of your agents.</TableCaption>
            <TableHeader className='bg-accent border rounded-2xl'>
                <TableRow className='' >
                    <TableHead className="w-[15rem] border">Agent Name</TableHead>
                    <TableHead className='w-[6rem] border'>Status</TableHead>
                    <TableHead className='border'>Target Folder</TableHead>
                    <TableHead className="w-[6rem] border">scopes</TableHead>
                    <TableHead className='w-[10rem] border text-right'>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    data.map((item, key) => {
                        return (
                            <TableRow key={key} >
                                <TableCell className="font-medium border">{item.name}</TableCell>
                                <TableCell>
                                    {
                                        item.isActive ? <Badge variant="secondary" className={`${item.isActive ? "bg-green-800" : ""}`}>Active</Badge> : <Badge variant="secondary">Inactive</Badge>
                                    }
                                </TableCell>
                                <TableCell className='border'>{item.target}</TableCell>
                                <TableCell className="border"><Badge variant="secondary">{item.scopes}</Badge></TableCell>
                                <TableCell className='flex justify-end gap-3 items-center'>
                                    <Button size={"icon-sm"} className={"group"} variant={"outline"} >
                                        <PenIcon className='text-muted-foreground group-hover:text-foreground' />
                                    </Button>
                                    <Button size={"icon-sm"} className={"group"} variant={"outline"} >
                                        <Trash2Icon className='text-destructive/60 group-hover:text-destructive' />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )
                    })
                }
            </TableBody>
        </Table>
    )
}

export default AgentList