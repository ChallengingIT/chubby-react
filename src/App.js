import './App.css';
import { BrowserRouter, Routes, Route }                               from 'react-router-dom';
import React, { useEffect, useState }                                                          from 'react';
import PrivateRoute                                                   from './components/PrivateRoute.jsx';


import Aziende                                                         from './pages/Aziende.jsx';
import Need                                                            from './pages/Need.jsx';
import Recruiting                                                      from './pages/Recruiting.jsx';
import Layout                                                          from './components/Layout.jsx';
import LoginPage                                                       from './pages/LoginPage.jsx';
import IntervisteList                                                  from './pages/IntervisteList.jsx';
import Keypeople                                                       from './pages/Keypeople.jsx';
import Hiring                                                          from './pages/Hiring.jsx';
import NeedMatch                                                       from './pages/NeedMatch.jsx';
import AziendeListaNeedCard                                            from './pages/AziendeListaNeedCard.jsx';
import DettaglioIntervista                                             from './pages/VisualizzaPagine/DettaglioIntervista.jsx';
import AggiungiAziendaGrafica                                          from './pages/AggiungiForm/AggiungiAziendaGrafica.jsx';
import ModificaAziendaGrafica                                          from './pages/ModificaForm/ModificaAziendaGrafica.jsx';
import AggiungiKeypeopleGrafica                                        from './pages/AggiungiForm/AggiungiKeypeopleGrafica.jsx';
import ModificaKeypeopleGrafica                                        from './pages/ModificaForm/ModificaKeypeopleGrafica.jsx';
import AggiungiRecruitingGrafica                                       from './pages/AggiungiForm/AggiungiRecruitingGrafica.jsx';
import ModificaRecruitingGrafica                                       from './pages/ModificaForm/ModificaRecruitingGrafica.jsx';
import AggiungiIntervistaGrafica                                       from './pages/AggiungiForm/AggiungiIntervistaGrafica.jsx';
import ModificaIntervistaGrafica                                       from './pages/ModificaForm/ModificaIntervistaGrafica.jsx';
import AggiungiNeedGrafica                                             from './pages/AggiungiForm/AggiungiNeedGrafica.jsx';
import ModificaNeedGrafica                                             from './pages/ModificaForm/ModificaNeedGrafica.jsx';
import AggiungiNeedIDGragica                                           from './pages/AggiungiForm/AggiungiNeedIDGrafica.jsx';
import NotFoundPage                                                    from './pages/NotFoundPage.jsx';
import AggiungiRecruitingHiring                                        from './pages/AggiungiForm/AggiungiRecruitingHiring.jsx';
import AggiungiHeadHunting                                             from './pages/AggiungiForm/AggiungiHeadHunting.jsx';
import TorchyThemeProvider                                             from './components/TorchyThemeProvider.jsx';
import { AuthProvider }                                                from './services/authContext.js';
import DashboardClienti                                                from './pages/DashboardClienti.jsx';
import AggiungiStaffing                                                from './pages/AggiungiForm/AggiungiStaffing.jsx';
import AggiungiTemporary                                               from './pages/AggiungiForm/AggiungiTemporary.jsx';
import Dashboard                                                       from './pages/Dashboard.jsx';
import SettingsPage                                                    from './pages/SettingsPage.jsx';
import ModificaStaffing                                                from './pages/ModificaForm/ModificaStaffing.jsx';
import ModificaTemporary                                               from './pages/ModificaForm/ModificaTemporary.jsx';
import ModificaHeadHunting                                             from './pages/ModificaForm/ModificaHeadHunting.jsx';
import ModificaHiringRecruiting                                        from './pages/ModificaForm/ModificaHiringRecruiting.jsx';
import AggiungiOwner                                                   from './pages/AggiungiForm/AggiungiOwner.jsx';
import { NotificationProvider }                                        from './components/NotificationContext.js';
import TabellaAntDesign from './prove/TabellaAntDesign.jsx';




// const App = ({ server, location }) => {
//   return (
//     <RouterComponent server={server} location={location}>
//       <Routes />
//     </RouterComponent>
//   );
// };


const App = () => {


  return (
    <AuthProvider>
      <TorchyThemeProvider>
    <NotificationProvider>

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
                  <Route path="/homepage" element={
                    <PrivateRoute roles={["ROLE_BUSINESS"]}>
                      <DashboardClienti />
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
                      <NeedMatch />
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
                                  
                  <Route path="hiring/aggiungi/recruiting/:id" element={
                    <PrivateRoute roles={['ROLE_ADMIN', 'ROLE_BM']}>
                      <AggiungiRecruitingHiring />
                    </PrivateRoute>
                  } />

                <Route path="hiring/aggiungi/Head_Hunting/:id" element={
                    <PrivateRoute roles={['ROLE_ADMIN', 'ROLE_BM']}>
                      <AggiungiHeadHunting />
                    </PrivateRoute>
                  } />
                  

                  <Route path="hiring/aggiungi/temporary/:id" element={
                    <PrivateRoute roles={['ROLE_ADMIN', 'ROLE_BM']}>
                      <AggiungiTemporary />
                    </PrivateRoute>
                  } />

                  <Route path="hiring/aggiungi/staffing/:id" element={
                    <PrivateRoute roles={['ROLE_ADMIN', 'ROLE_BM']}>
                      <AggiungiStaffing />
                    </PrivateRoute>
                  } />

                  <Route path="hiring/modifica/staffing/:idHiring/:idScheda" element={
                    <PrivateRoute roles={['ROLE_ADMIN', 'ROLE_BM']}>
                      <ModificaStaffing />
                    </PrivateRoute>
                  } />

                  <Route path="hiring/modifica/temporary/:idHiring/:idScheda" element={
                    <PrivateRoute roles={['ROLE_ADMIN', 'ROLE_BM']}>
                      <ModificaTemporary />
                    </PrivateRoute>
                  } />

                  <Route path="hiring/modifica/Head_Hunting/:idHiring/:idScheda" element={
                    <PrivateRoute roles={['ROLE_ADMIN', 'ROLE_BM']}>
                      <ModificaHeadHunting />
                    </PrivateRoute>
                  } />

                  <Route path="hiring/modifica/recruiting/:idHiring/:idScheda" element={
                    <PrivateRoute roles={['ROLE_ADMIN', 'ROLE_BM']}>
                      <ModificaHiringRecruiting />
                    </PrivateRoute>
                  } />


                  <Route path="owner/aggiungi" element={
                    <PrivateRoute roles={['ROLE_BUSINESS']}>
                      <AggiungiOwner />
                    </PrivateRoute>
                  } />

                  <Route path="/settings" element={
                    <PrivateRoute roles={['ROLE_ADMIN',  'ROLE_RECRUITER', 'ROLE_BM', 'ROLE_USER', "ROLE_BUSINESS"]}>
                      <SettingsPage />
                    </PrivateRoute>
                  } />
                </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
    </NotificationProvider>
  </TorchyThemeProvider>
</AuthProvider>
  );
};
  
export default App;



// useEffect(() => {
//   const handleBeforeUnload = () => {
//     sessionStorage.clear();
//   };

//   window.addEventListener('beforeunload', handleBeforeUnload);

//   return () => {
//     window.removeEventListener('beforeunload', handleBeforeUnload);
//   };
// }, []);
