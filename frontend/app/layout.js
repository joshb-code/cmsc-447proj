// app/layout.js
import "../styles/Home.module.css";

export const metadata = {
  title: "Retriever's Essentials",
  description: "UMBC's student pantry inventory app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
