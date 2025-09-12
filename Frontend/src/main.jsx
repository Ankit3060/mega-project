import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from "./App.jsx"
import { AuthProvider } from './Context/authContext.jsx';
import { SearchProvider } from "./Context/searchContext";
import { ThemeProvider } from './Context/themeContext.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <SearchProvider>
          <App />
        </SearchProvider>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
)
