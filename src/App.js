import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HtmlLayout from './components/HtmlLayout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import WorkPage from './pages/WorkPage';
import AboutPageHtml from './pages/AboutPageHtml';
import WorkPageHtml from './pages/WorkPageHtml';
import './styles/main.css';

function App() {
   return (
    <BrowserRouter>
      {/* Route for the 3D content, rendered inside the main Layout */}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="work" element={<WorkPage />} />
        </Route>
      </Routes>

      {/* A SECOND, parallel <Routes> block for the HTML content */}
      <Routes>
        <Route path="/" element={<HtmlLayout />}>
          <Route index element={null} /> 
          <Route path="about" element={<AboutPageHtml />} />
          <Route path="work" element={<WorkPageHtml />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;