// Root layout component that wraps the entire application
// This is where we set up global providers and metadata

// Import global styles
import "../styles/reset.css";
import "../styles/globals.css";
import "../styles/Home.module.css";

// Import context providers
import { ItemsProvider } from './context/ItemsContext';
import { AuthProvider } from './context/AuthContext';

// Metadata for the application
export const metadata = {
  title: "Retriever's Essentials",
  description: "UMBC's student pantry inventory app",
};

// Root layout component that wraps all pages
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Set viewport for responsive design */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        {/* Wrap the entire app with authentication and items context providers */}
        <AuthProvider>
          <ItemsProvider>
            {children}
          </ItemsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
