import {format} from 'date-fns';
import prismadb from "@/lib/prismadb";
import {formatter} from "@/lib/utils";

import {ProductClient} from "./components/client";
import {ProductColumn} from "./components/columns";

const ProductPage = async ({params}: { params: { storeId: string } }) => {

    const products = await prismadb.product.findMany({
        where: {
            storeId: params.storeId
        },
        include: {
            category: true,
            size: true,
            color: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedProducts: ProductColumn[] = products.map((products) => ({
        id: products.id,
        name: products.name,
        isFutered: products.isFutered,
        isArchived: products.isArchived,
        price: formatter.format(products.price.toNumber()),
        category: products.category.name,
        size: products.size.name,
        color: products.color.value,
        createdAt: format(products.createdAt, "MMMM do, yyyy")
    }))

    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <ProductClient data={formattedProducts}/>
            </div>
        </div>
    )
}

export default ProductPage;