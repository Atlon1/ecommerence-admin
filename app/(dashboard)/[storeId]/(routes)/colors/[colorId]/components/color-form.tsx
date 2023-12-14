"use client"
import React, {useState} from "react";
import * as z from "zod"
import {Color} from "@prisma/client";
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


const FormSchema = z.object({
    name: z.string().min(1, {message: "Name is required"}),
    value: z.string().min(4 ).regex(/^#/, {message: "String must be a valid hex code"}),
})

type ColorFormValues = z.infer<typeof FormSchema>

interface ColorFormProps {
    initialData: Color | null
}

export const ColorForm: React.FC<ColorFormProps> = ({initialData}) => {
    const router = useRouter()
    const params = useParams()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initialData ? "Edit color" : "Create color"
    const description = initialData ? "Edit a color" : "Add a new color"
    const toastMessage = initialData ? "Color updated" : "Color created"
    const action = initialData ? "Save Changes" : "Create Color"


    const form = useForm<ColorFormValues>({
        resolver: zodResolver(FormSchema),
        defaultValues: initialData || {
            name: "",
            value: ""
        }
    })


    const onSubmit = async (data: ColorFormValues) => {
        try {
            setLoading(true)
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`, data)
            } else {
                await axios.post(`/api/${params.storeId}/sizes`, data)
            }
            router.refresh()
            router.push(`/${params.storeId}/sizes`)
            toast.success(toastMessage)
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
            await axios.delete(`/api/${params.storeId}/sizes/${params.siezeId}`)
            router.refresh()
            router.push(`/${params.storeId}/sizes`)
            toast.success('Sizes deleted')
        }
        catch (error) {
            toast.error("Make sure you removed all product using this color first.")
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
                    description={description}
                />

                {initialData && (
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
                )}

            </div>
            <Separator/>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
                    <div className='grid grid-cols-3 gap-8'>
                        <FormField
                            control={form.control}
                            name='name'
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder='Color name' {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='value'
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Value</FormLabel>
                                    <FormControl>
                                        <div className='flex items-center gap-x-4'>
                                            <Input disabled={loading} placeholder='Color value' {...field}/>
                                            <div className='border p-4 rounded-full'
                                            style={{backgroundColor: field.value}}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={loading} className='ml-auto' type='submit'>
                        {action}
                    </Button>
                </form>
            </Form>

        </>
    )
}