import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import App_tw from './App_tw.tsx'
import App_mui from './App_mui.tsx'
import App_sc from './App_sc.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <App_tw/>
    <App_mui/>
    <App_sc/>
  </StrictMode>,
)
//