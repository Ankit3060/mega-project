import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from "./App.jsx"
import { AuthProvider } from './Context/authContext.jsx';
import { SearchProvider } from "./Context/searchContext";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <SearchProvider>
        <App />
      </SearchProvider>
    </AuthProvider>
  </StrictMode>,
)
