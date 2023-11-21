"use client"
import React, {useState} from "react";
import * as z from "zod"
import {Store} from "@prisma/client";
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




const FormSchema = z.object({
    name: z.string().min(1, {message: "Name is required"}),
})

type SettingFormValues = z.infer<typeof FormSchema>

interface SettingsFormProps {
    initialData: Store
}

export const SettingsForm: React.FC<SettingsFormProps> = ({initialData}) => {
    const router = useRouter()
    const params = useParams()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const form = useForm<SettingFormValues>({
        resolver: zodResolver(FormSchema),
        defaultValues: initialData
    })


    const onSubmit = async (data: SettingFormValues) => {
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

    return (
        <>
            <div className='flex items-center justify-between'>
                <Heading
                    title='Settings'
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
                            name='name'
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
        </>
    )
}