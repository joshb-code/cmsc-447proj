// app/layout.js
import "../styles/reset.css";
import "../styles/globals.css";
import "../styles/Home.module.css";
import Navbar from './components/Navbar';
import { ItemsProvider } from "./context/ItemsContext";

export const metadata = {
  title: "Retriever's Essentials",
  description: "UMBC's student pantry inventory app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <ItemsProvider>
          {children}
        </ItemsProvider>
      </body>
    </html>
  );
}
