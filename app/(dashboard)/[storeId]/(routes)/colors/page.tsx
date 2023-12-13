import {format} from 'date-fns';
import prismadb from "@/lib/prismadb";
import {SizeColumn} from "./components/columns";
import {SizesClient} from "./components/client";

const ColorsPage = async ({params} : {params: {storeId: string}}) => {

   const colors = await prismadb.color.findMany({
       where: {
           storeId: params.storeId
       },
       orderBy: {
           createdAt: 'desc'
       }
   });

   const formattedColors : SizeColumn[] = colors.map((colors) => ({
       id: colors.id,
       name: colors.name,
       value: colors.value,
        createdAt: format(colors.createdAt, "MMMM do, yyyy")
   }))

    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <SizesClient data={formattedColors}/>
            </div>
        </div>
    )
}

export default ColorsPage;