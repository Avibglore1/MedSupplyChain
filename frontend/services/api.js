const BASE_URL = "http://localhost:5000";

export const fetchKPIs = async() =>{
    const res = await fetch(`${BASE_URL}/gov/kpis`);
    return res.json();
}

export const fetchLicenses = async() =>{
    const res= await fetch(`${BASE_URL}/licenses`);
    return res.json();
}

export const revokeLicense = async() =>{
    return fetch(`${BASE_URL}/licenses/${id}/revoke`,{
        method: "POST",
    })
}

export const prolongLicense = async () =>{
    return fetch(`${BASE_URL}/licenses/${id}/prolong`, {
        method: "POST"
    });
};

export const fetchActivities = async()=>{
    const res = await fetch(`${BASE_URL}/audit`);
    return res.json();
}