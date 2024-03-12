import React from 'react'
import ReportScreenHeaderMenu from './reportScreenHeaderMenu/reportScreenHeaderMenu'
import { Route, Routes } from 'react-router-dom'
import ReportContacts from './reportScreenContacts/reportContacts'

export default function ReportScreen() {
  return (
    <div className='container' style={{backgroundColor: 'red'}}>
        <ReportScreenHeaderMenu/>
      <Routes>
        <Route path="/contatos" element={<ReportContacts />} />
      </Routes>
    </div>
    
  )
}
