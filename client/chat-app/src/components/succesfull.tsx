import { useAuth } from "../hooks/useAuth"

export const Succesfull = () => {
    const {auth} = useAuth()
    console.log(auth)
  return (
    <div>succesfull</div>
  )
}

