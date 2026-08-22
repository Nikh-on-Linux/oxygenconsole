"use client"
import DirectoryWindow from '@/components/directorywindow'
import { useTopPanelStore } from '@/lib/store/TopPanelStore';
import React, { useEffect } from 'react';

function MyAir() {
  useEffect(() => {
    useTopPanelStore.getState().setPageTitle("My Air");
    useTopPanelStore.getState().setBreadCrumbs(true);
    return () => useTopPanelStore.getState().reset();
  }, [])
  return (
    <section className='w-full h-full overflow-x-hidden overflow-y-auto px-4 py-2' >
      <DirectoryWindow />
    </section>
  )
}

export default MyAir