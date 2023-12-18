import {format} from 'date-fns';

import {BillboardClient} from "./components/client";
import prismadb from "@/lib/prismadb";
import {BillboardColumn} from "./components/columns";

const ProductPage = async ({params} : {params: {storeId: string}}) => {

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

   const formatedBillboards : BillboardColumn[] = products.map((billboard) => ({
       id: billboard.id,
       label: billboard.label,
        createdAt: format(billboard.createdAt, "MMMM do, yyyy")
   }))

    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <BillboardClient data={formatedBillboards}/>
            </div>
        </div>
    )
}

export default ProductPage;