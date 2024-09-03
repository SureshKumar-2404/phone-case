import React from 'react'
import ReactDOM from 'react-dom/client'
import Customization from './components/Customization/Customization'
import PhoneSelector from './components/PhoneSelector/PhoneSelector'
import './index.css';
import './index.css';

if (document.getElementById('root1')) {
    ReactDOM.createRoot(document.getElementById('root1')).render(
        <React.StrictMode>
            <PhoneSelector />
        </React.StrictMode>
    )
}

if (document.getElementById('root')) {
    ReactDOM.createRoot(document.getElementById('root')).render(
        <React.StrictMode>
            <Customization />
        </React.StrictMode>,
    )
}