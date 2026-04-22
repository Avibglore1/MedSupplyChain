"use client";
import { useState, useEffect } from "react";
import { getSocket } from "@/utils/socket";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchKPIs,fetchLicenses, revokeLicense, prolongLicense, fetchActivities } from "@/services/api";
import { Card } from "@/components/Card";

export default function GovDashboard(){
    const [liveLogs, setLiveLogs] = useState([]);
    
    const queryClient = useQueryClient();

    const {data: kpis} = useQuery({
        queryKey: ["kpis"],
        queryFn: fetchKPIs,
    });

    const {data: licenses} = useQuery({
        queryKey: ["licenses"],
        queryFn: fetchLicenses,
    });

    const {data: activities} = useQuery({
        queryKey: ["activities"],
        queryFn: fetchActivities,
        refetchInterval: 5000
    });

    const revokeMutation = useMutation({
        mutationFn: revokeLicense,
        onSuccess: () =>{
            queryClient.invalidateQueries(["licenses"]);
        },
    });

    const prolongMutation = useMutation({
        mutationFn: prolongLicense,
        onSuccess: () =>{
            queryClient.invalidateQueries(["licenses"])
        },
    });

    useEffect(()=>{
        const socket = getSocket();
        socket.on("connect", ()=>{
            console.log("Connected to socket");
        });
        socket.on("license_update", data=>{
            setLiveLogs(prev=>[data, ...prev]);
        });
        socket.on("disconnect", ()=>{
            console.log("Disconnected");
        });

        return () => {
            socket.off("license_update");
        }
    },[])

     const combinedLogs = [...liveLogs, ...(activities || [])];

    return(
        <div className="p-6 space-y-6">
            <div className="grid grid-cols-3 gap-4">
                <Card title="Drug Types" value={kpis?.drugTypes || 0}/>
                <Card title="Valid Licenses" value={kpis?.validLicenses || 0}/>
                <Card title="Revoked Licenses" value={kpis?.revokeLicense || 0}/>
            </div>
            <div>
                <h2 className="text-xl font-semibold mb-2">Licenses</h2>
                <table className="w-full border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th>Drug</th>
                            <th>Status</th>
                            <th>Expiry</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            licenses?.map((lic)=>(
                                <tr 
                                key={lic._id}
                                className="text-center border-t"
                                >
                                    <td>{lic.drugTypes}</td>
                                    <td>{lic.status}</td>
                                    <td>{lic.expiresAt}</td>
                                    <td className="space-x-2">
                                        <button
                                            className="bg-red-500 text-white px-2 py-1"
                                            onClick={() => revokeMutation.mutate(lic._id)}
                                        >
                                            Revoke
                                        </button>
                                        <button
                                            className="bg-blue-500 text-white px-2 py-1"
                                            onClick={() => prolongMutation.mutate(lic._id)}
                                        >
                                            Prolong
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            <div>
                <h2 className="text-xl font-semibold mb-2">Live Activity Feed</h2>

                <div className="h-64 overflow-y-auto border p-2 space-y-2">
                    {combinedLogs.map((log, i) => (
                    <div key={i} className="bg-gray-100 p-2 rounded">
                        <p>{log.message}</p>
                        <span className="text-xs text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                        </span>
                    </div>
                    ))}
                </div>
            </div>
        </div>
    )
}