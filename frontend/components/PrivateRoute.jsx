"use client";

import {useEffect} from "react";
import {useRouter} from "next/navigation";
import { getToken,getRole } from "@/utils/auth.js";

export default function PrivateRoute({children, allowedRoles}){
    const router = useRouter();

    useEffect(()=>{
        const token = getToken();
        const role = getRole();

        if(!token){
            router.push("/login");
            return
        }

        if(allowedRoles && !allowedRoles.includes(role)){
            router.push("/login")
        }
    },[]);

    return  children
}