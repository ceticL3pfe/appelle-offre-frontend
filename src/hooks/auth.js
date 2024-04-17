import { useDispatch, useSelector } from "react-redux";
import { logOut, selectToken, setCredentials } from "../features/users/userSlice";
import { useGetProtectionMutation, useGetProtectionQuery, useSignOutUserMutation } from "../app/api/apiSlice";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { resetStore } from "../helpers/functions";

export const useAuth = () => {
    const dispach = useDispatch()
    // const {userId} = useParams()
    const userId = sessionStorage.getItem('userId')
    const [isAuthenticated, setIsAuthenticated] = useState(null); // Use null as an initial value
    const [getProtection, useGetProtectionResult ] = useGetProtectionMutation();
    const [signOut, signOutResult] = useSignOutUserMutation();
    useEffect(() => {
        getProtection()
    }, [])
    useEffect(() => {
        console.log('isAuthenticated:',isAuthenticated)
    }, [isAuthenticated])
    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                if (useGetProtectionResult.status === 'fulfilled') {
                    setIsAuthenticated(true);
                } else if (useGetProtectionResult.status === 'rejected') {
                    console.log('failed to get protection')
                    dispach(logOut())
                    // resetStore(dispach)

                    signOut()
                    console.log('dipatch false here')

                    setIsAuthenticated(false);


                }
            } catch (error) {
                console.log(error)
console.log('False here')
                setIsAuthenticated(false);
            }
        };


        checkAuthentication();



    }, [useGetProtectionResult]);
    useEffect(()=>{
        if(signOutResult.status==='rejected'){
            console.log('failed to signout')
            signOut()
        }

    }, [signOutResult])

    return isAuthenticated;
};