"use client";

import React from "react";
import {Plus} from "lucide-react";
import {useRouter, useParams} from "next/navigation";
import {Heading} from "@/components/ui/heading";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {CategoryColumn, columns} from "./columns";
import {DataTable} from "@/components/ui/data-table";
import {ApiList} from "@/components/ui/api-list";


interface CategoryClientProps {
    data: CategoryColumn[]
}

export const CategoryClient: React.FC<CategoryClientProps> = ({ data}) => {
    const router = useRouter()
    const params = useParams()

    return (
        <>
            <div className='flex items-center justify-between'>
                <Heading title={`Billboards (${data.length})`}
                         description='Manage billboards for your store'
                />
                <Button
                onClick={() => router.push(`/${params.storeId}/billboards/new`)}
                >
                    <Plus className='mr-2 h-4 w-4'/>
                    Add New
                </Button>
            </div>
            <Separator/>
            <DataTable searchKey='label' columns={columns} data={data}/>
            <Heading title='Api' description='Api calss for billboards'/>
            <Separator/>
            <ApiList entityName='billboards' entityIdName='billboardId'/>
        </>
    )
}