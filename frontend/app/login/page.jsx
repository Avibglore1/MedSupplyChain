"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage(){
    const [email,setEmail] = useState("");
    const [role,setRole] = useState("GOV")
    const router = useRouter();

    const handleLogin = async(e) =>{
        e.preventDefault();

        const res = await fetch("http://localhost:5000/api/auth/login",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email,role}),
        });
        console.log(res)
        const data = await res.json();
        console.log(data)
        if(res.ok){
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.user.role);

            if(data.user.role==="GOV"){
                router.push("/dashboard/gov");
            }else if(data.user.role==="MANUFACTURER"){
                router.push("/dashboard/manufacturer")
            }else if(data.user.role==="PHARMACY"){
                router.push("/dashboard/pharmacy")
            }
        }
    }
    return(
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form 
            onSubmit={handleLogin}
            className="bg-white p-6 rounded-2xl shadow-md w-80"
            >
                <h2 className="text-xl font-bold mb-4">Login</h2>
                <input 
                type="email"
                placeholder="Email"
                className="w-full mb-3 p-2 border rounded" 
                onChange={e=>setEmail(e.target.value)}
                />
                <select 
                className="w-full mb-3 p-2 border rounded"
                value={role}
                onChange={e=>setRole(e.target.value)}
                >
                    <option value="GOV">Government</option>
                    <option value="MANUFACTURER">Manufacturer</option>
                    <option value="PHARMACY">Pharmacy</option>
                </select>
                <button className="w-full bg-blue-500 text-white p-2 rounded">
                    Login
                </button>
            </form>
        </div>
    );
}