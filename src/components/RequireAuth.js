import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/auth";
import { useEffect } from "react";

const RequireAuth = () => {
    const isAuth = useAuth();
    const location = useLocation();
    useEffect(()=>{
        console.log(isAuth)
    },[isAuth])
    return (
       isAuth!==null ? isAuth
            ? <Outlet />
            : <Navigate to="/" state={{ from: location }} replace />:<>loading</>
    );
}

export default RequireAuth;