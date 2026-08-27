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
import { Agent } from '@/lib/types/agent';

export interface AgentListProps {
    data: Agent[];
    className?: string;
    onEdit?: (agent: Agent) => void;
    onDelete?: (agent: Agent) => void;
    isLoading?: boolean;
}

function AgentList({ data, className, onEdit, onDelete, isLoading }: AgentListProps) {
    return (
        <Table className={cn(className, "border")}>
            <TableCaption>
                {isLoading ? "Loading agents..." : data.length === 0 ? "No agents found." : "A list of your agents."}
            </TableCaption>
            <TableHeader className='bg-accent border rounded-2xl'>
                <TableRow>
                    <TableHead className="w-[15rem] border">Agent Name</TableHead>
                    <TableHead className='w-[6rem] border'>Status</TableHead>
                    <TableHead className='border'>Target Folder</TableHead>
                    <TableHead className="w-[6rem] border">Scopes</TableHead>
                    <TableHead className='w-[10rem] border text-right'>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((item, key) => {
                    const agentId = item.agent_id || item._id || item.id || String(key);
                    const name = item.name || "Unnamed Agent";
                    const target = item.path || item.target || item.targetFolder || "/";
                    const scopes = item.scopes || item.scope || "r";
                    const isActive = item.isActive !== undefined ? item.isActive : item.active !== undefined ? item.active : true;


                    return (
                        <TableRow key={agentId}>
                            <TableCell className="font-medium border">{name}</TableCell>
                            <TableCell className="border">
                                {isActive ? (
                                    <Badge variant="secondary" className="bg-emerald-600/20 text-emerald-500 hover:bg-emerald-600/30 border-emerald-500/30">
                                        Active
                                    </Badge>
                                ) : (
                                    <Badge variant="secondary" className="bg-muted text-muted-foreground">
                                        Inactive
                                    </Badge>
                                )}
                            </TableCell>
                            <TableCell className='border'>{target}</TableCell>
                            <TableCell className="border"><Badge variant="secondary">{scopes}</Badge></TableCell>
                            <TableCell className='flex justify-end gap-3 items-center border'>
                                <Button 
                                    size={"icon-sm"} 
                                    className={"group"} 
                                    variant={"outline"}
                                    onClick={() => onEdit && onEdit(item)}
                                >
                                    <PenIcon className='text-muted-foreground group-hover:text-foreground h-4 w-4' />
                                </Button>
                                <Button 
                                    size={"icon-sm"} 
                                    className={"group"} 
                                    variant={"outline"}
                                    onClick={() => onDelete && onDelete(item)}
                                >
                                    <Trash2Icon className='text-destructive/60 group-hover:text-destructive h-4 w-4' />
                                </Button>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}

export default AgentList;