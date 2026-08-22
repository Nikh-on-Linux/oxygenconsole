"use client"
import React, { useState } from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb';

function PathNavigation() {
    const [isEditing, setEditing] = useState(false);
    return (
        <div onDoubleClick={()=>setEditing(!isEditing)} className='bg-card transition-all px-4 py-1.5 rounded-xl border' >
            {
                !isEditing ? 
                <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink href="#">
                            Build Your Application
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            :
            <input type='text' className='outline-none ' />
            }
        </div>
    )
}

export default PathNavigation