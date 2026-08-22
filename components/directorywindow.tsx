"use client";
import React from 'react';
import FolderBox from './folderbox';
import FileBox from './filebox';

function DirectoryWindow() {
  return (
    <div className='grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-4 gap-y-10' >
        <FolderBox />
        <FileBox />
        <FileBox />
        <FileBox />
        <FileBox />
        <FileBox />
        <FileBox />
        <FileBox />
        <FileBox />
        <FileBox />
        <FileBox />
        <FileBox />
    </div>
  )
}

export default DirectoryWindow