
import {PopoverTrigger} from "@/components/ui/popover";
import {Store} from ".prisma/client";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface StoreSwitcherProps extends PopoverTriggerProps {
    items: Store[];
}

export default function StoreSwitcher(){
    return(
        <div>
            StoreSwitcher
        </div>
    )
}