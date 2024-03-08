import React from 'react'
import { useNavigate } from 'react-router-dom'

function Logout() {
    const navigate = useNavigate()
    React.useEffect( ()=> {
        localStorage.clear()
        navigate('/login')
        window.location.reload()
    }, [])
  return null
}

export default Logout