import {format} from 'date-fns';
import prismadb from "@/lib/prismadb";
import {SizeColumn} from "./components/columns";
import {SizesClient} from "./components/client";

const SizesPage = async ({params} : {params: {storeId: string}}) => {

   const siezes = await prismadb.size.findMany({
       where: {
           storeId: params.storeId
       },
       orderBy: {
           createdAt: 'desc'
       }
   });

   const formattedSizes : SizeColumn[] = siezes.map((sizes) => ({
       id: sizes.id,
       name: sizes.name,
       value: sizes.value,
        createdAt: format(sizes.createdAt, "MMMM do, yyyy")
   }))

    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <SizesClient data={formattedSizes}/>
            </div>
        </div>
    )
}

export default SizesPage;