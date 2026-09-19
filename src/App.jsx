import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Trips from "./pages/Trips";
import TripDetail from "./pages/TripDetail";
import Destinations from "./pages/Destinations";
import PastTrips from "./pages/PastTrips";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import BookTrip from "./pages/BookTrip";
import Contact from "./pages/Contact";
import AdminDashboard from "./pages/AdminDashboard";
import AdminTrips from "./pages/AdminTrips";
import AdminTripForm from "./pages/AdminTripForm";
import AdminDestinations from "./pages/AdminDestinations";
import AdminDestinationForm from "./pages/AdminDestinationForm";
import AdminPastTrips from "./pages/AdminPastTrips";
import AdminPastTripForm from "./pages/AdminPastTripForm";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <div className="app">
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/trips/:id" element={<TripDetail />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/past-trips" element={<PastTrips />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/book/:id"
            element={
              <ProtectedRoute>
                <BookTrip />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/trips"
            element={
              <AdminRoute>
                <AdminTrips />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/trips/new"
            element={
              <AdminRoute>
                <AdminTripForm />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/trips/:id"
            element={
              <AdminRoute>
                <AdminTripForm />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/destinations"
            element={
              <AdminRoute>
                <AdminDestinations />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/destinations/new"
            element={
              <AdminRoute>
                <AdminDestinationForm />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/destinations/:id"
            element={
              <AdminRoute>
                <AdminDestinationForm />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/past-trips"
            element={
              <AdminRoute>
                <AdminPastTrips />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/past-trips/new"
            element={
              <AdminRoute>
                <AdminPastTripForm />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/past-trips/:id"
            element={
              <AdminRoute>
                <AdminPastTripForm />
              </AdminRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
