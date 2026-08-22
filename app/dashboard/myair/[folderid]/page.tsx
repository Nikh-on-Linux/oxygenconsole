"use client"
import React, { useEffect } from 'react'
import DirectoryWindow from '@/components/directorywindow';
import { useParams } from 'next/navigation';
import { useTopPanelStore } from '@/lib/store/TopPanelStore';
function DirectoryPage() {
  const {folderid} = useParams();

  useEffect(() => {
    useTopPanelStore.getState().setPageTitle("Foldername");
    useTopPanelStore.getState().setBreadCrumbs(true);
    useTopPanelStore.getState().setIsNested(true);
    return ()=> useTopPanelStore.getState().reset();
  }, [])
  return (
    <section className="h-full w-full overflow-x-hidden overflow-y-auto">
      <DirectoryWindow>
        <div></div>
      </DirectoryWindow>
    </section>
  )
}

export default DirectoryPage