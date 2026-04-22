"use client"

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getRole } from "@/utils/auth";

export default function Home() {
  const router = useRouter();

  useEffect(()=>{
    const role = getRole();
    if(role==="GOV") router.push("/dashboard/gov");
    else if(role==="MANUFACTURER") router.push("/dashboard/manufacturer")
    else if(role==="PHARMACY") router.push("/dashboard/pharmacy")
    else router.push("/login")
  },[]);
  return null
}