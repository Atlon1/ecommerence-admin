"use client"
import axios from "axios";
import {useState} from "react";
import {Copy, Edit, MoreHorizontal, Trash} from "lucide-react";
import {toast} from "react-hot-toast";
import {useRouter, useParams} from "next/navigation";
import {SizeColumn} from "./columns";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {AlertModal} from "@/components/modals/alert-modal";
import {Button} from "@/components/ui/button";





interface setActionProps {
    data:SizeColumn
}


export const CellAction: React.FC<setActionProps> = ({
                                                         data
                                                     }) => {
    const router = useRouter()
    const params = useParams()

    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const onCopy = (id:string) => {
        navigator.clipboard.writeText(id)
        toast.success('Size Id copied to clipboard')
    }

    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/sizes/${data.id}`)
            router.refresh()
            toast.success('Size deleted')
        }
        catch (error) {
            toast.error("Make sure you removed all product using this size first.")
        }
        finally {
            setLoading(false)
            setOpen(false)
        }
    }



    return (
        <>
            <AlertModal isOpen={open}
                        onClose={() => setOpen(false)}
                        onConfirm={onDelete}
                        loading={loading}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant='ghost' className='h-8 w-8 p-0'>
                        <span className='sr-only'>Open Menu</span>
                        <MoreHorizontal className='h-4 w-4'/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                    <DropdownMenuLabel>
                        Actions
                    </DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onCopy(data.id)}>
                        <Copy className='mr-2 h-4 w-4'/>
                        Copy Id
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/${params.storeId}/sizes/${data.id}`)}>
                        <Edit className='mr-2 h-4 w-4'/>
                        Update
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpen(true)}>
                        <Trash className='mr-2 h-4 w-4'/>
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}