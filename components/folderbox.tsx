"use client"
import React, { useEffect, useState } from 'react';
import { ChevronRightIcon, FolderIcon } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

function FolderBox({ foldername = "Sample Folder", folderid }: { foldername?: String, folderid?: String }) {
  const router = useRouter();
  const pathname = usePathname();
  const [folderpath, setFolderPath] = useState("");
  useEffect(() => {
    setFolderPath(`${pathname}/${foldername}`);
  }, [pathname])
  return (
    <div onClick={() => { router.push(folderpath) }} className='group max-w-42 hover:border-foreground/20 flex flex-col justify-between overflow-hidden transition-all duration-200 select-none relative px-4 py-4 aspect-square w-full bg-card rounded-xl border border-border/50' >
      <FolderIcon className='w-40 z-0 h-40 absolute opacity-50 -bottom-12 -right-8 stroke-[0.5] text-foreground/10 transition-all group-hover:-bottom-10 group-hover:-right-6 group-hover:text-foreground/20' />
      <div className='flex items-center justify-between' >
        <div className='bg-accent w-fit aspect-square px-2 flex items-center justify-center rounded-xl' >
          <FolderIcon className='w-5 h-5 text-foreground/50 transition-all group-hover:text-foreground/80' />
        </div>
        <ChevronRightIcon className='w-4 h-4 text-foreground/50 transition-all group-hover:text-foreground/80' />
      </div>
      <span className='z-10 font-sans font-medium line-clamp-3 max-w-full' >{foldername}</span>
    </div>
  )
}

export default FolderBox