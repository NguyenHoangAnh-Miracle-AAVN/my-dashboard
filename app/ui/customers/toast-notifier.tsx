'use client';
import { hideToast } from "@/app/lib/redux/toastAction";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function ToastNotifier() {
    const reduxDispatch = useDispatch();
    const  {message, type, show } = useSelector((state:any) => state.toast.payload);

    useEffect(() => {
        debugger;
        if (show) {
            switch (type) {
                case 'success':
                    toast.success(message);
                    break;
                case 'failed':
                    toast.error(message);
                    break;
                default:
                    break;
            }
            
            setTimeout(() => {
                reduxDispatch(hideToast())  ;
            }, 3000);
        }
    }, [message, reduxDispatch, show]);
    
    return (
        null
    )

}