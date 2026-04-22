export const getToken = () =>{
    return typeof window !== "undefined" 
    ? localStorage.getItem("token")
    : null;
};

export const getRole = () =>{
    return typeof window !== "undefined"
    ? localStorage.getItem("role")
    : null;
}