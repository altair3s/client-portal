// Fichier: src/App.js (mise à jour avec les nouvelles routes et protection)
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { AuthContext } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import ReportsList from './components/Reports/ReportsList';
import ReportDetails from './components/Reports/ReportDetails';
import VacationsReports from './components/Reports/VacationsReports';
import RemiseEnEtatReports from './components/Reports/RemiseEnEtatReports';
import MecanisationReports from './components/Reports/MecanisationReports';
import Calendar from './components/Calendar/Calendar';
import Comite from './components/Reports/ComiteAvril25';
import SanitaryBlocksTracking from './components/SanitaryBlocks/SanitaryBlocksTracking';
import BS from './components/SanitaryBlocks/BS';
import Login from './components/Auth/Login';
import 'leaflet/dist/leaflet.css';

// Composant de protection des routes
const RequireAuth = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <Routes>
            {/* Route de connexion */}
            <Route path="/login" element={<Login />} />
            
            {/* Routes protégées */}
            <Route path="/" element={
              <RequireAuth>
                <Layout />
              </RequireAuth>
            }>
              <Route index element={<Dashboard />} />
              
              {/* Routes pour les comptes rendus */}
              <Route path="reports">
               {/* <Route path="all" element={<ReportsList category="all" />} />*/}
                <Route path="vacations" element={<VacationsReports />} />
                <Route path="remise-en-etat" element={<RemiseEnEtatReports />} />
                <Route path="mecanisation" element={<MecanisationReports />} />
                <Route path=":id" element={<ReportDetails />} />
              </Route>
              
              <Route path="calendar" element={<Calendar />} />
              <Route path="bs" element={<BS />} />
              <Route path="comite">
                <Route path="comiteavril25" element={<Comite />} />
              </Route>
            </Route>
            
            {/* Redirection par défaut */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;