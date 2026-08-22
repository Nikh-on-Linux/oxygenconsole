import React from 'react'
import DirectoryWindow from '@/components/directorywindow'
async function DirectoryPage({
  params,
}: {
  params: Promise<{ folderid: string }>
}) {
  const { folderid } = await params
  return (
    <section className="h-full w-full overflow-x-hidden overflow-y-auto">
      <DirectoryWindow>
        <div></div>
      </DirectoryWindow>
    </section>
  )
}

export default DirectoryPage