import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProjectList } from './pages/ProjectList';
import { ProjectForm } from './pages/ProjectForm';
import { ProjectDetail } from './pages/ProjectDetail';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ maxWidth: 800, margin: '2rem auto', padding: '0 1rem' }}>
        <Routes>
		  <Route path="/" element={ <Navigate to='/projects' replace /> } />
          <Route path="/projects" element={<ProjectList />} />
          <Route path="/projects/new" element={<ProjectForm />} />
          <Route path="/projects/:id/edit" element={<ProjectForm />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}