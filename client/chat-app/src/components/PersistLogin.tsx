import { useEffect, useState } from "react";
import { useRefreshToken } from "../hooks/useRefreshToken";
import { useAuth } from "../hooks/useAuth";

export const PersistLogin = ({children}) => {
    const [isLoading, setIsLoading] = useState(true);

    const refresh = useRefreshToken();
    const {auth} = useAuth()
    //finally prevents from endless loop
    useEffect(() => {
        const verifyRefreshToken = async () => {
            try {
                await refresh()
            } catch (error) {
                console.error(error)
            } finally {
                setIsLoading(false);
            }
        }

        //only do it when there is not an auth
        !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false)
    }, [])

    useEffect(() => {
        console.log(`isLoading: ${isLoading}`)
        console.log(`accessToken: ${JSON.stringify(auth?.accessToken)}`)
    }, [isLoading])

    return(
        <>
            {isLoading ? <p>Loading...</p> : children}
        </>
    )
}
