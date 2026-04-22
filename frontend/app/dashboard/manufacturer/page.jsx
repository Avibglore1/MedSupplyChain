"use client";

import PrivateRoute from "@/components/PrivateRoute.jsx";

export default function ManufactureDashboard(){
    return(
        <PrivateRoute allowedRoles={["MANUFACTURER"]}>
            <div className="p-6">
                <h1 className="text-2xl font-bold">Manufacturer Dashboard</h1>
            </div>
        </PrivateRoute>
    )
}