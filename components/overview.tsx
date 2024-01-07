import React, {FC} from 'react';

interface DashboardPageProps {
    data: {
        storeId: string;
    };
}
const Overview: FC<DashboardPageProps> = ({data}) => {
    return (
        <div>
           Overview
        </div>
    );
};

export default Overview;