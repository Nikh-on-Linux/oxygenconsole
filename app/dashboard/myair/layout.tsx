import React from 'react';
import NewDialogue from '@/components/newitemdialogue';
import MoveFileDialogue from '@/components/movefiledialogue';
import DeleteFileDialogue from '@/components/delDialogue';

function MyAirLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
        <NewDialogue />
        <MoveFileDialogue />
        <DeleteFileDialogue />
        {children}
        </>
    )
}

export default MyAirLayout