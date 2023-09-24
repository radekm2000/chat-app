import { Box, Typography } from "@mui/material"
import { SidebarSearchBar } from "./SidearSearchbar"

export const SidebarNavbar = () => {

  return (
    <Box sx={{padding: '12px',
    display:'flex', alignItems: 'center',justifyContent:'center',height: '50px', borderBottom: '1px solid white', backgroundColor: '#424242'}}>
        <SidebarSearchBar/>
    </Box>
  )
}

export default SidebarNavbar