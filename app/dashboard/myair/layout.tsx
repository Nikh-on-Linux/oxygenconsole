import React from 'react';
import NewDialogue from '@/components/newitemdialogue';

function MyAirLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
        <NewDialogue />
        {children}
        </>
    )
}

export default MyAirLayout