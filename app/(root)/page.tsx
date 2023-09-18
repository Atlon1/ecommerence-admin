"use client"

import React from 'react';

import {Modal} from "@/components/ui/modal";

const SetupPage = () => {
    return (
        <div className='p-4'>
           <Modal title='test' description='test' isOpen onClose={() => {}}>
               Children
           </Modal>
        </div>
    );
};

export default SetupPage;