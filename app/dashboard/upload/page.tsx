"use client"
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { CloudUploadIcon, CrossIcon, FileIcon, FileSliders, PlusIcon, XIcon } from 'lucide-react'
import React, { useRef, useState } from 'react'

interface fileDetails {
    filename: String,
    filetype: String
}

function UploadPage() {
    const inputFileRef = useRef<HTMLInputElement>(null);
    const [fileSelected, setSelected] = useState(false);
    const [fileDetails, setDetails] = useState<fileDetails | null>(null);
    function handleFileInput() {
        if (inputFileRef) {
            inputFileRef?.current?.click();
        }
    }
    function handleInputChange(e: any) {
        const filename: String = e.target.files[0].name;
        const filetype: String = e.target.files[0].type;
        setDetails({
            filename: filename,
            filetype: filetype
        })
        setSelected(true);
    }
    function removeInputFile(e: any) {
        if (inputFileRef) {
            inputFileRef?.current?.reset();
            setSelected(false);
            setDetails(null);
        }
    }
    return (
        <section className=' w-full px-4 flex items-center justify-center overflow-y-auto' >
            <div className=' lg:max-w-[60rem] w-full aspect-video flex items-center justify-center border-border border-2 border-dashed rounded-lg' >
                {
                    !fileSelected ?
                        <>
                            <input type='file' className='hidden' ref={inputFileRef} onChange={handleInputChange} />
                            <Button variant={"default"} onClick={() => { handleFileInput() }} >
                                <PlusIcon />
                                <span>Browse File</span>
                            </Button></>
                        :
                        <div className='flex flex-col gap-5' >
                            <div className='flex rounded-md items-center justify-center gap-2 bg-accent px-3 py-1.5 border border-border' >
                                <FileIcon className='w-4' />
                                <span className='font-sans lg:max-w-[20rem] max-w-[8rem] line-clamp-1' >{fileDetails?.filename}</span>
                                <Separator orientation='vertical' />
                                <XIcon onClick={removeInputFile} className='w-4 cursor-pointer hover:text-accent-foreground/70 rounded-full aspect-square' />
                            </div>
                            <Button className={" mx-auto"} >
                                <CloudUploadIcon />
                                <span>Upload</span>
                            </Button>
                        </div>
                }
            </div>
        </section>
    )
}

export default UploadPage