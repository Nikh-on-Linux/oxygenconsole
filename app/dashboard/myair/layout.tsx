import React from 'react';
import NewDialogue from '@/components/newitemdialogue';
import MoveFileDialogue from '@/components/movefiledialogue';

function MyAirLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
        <NewDialogue />
        <MoveFileDialogue />
        {children}
        </>
    )
}

export default MyAirLayout