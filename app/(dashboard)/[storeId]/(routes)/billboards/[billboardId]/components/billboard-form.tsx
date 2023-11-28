"use client"
import React, {useState} from "react";
import * as z from "zod"
import {Billboard} from "@prisma/client";
import axios from "axios";
import {useForm} from "react-hook-form";
import {useParams, useRouter} from "next/navigation";
import {toast} from "react-hot-toast";
import {zodResolver} from "@hookform/resolvers/zod";
import {Heading} from "@/components/ui/heading";
import {Button} from "@/components/ui/button";
import {Trash} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {AlertModal} from "@/components/modals/alert-modal";
import {ApiAlert} from "@/components/ui/api-alert";
import {useOrgin} from "@/hooks/use-orgin";




const FormSchema = z.object({
    label: z.string().min(1, {message: "Name is required"}),
    imageUrl: z.string().min(1, {message: "Image URL is required"}),
})

type BillboardFormValues = z.infer<typeof FormSchema>

interface BillboardFormProps {
    initialData: Billboard | null
}

export const BillboardForm: React.FC<BillboardFormProps> = ({initialData}) => {
    const router = useRouter()
    const params = useParams()
    const origin = useOrgin()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initialData ? "Edit Billboard" : "Create Billboard"
    const description = initialData ? "Edit a Billboard" : "Add a new Billboard"
    const toastMessage = initialData ? "Billboard updated" : "Billboard created"
    const action = initialData ? "Save Changes" : "Create Billboard"


    const form = useForm<BillboardFormValues>({
        resolver: zodResolver(FormSchema),
        defaultValues: initialData || {
            label: "",
            imageUrl: ""
        }
    })


    const onSubmit = async (data: BillboardFormValues) => {
        try {
            setLoading(true)
            await axios.patch(`/api/stores/${params.storeId}`, data)
            router.refresh()
            toast.success('Store updated')
        }
        catch (error) {
            toast.error((error as Error).message)
        }
        finally {
            setLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/stores/${params.storeId}`)
            router.refresh()
            router.push('/')
            toast.success('Store deleted')
        }
        catch (error) {
            toast.error("Make sure you removed all products and categories first.")
        }
        finally {
            setLoading(false)
            setOpen(false)
        }
    }

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}/>
            <div className='flex items-center justify-between'>
                <Heading
                    title={title}
                    description='Manage your store settings'
                />
                <Button
                    disabled={loading}
                    variant='destructive'
                    size='sm'
                    onClick={() => {
                        setOpen(true)
                    }}
                >
                    <Trash className='h-4 w-4'/>
                </Button>
            </div>
            <Separator/>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
                    <div className='grid grid-cols-3 gap-8'>
                        <FormField
                            control={form.control}
                            name='label'
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder='Store name' {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={loading} className='ml-auto' type='submit'>
                        Save Changes
                    </Button>
                </form>
            </Form>
            <Separator/>
            <ApiAlert
                title='NEXT_PUBLIC_API_URL'
                description={`${origin}/api/${params.storeId}`}
                variant='public'/>
        </>
    )
}