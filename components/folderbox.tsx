"use client"
import React from 'react';
import { FolderIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

function FolderBox({ foldername = "Sample Folder", folderid }: { foldername?: String, folderid?: String }) {
  const router = useRouter();
  return (
    <div onClick={()=>{router.push(`/dashboard/myair/${folderid}`)}} className='max-w-42 hover:border-foreground/20 overflow-hidden transition-all duration-200 select-none relative px-4 py-4 aspect-square w-full bg-card rounded-xl border border-border/50' >
      <FolderIcon className='w-40 z-0 h-40 absolute opacity-50 -bottom-12 -right-8 stroke-[0.5] text-background' />
      <span className='z-10 font-sans font-medium line-clamp-3 max-w-full' >{foldername}</span>
    </div>
  )
}

export default FolderBox