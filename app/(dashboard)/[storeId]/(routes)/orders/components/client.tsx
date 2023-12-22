"use client";

import React from "react";
import {Heading} from "@/components/ui/heading";
import {Separator} from "@/components/ui/separator";
import {OrderColumn, columns} from "./columns";
import {DataTable} from "@/components/ui/data-table";


interface BillboardClientProps {
    data: OrderColumn[]
}

export const OrdersClient: React.FC<BillboardClientProps> = ({ data}) => {

    return (
        <>
            <div className='flex items-center justify-between'>
                <Heading title={`Products (${data.length})`}
                         description='Manage products for your store'
                />
            </div>
            <Separator/>
            <DataTable searchKey='products' columns={columns} data={data}/>
        </>
    )
}