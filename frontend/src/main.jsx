import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import MainView from './views/MainView.jsx'
import StepsView from './views/StepsView.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StepsView />
  </StrictMode>,
)
