import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import Layout from './Layout'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'

import Customization from './components/Customization/Customization'
import PhoneSelector from './components/PhoneSelector/PhoneSelector'


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path='phone' element={<PhoneSelector/>} />
      <Route path='custom' element={<Customization />} />
    </Route>
  )
)


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>,
)
