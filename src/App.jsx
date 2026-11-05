import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import MapPage from './pages/MapPages';

export default function App() {
  return (
    <BrowserRouter>
      <div>
        <header style={{ padding: '20px', backgroundColor: '#333', color: 'white' }}>
          <h1>Dashboard</h1>
          <nav style={{ marginTop: '10px', display: 'flex', gap: '15px' }}>
            <Link to="/it" style={{ color: '#fff', textDecoration: 'underline' }}>Versione IT</Link>
            <Link to="/en" style={{ color: '#fff', textDecoration: 'underline' }}>Versione EN</Link>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/:lang" element={<MapPage />} />
            <Route path="*" element={<Navigate to="/it" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}