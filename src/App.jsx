import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Results from './pages/Results';
import BranchDetail from './pages/BranchDetail';
import History from './pages/History';
import Layout from './components/Layout';

const basePath = import.meta.env.PROD ? '/navi-frontend' : '/';

export default function App() {
  return (
    <BrowserRouter basename={basePath}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="results" element={<Results />} />
          <Route path="branch/:id" element={<BranchDetail />} />
          <Route path="history" element={<History />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}