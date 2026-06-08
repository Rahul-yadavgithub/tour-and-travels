import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import TourPackages from './pages/TourPackages';
import PackageDetail from './pages/PackageDetail';
import Enquire from './pages/Enquire';
import PickupRouteGuide from './pages/PickupRouteGuide';

import CarRentals from './pages/CarRentals';
import Hotels from './pages/Hotels';
import WriteReview from './pages/WriteReview';
import AdminReviews from './pages/AdminReviews';

const MainLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/tour-packages" element={<TourPackages />} />
          <Route path="/pickup-route-guide" element={<PickupRouteGuide />} />
          <Route path="/car-rentals" element={<CarRentals />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/enquire-now" element={<Enquire />} />
          <Route path="/write-review" element={<WriteReview />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />
        </Route>
        <Route path="/package/:id" element={<PackageDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
