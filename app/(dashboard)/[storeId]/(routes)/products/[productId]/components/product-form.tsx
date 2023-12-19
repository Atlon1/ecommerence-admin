"use client"
import React, {useState} from "react";
import * as z from "zod"
import {Product, Image} from "@prisma/client";
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
import ImageUpload from "@/components/ui/image-upload";

const FormSchema = z.object({
    name: z.string().min(1, {message: "Name is required"}),
    images: z.object({url: z.string()}).array(),
    price: z.coerce.number().min(1, {message: "Price must be greater than 0"}),
    categoryId: z.string().min(1),
    colorId: z.string().min(1),
    sizeId: z.string().min(1),
    isFutered: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional()
})

type ProductFormValues = z.infer<typeof FormSchema>

interface ProductFormProps {
    initialData: Product & {
        images: Image[]
    } | null
}

export const ProductForm: React.FC<ProductFormProps> = ({initialData}) => {
    const router = useRouter()
    const params = useParams()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initialData ? "Edit Product" : "Create Product"
    const description = initialData ? "Edit a Product" : "Add a new Product"
    const toastMessage = initialData ? "Product updated" : "Product created"
    const action = initialData ? "Save Changes" : "Create Product"


    const form = useForm<ProductFormValues>({
        resolver: zodResolver(FormSchema),
        defaultValues: initialData ? {
            ...initialData,
            price: parseFloat(String(initialData?.price)),
        } : {
            name: '',
            images: [],
            price: 0,
            categoryId: '',
            colorId: '',
            sizeId: '',
            isFutered: false,
            isArchived: false
        }
    })


    const onSubmit = async (data: ProductFormValues) => {
        try {
            setLoading(true)
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data)
            } else {
                await axios.post(`/api/${params.storeId}/billboards`, data)
            }
            router.refresh()
            router.push(`/${params.storeId}/billboards`)
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
            await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`)
            router.refresh()
            router.push(`/${params.storeId}/billboards`)
            toast.success('Billboard deleted')
        }
        catch (error) {
            toast.error("Make sure you removed all categories using this billboard first.")
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
                    <FormField
                        control={form.control}
                        name='images'
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Images</FormLabel>
                                <FormControl>
                                    <ImageUpload
                                        value={field.value.map((item) => item.url)}
                                        disabled={loading}
                                        onChange={(url) => {
                                            field.onChange([...field.value, {url}])
                                        }}
                                        onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !== url)])}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <div className='grid grid-cols-3 gap-8'>
                        <FormField
                            control={form.control}
                            name='label'
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Label</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder='Billboard label' {...field}/>
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