import React, { ReactElement } from 'react'
import { Navigate, Outlet } from 'react-router-dom';

interface props{
    children ? : ReactElement   ;
    isAuthenticated : boolean   ;
    adminOnly? : boolean   ;
    isAdmin? : boolean;
    redirect? : string;
}

const ProtectedRoute = ({isAuthenticated , children , adminOnly , isAdmin , redirect = "/"} : props) => {

    if(!isAuthenticated)return <Navigate to={redirect}/>    
    
    if(adminOnly && !isAdmin)return <Navigate to={redirect}/>
    
    
    return children ? children : <Outlet/> 
}

export default ProtectedRoute; 
