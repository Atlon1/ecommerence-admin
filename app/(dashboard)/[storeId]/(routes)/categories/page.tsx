import {format} from 'date-fns';

import {CategoryClient} from "./components/client";
import prismadb from "@/lib/prismadb";
import {CategoryColumn} from "./components/columns";

const CategoriesPage = async ({params} : {params: {storeId: string}}) => {

   const categories = await prismadb.category.findMany({
       where: {
           storeId: params.storeId
       },
       include: {
           billboard: true
       },
       orderBy: {
           createdAt: 'desc'
       }
   });

   const formatedCategories : CategoryColumn[] = categories.map((categories) => ({
       id: categories.id,
       name: categories.name,
       billboardLabel: categories.billboard.label,
        createdAt: format(categories.createdAt, "MMMM do, yyyy")
   }))

    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <CategoryClient data={formatedCategories}/>
            </div>
        </div>
    )
}

export default CategoriesPage;