import { useState, useEffect } from 'react'


export const useOrgin = () => {
    const [mounted, setMounted] = useState(false)
    const origin = typeof window !==  'undefined' && window.location.origin ? window.location.origin : '';


    useEffect(() => {
        setMounted(true);
    },[])

    if (!mounted) {
        return origin
    }

    return origin
}