import { Outlet, Navigate } from 'react-router-dom'

const PrivateRoutes = () => {
    let auth = {'token':(localStorage.getItem('userID') !== null)}
    return(
        auth.token ? <Outlet/> : <Navigate to="/auth"/>
    )
}

export default PrivateRoutes