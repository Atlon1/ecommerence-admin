
import prismadb from "@/lib/prismadb";

type DashboradPageProps = {
    params: {
        storeId: string;
    }
}
const DashboardPage = async  ({params} : DashboradPageProps) => {
    const store = await prismadb.store.findFirst({
        where: {
            id: params.storeId
        }
    })

    return (
        <div>
            Active store: {store?.name}
        </div>
    )
}
export default DashboardPage