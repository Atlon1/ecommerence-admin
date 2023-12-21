import {NextResponse} from "next/server";
import {auth} from '@clerk/nextjs'
import prismadb from "@/lib/prismadb";

export async function POST(
    req: Request,
    {params}: {params: {storeId: string}}
) {
    try {
        const {userId} = auth()
        const body = await req.json()

        const {
            name,
            price,
            categoryId,
            colorId,
            sizeId,
            images,
            isFutered,
            isArchived

        } = body

        if (!userId) {
            return new NextResponse('Unauthenticated', {status: 401})
        }

        if (name) {
            return new NextResponse('Name is required', {status: 400})
        }
        if (!images || !images.length) {
            return new NextResponse('Images is required', {status: 400})
        }
        if (!price) {
            return new NextResponse('Price is required', {status: 400})
        }
        if (!categoryId) {
            return new NextResponse('Category ID is required', {status: 400})
        }
        if (!sizeId) {
            return new NextResponse('Size ID is required', {status: 400})
        }
        if (!colorId) {
            return new NextResponse('Color ID is required', {status: 400})
        }

        if (!params.storeId) {
            return new NextResponse('Store ID is required', {status: 400})
        }
        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if (!storeByUserId) {
            return new NextResponse('Unauthorized', {status: 403})
        }

        const product = await prismadb.product.create({
            data: {
                name,
                price,
                isArchived,
                isFutered,
                categoryId,
                colorId,
                sizeId,
                storeId: params.storeId,
                images : {
                    createMany: {
                        data: [
                            ...images.map((image: {url: string}) => image)
                        ]
                    }
                }
            }
        });

        return NextResponse.json(billboard)

    } catch (error) {
        console.log('[BILLBOARDS_POST]', error)
        return new NextResponse('Interal error', {status: 500})
    }
}
export async function GET(
    req: Request,
    {params}: {params: {storeId: string}}
) {
    try {

        if (!params.storeId) {
            return new NextResponse('Store ID is required', {status: 400})
        }

        const billboards = await prismadb.billboard.findMany({
           where: {
               storeId: params.storeId
           }
        });

        return NextResponse.json(billboards)

    } catch (error) {
        console.log('[BILLBOARDS_GET]', error)
        return new NextResponse('Interal error', {status: 500})
    }
}