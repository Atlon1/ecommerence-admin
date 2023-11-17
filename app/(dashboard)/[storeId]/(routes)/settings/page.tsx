import React from 'react';
import {auth} from "@clerk/nextjs";

interface SettingsPageProps {
    params: {
        storeId: string;
    }
}

const SettingsPage: React.FC<SettingsPageProps> = () => {
    const {userId} = auth();


    return (
        <div>
            Hello settings
        </div>
    );
};

export default SettingsPage;