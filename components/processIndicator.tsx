"use client";
import React, { useEffect } from 'react';
import { useFileStore } from '@/lib/store/FolderFileStore';
import { toast } from 'sonner';
toast

function ProcessIndicator() {
    const { subLoading, subResponse, resetSubresponse } = useFileStore();
    useEffect(() => {
        if (subResponse.message && subResponse.suc) {
            if (!subResponse.suc) {
                toast.error(subResponse.message);
                return;
            }

            toast.success(subResponse.message);
        }

        return resetSubresponse();

    }, [subLoading])
    return (
        <></>
    )
}

export default ProcessIndicator