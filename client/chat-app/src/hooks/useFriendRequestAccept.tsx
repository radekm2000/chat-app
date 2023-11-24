import { useQuery } from "@tanstack/react-query"
import { useAxiosAuthorized } from "./useAxiosAuthorized"

export const useFriendRequestAccept = () => {
    const axiosAuthorized = useAxiosAuthorized()

    return useQuery({})
}
