import './i18n/config.ts'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import NotesApp from './NotesApp.tsx'
import './index.css'
import { ThemeProvider } from './context/ThemeContext.tsx'
import { ModalManagerProvider } from './context/ModalManagerContext.tsx'

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <ThemeProvider>
      <ModalManagerProvider>
        <NotesApp />
      </ModalManagerProvider>
    </ThemeProvider>
  </StrictMode>,
)
