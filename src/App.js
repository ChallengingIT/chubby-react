import './App.css';
import { BrowserRouter, Routes, Route }                               from 'react-router-dom';
import React, { useEffect }                                           from 'react';
import PrivateRoute                                                   from './components/PrivateRoute.jsx';


import Aziende                                                         from './pages/Aziende.jsx';
import Need                                                            from './pages/Need.jsx';
import Recruiting                                                      from './pages/Recruiting.jsx';
import AggiungiNeed                                                    from './pages/AggiungiPagine/AggiungiNeed';
import ModificaNeed                                                    from './pages/ModificaPagine/ModificaNeed.jsx';
import DettaglioNeed                                                   from './pages/DettaglioPagine/DettaglioNeed.jsx';
import Layout                                                          from './components/Layout.jsx';
import LoginPage                                                       from './pages/LoginPage.jsx';
import IntervisteList                                                  from './pages/IntervisteList.jsx';
import AggiungiNeedID                                                  from './pages/AggiungiPagine/AggiungiNeedID.jsx';
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
import DashboardProva from './pages/DashboardProva.jsx';
import AggiungiNeedGrafica from './pages/NuoveGrafiche/AggiungiNeedGrafica.jsx';
import ModificaNeedGrafica from './pages/NuoveGrafiche/ModificaNeedGrafica.jsx';



const App = () => {


useEffect(() => {
  const handleBeforeUnload = () => {
    localStorage.clear();
  };

  window.addEventListener('beforeunload', handleBeforeUnload);

  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
}, []);




  return (
    <BrowserRouter>
      <Routes>
      <Route path='/' element={<LoginPage /> } />
      <Route path="/login" element={<LoginPage />} />
      <Route element={<Layout />}>

                {/* <Route path="/homepage"  element={<PrivateRoute roles={['ROLE_ADMIN', 'ROLE_BM', 'ROLE_RECRUITER']}>
                      <Homepage />
                    </PrivateRoute>
                  } /> */}
                <Route path="/dashboard" element={
                    <PrivateRoute roles={['ROLE_ADMIN',  'ROLE_RECRUITER', 'ROLE_BM']}>
                      <Dashboard />
                    </PrivateRoute>
                  } />
                <Route path="/business" element={
                    <PrivateRoute roles={['ROLE_ADMIN', 'ROLE_BM', 'ROLE_RECRUITER']}>
                      <Aziende />
                    </PrivateRoute>
                  } />
                <Route path="/business/aggiungi"element={
                    <PrivateRoute roles={['ROLE_ADMIN', 'ROLE_BM', 'ROLE_RECRUITER']}>
                      <AggiungiAziendaGrafica />
                    </PrivateRoute>
                  } />
                <Route path="/business/modifica/:id"element={
                    <PrivateRoute roles={['ROLE_ADMIN', 'ROLE_BM', 'ROLE_RECRUITER']}>
                      <ModificaAziendaGrafica />
                    </PrivateRoute>
                  } />
                <Route path="/need/:id"element={
                    <PrivateRoute roles={['ROLE_ADMIN', 'ROLE_BM', 'ROLE_RECRUITER']}>
                      <AziendeListaNeedCard />
                    </PrivateRoute>
                  } />
                <Route path="/need/aggiungi/:id"element={
                    <PrivateRoute roles={['ROLE_ADMIN', 'ROLE_BM', 'ROLE_RECRUITER']}>
                      <AggiungiNeedID />
                    </PrivateRoute>
                  } />
                <Route path="/contacts"element={
                    <PrivateRoute roles={['ROLE_ADMIN', 'ROLE_BM', 'ROLE_RECRUITER']}>
                      <Keypeople />
                    </PrivateRoute>
                  } />
                <Route path="/contacts/aggiungi"element={
                    <PrivateRoute roles={['ROLE_ADMIN', 'ROLE_BM', 'ROLE_RECRUITER']}>
                      <AggiungiKeypeopleGrafica />
                    </PrivateRoute>
                  } />
                <Route path="/contacts/modifica/:id" element={
                    <PrivateRoute roles={['ROLE_ADMIN', 'ROLE_BM', 'ROLE_RECRUITER']}>
                      <ModificaKeypeopleGrafica />
                    </PrivateRoute>
                  } />
                <Route path="/need" element={
                    <PrivateRoute roles={['ROLE_ADMIN', 'ROLE_BM', 'ROLE_RECRUITER']}>
                      <Need />
                    </PrivateRoute>
                  } />
                <Route path="/need/aggiungi"element={
                    <PrivateRoute roles={['ROLE_ADMIN', 'ROLE_BM', 'ROLE_RECRUITER']}>
                      <AggiungiNeedGrafica />
                    </PrivateRoute>
                  } />
                <Route path="/need/modifica/:id"element={
                    <PrivateRoute roles={['ROLE_ADMIN', 'ROLE_BM', 'ROLE_RECRUITER']}>
                      <ModificaNeedGrafica />
                    </PrivateRoute>
                  } />
                <Route path="/need/dettaglio/:id" element={
                    <PrivateRoute roles={['ROLE_ADMIN', 'ROLE_BM', 'ROLE_RECRUITER']}>
                      <DettaglioNeed />
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
                    <PrivateRoute roles={['ROLE_ADMIN', 'ROLE_BM', 'ROLE_RECRUITER']}>
                      <Hiring />
                    </PrivateRoute>
                  } />
        </Route>
      </Routes>
    </BrowserRouter>
  );

          };
  
export default App;
