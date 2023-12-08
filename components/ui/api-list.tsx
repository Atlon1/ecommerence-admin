"use client"

import {useParams} from "next/navigation";
import {useOrgin} from "@/hooks/use-orgin";
import {ApiAlert} from "@/components/ui/api-alert";

interface ApiListProps {
    entityName: string
    entityIdName: string
}

export const ApiList: React.FC<ApiListProps> = ({
                                                    entityName,
                                                    entityIdName
                                                }) => {

    const params = useParams();
    const origin = useOrgin();
    const baseUrl = `${origin}/api/${params.storeId}`


    return (
        <>
            <ApiAlert
                title='GET'
                description={`${baseUrl}/${entityName}`}
                variant='public'
            />
            <ApiAlert
                title='GET'
                description={`${baseUrl}/${entityName}/{${entityIdName}}`}
                variant='public'
            />
        </>
    )
}