import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import './utils/pdfjsSetup'

// Importing ./utils/pdfjsSetup as a side-effect module installs the
// crypto.randomUUID polyfill before anything else can call it.
// pdf.js 6.x calls crypto.randomUUID() during PDF parsing; some embedded
// Chromium environments ship crypto.getRandomValues but not
// crypto.randomUUID.

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
