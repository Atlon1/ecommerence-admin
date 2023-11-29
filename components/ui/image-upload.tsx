"use client";

interface ImageUploadProps {
   disabled?: boolean;
   onChange: (value: string) => void;
   onRemove: (value: string) => void;
   value: string[]
}



const imageUpload = () => {

    return (
        <div>
            Image upload
        </div>
    )
}