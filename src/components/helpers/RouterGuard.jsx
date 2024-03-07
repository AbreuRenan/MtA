import React from 'react'
import { AppContext } from '../../AppContext'
import { Navigate } from 'react-router-dom';

export default function RouterGuard({children}) {
    const { isLoggedIn } = React.useContext(AppContext); 
  return isLoggedIn ? (
    <>{children}</>
  ) : (
    <Navigate to="/login"/>
  )
}
