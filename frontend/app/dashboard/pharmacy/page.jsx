"use client";

import PrivateRoute from "@/components/PrivateRoute";

export default function PharmacyDashboard(){
    return(
        <PrivateRoute allowedRoles={["PHARMACY"]}>
            <div className="p-6">
                <h1 className="text-2xl font-bold">Pharmacy Dashboard</h1>
            </div>
        </PrivateRoute>
    )
}