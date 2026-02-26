import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ShortenPage from './pages/ShortenPage';
import AnalyticsPage from './pages/AnalyticsPage';
import StatusPage from './pages/StatusPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shorten" element={<ShortenPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/status" element={<StatusPage />} />
        </Routes>
        <Footer /> 
      </div>
    </Router>
  );
}

export default App;