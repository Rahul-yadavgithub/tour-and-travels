import { Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';

// Layout
import Layout from './components/layout/Layout';

// Pages
import Dashboard from './pages/Dashboard';
import Portfolio from './pages/Portfolio';
import Cars from './pages/Cars';
import Hotels from './pages/Hotels';
import Reviews from './pages/Reviews';
import Settings from './pages/Settings';

function App() {
  return (
    <>
      <SignedOut>
        {/* If user is not signed in, redirect them to Clerk's sign in page */}
        <RedirectToSignIn />
      </SignedOut>

      <SignedIn>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/services/cars" element={<Cars />} />
            <Route path="/services/hotels" element={<Hotels />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Layout>
      </SignedIn>
    </>
  );
}

export default App;
