import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import TourPackages from './pages/TourPackages';
import PackageDetail from './pages/PackageDetail';
import Enquire from './pages/Enquire';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tour-packages" element={<TourPackages />} />
            <Route path="/package/:id" element={<PackageDetail />} />
            <Route path="/enquire-now" element={<Enquire />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
