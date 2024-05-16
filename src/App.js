import './App.css';
import { BrowserRouter, Routes, Route }                               from 'react-router-dom';
import React                                                          from 'react';
import PrivateRoute                                                   from './components/PrivateRoute.jsx';


import Aziende                                                         from './pages/Aziende.jsx';
import Need                                                            from './pages/Need.jsx';
import Recruiting                                                      from './pages/Recruiting.jsx';
import Layout                                                          from './components/Layout.jsx';
import LoginPage                                                       from './pages/LoginPage.jsx';
import IntervisteList                                                  from './pages/IntervisteList.jsx';
import Keypeople                                                       from './pages/Keypeople.jsx';
import Hiring                                                          from './pages/Hiring.jsx';
import NeedMatch2                                                      from './pages/NeedMatch2.jsx';
import AziendeListaNeedCard                                            from './pages/AziendeListaNeedCard.jsx';
import DettaglioIntervista                                             from './pages/VisualizzaPagine/DettaglioIntervista.jsx';
import Dashboard                                                       from './pages/Dashboard.jsx';
import AggiungiAziendaGrafica                                          from './pages/NuoveGrafiche/AggiungiAziendaGrafica.jsx';
import ModificaAziendaGrafica                                          from './pages/NuoveGrafiche/ModificaAziendaGrafica.jsx';
import AggiungiKeypeopleGrafica                                        from './pages/NuoveGrafiche/AggiungiKeypeopleGrafica.jsx';
import ModificaKeypeopleGrafica                                        from './pages/NuoveGrafiche/ModificaKeypeopleGrafica.jsx';
import AggiungiRecruitingGrafica                                       from './pages/NuoveGrafiche/AggiungiRecruitingGrafica.jsx';
import ModificaRecruitingGrafica                                       from './pages/NuoveGrafiche/ModificaRecruitingGrafica.jsx';
import AggiungiIntervistaGrafica                                       from './pages/NuoveGrafiche/AggiungiIntervistaGrafica.jsx';
import ModificaIntervistaGrafica                                       from './pages/NuoveGrafiche/ModificaIntervistaGrafica.jsx';
import AggiungiNeedGrafica                                             from './pages/NuoveGrafiche/AggiungiNeedGrafica.jsx';
import ModificaNeedGrafica                                             from './pages/NuoveGrafiche/ModificaNeedGrafica.jsx';
import AggiungiNeedIDGragica                                           from './pages/NuoveGrafiche/AggiungiNeedIDGrafica.jsx';
import NotFoundPage                                                    from './pages/NotFoundPage.jsx';
import AggiungiRecruitingHiring                                        from './pages/NuoveGrafiche/AggiungiRecruitingHiring.jsx';
import AggiungiHeadHunting                                             from './pages/NuoveGrafiche/AggiungiHeadHunting.jsx';
import TorchyThemeProvider                                             from './components/TorchyThemeProvider.jsx';
import { AuthProvider } from './services/authContext.js';


const App = () => {


// useEffect(() => {
//   const handleBeforeUnload = () => {
//     sessionStorage.clear();
//   };

//   window.addEventListener('beforeunload', handleBeforeUnload);

//   return () => {
//     window.removeEventListener('beforeunload', handleBeforeUnload);
//   };
// }, []);




  return (
    <AuthProvider>
      <TorchyThemeProvider>
    <BrowserRouter>
      <Routes>
      <Route path='/' element={<LoginPage /> } />
      <Route path="/login" element={<LoginPage />} />
      <Route element={<Layout />}>
                <Route path="/dashboard" element={
                    <PrivateRoute roles={['ROLE_ADMIN',  'ROLE_RECRUITER', 'ROLE_BM', 'ROLE_USER', "ROLE_BUSINESS"]}>
                      <Dashboard />
                    </PrivateRoute>
                  } />
                <Route path="/business" element={
                    <PrivateRoute roles={['ROLE_ADMIN', 'ROLE_BM', 'ROLE_USER']}>
                      <Aziende />
                    </PrivateRoute>
                  } />
                <Route path="/business/aggiungi"element={
                    <PrivateRoute roles={['ROLE_ADMIN', 'ROLE_BM',]}>
                      <AggiungiAziendaGrafica />
                    </PrivateRoute>
                  } />
                <Route path="/business/modifica/:id"element={
                    <PrivateRoute roles={['ROLE_ADMIN', 'ROLE_BM']}>
                      <ModificaAziendaGrafica />
                    </PrivateRoute>
                  } />
                <Route path="/need/:id"element={
                    <PrivateRoute roles={['ROLE_ADMIN', 'ROLE_BM', 'ROLE_BUSINESS']}>
                      <AziendeListaNeedCard />
                    </PrivateRoute>
                  } />
                <Route path="/need/aggiungi/:id"element={
                    <PrivateRoute roles={['ROLE_ADMIN', 'ROLE_BM', 'ROLE_BUSINESS']}>
                      <AggiungiNeedIDGragica />
                    </PrivateRoute>
                  } />
                <Route path="/contacts"element={
                    <PrivateRoute roles={['ROLE_ADMIN', 'ROLE_BM']}>
                      <Keypeople />
                    </PrivateRoute>
                  } />
                <Route path="/contacts/aggiungi"element={
                    <PrivateRoute roles={['ROLE_ADMIN', 'ROLE_BM']}>
                      <AggiungiKeypeopleGrafica />
                    </PrivateRoute>
                  } />
                <Route path="/contacts/modifica/:id" element={
                    <PrivateRoute roles={['ROLE_ADMIN', 'ROLE_BM']}>
                      <ModificaKeypeopleGrafica />
                    </PrivateRoute>
                  } />
                <Route path="/need" element={
                    <PrivateRoute roles={['ROLE_ADMIN', 'ROLE_BM', 'ROLE_RECRUITER']}>
                      <Need />
                    </PrivateRoute>
                  } />
                <Route path="/need/aggiungi" element={
                    <PrivateRoute roles={['ROLE_ADMIN', 'ROLE_BM']}>
                      <AggiungiNeedGrafica />
                    </PrivateRoute>
                  } />
                <Route path="/need/modifica/:id" element={
                    <PrivateRoute roles={['ROLE_ADMIN', 'ROLE_BM', 'ROLE_RECRUITER', 'ROLE_BUSINESS']}>
                      <ModificaNeedGrafica />
                    </PrivateRoute>
                  } />
                <Route path="/need/match/:id"element={
                    <PrivateRoute roles={['ROLE_ADMIN', 'ROLE_BM', 'ROLE_RECRUITER']}>
                      <NeedMatch2 />
                    </PrivateRoute>
                  } />
                <Route path="/recruiting"element={
                    <PrivateRoute roles={['ROLE_ADMIN', 'ROLE_BM', 'ROLE_RECRUITER']}>
                      <Recruiting />
                    </PrivateRoute>
                  } />
                <Route path="/recruiting/aggiungi" element={
                    <PrivateRoute roles={['ROLE_ADMIN', 'ROLE_BM', 'ROLE_RECRUITER']}>
                      <AggiungiRecruitingGrafica />
                    </PrivateRoute>
                  } />
                <Route path="/recruiting/modifica/:id"element={
                    <PrivateRoute roles={['ROLE_ADMIN', 'ROLE_BM', 'ROLE_RECRUITER']}>
                      <ModificaRecruitingGrafica />
                    </PrivateRoute>
                  } />
                <Route path="/recruiting/intervista/:id"element={
                    <PrivateRoute roles={['ROLE_ADMIN', 'ROLE_BM', 'ROLE_RECRUITER']}>
                      <IntervisteList />
                    </PrivateRoute>
                  } />
                <Route path="/intervista/aggiungi"element={
                    <PrivateRoute roles={['ROLE_ADMIN', 'ROLE_BM', 'ROLE_RECRUITER']}>
                      <AggiungiIntervistaGrafica />
                    </PrivateRoute>
                  } />
                <Route path="/intervista/modifica/:id" element={
                    <PrivateRoute roles={['ROLE_ADMIN', 'ROLE_BM', 'ROLE_RECRUITER']}>
                      <ModificaIntervistaGrafica />
                    </PrivateRoute>
                  } />
                    <Route path="/intervista/visualizza/:id" element={
                    <PrivateRoute roles={['ROLE_ADMIN', 'ROLE_BM', 'ROLE_RECRUITER']}>
                      <DettaglioIntervista />
                    </PrivateRoute>
                  } />
                <Route path="/hiring" element={
                    <PrivateRoute roles={['ROLE_ADMIN', 'ROLE_BM']}>
                      <Hiring />
                    </PrivateRoute>
                  } />
                                  
                  <Route path="/aggiungi/recruiting" element={
                    <PrivateRoute roles={['ROLE_ADMIN', 'ROLE_BM']}>
                      <AggiungiRecruitingHiring />
                    </PrivateRoute>
                  } />

                <Route path="/aggiungi/headhunting" element={
                    <PrivateRoute roles={['ROLE_ADMIN', 'ROLE_BM']}>
                      <AggiungiHeadHunting />
                    </PrivateRoute>
                  } />
                </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  </TorchyThemeProvider>
</AuthProvider>
  );
};
  
export default App;
