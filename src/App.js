import './App.css';
import { BrowserRouter, Routes, Route, Navigate, useNavigate }        from 'react-router-dom';
import React, { useState, useEffect }                                 from 'react';
import eventBus                                                       from './common/EventBus.js';
import PrivateRoute                                                   from './components/PrivateRoute.jsx';




import Homepage                                                        from './pages/Homepage';
import Home                                                            from './pages/Home.jsx';
import Aziende                                                         from './pages/Aziende.jsx';
import KeyPeople                                                       from './pages/KeyPeople.jsx';
import Need                                                            from './pages/Need.jsx';
import Recruiting                                                      from './pages/Recruiting.jsx';
import Progetti                                                        from './pages/Progetti.jsx';
import FatturazioneAttiva                                              from './pages/FatturazioneAttiva.jsx';
import FatturazionePassiva                                             from './pages/FatturazionePassiva.jsx';
import Fornitori                                                       from './pages/Fornitori.jsx';
import Tesoreria                                                       from './pages/Tesoreria.jsx';
import HR                                                              from './pages/HR.jsx';
import Register                                                        from './pages/Register.jsx';
import AggiungiAzienda                                                 from './pages/AggiungiPagine/AggiungiAzienda';
import AggiungiContatto                                                from './pages/AggiungiPagine/AggiungiContatto';
import AggiungiCandidato                                               from './pages/AggiungiPagine/AggiungiCandidato';
import AggiungiFatturazioneAttiva                                      from './pages/AggiungiPagine/AggiungiFatturazioneAttiva';
import AggiungiFatturazionePassiva                                     from './pages/AggiungiPagine/AggiungiFatturazionePassiva';
import AggiungiFornitore                                               from './pages/AggiungiPagine/AggiungiFornitore';
import AggiungiNeed                                                    from './pages/AggiungiPagine/AggiungiNeed';
import AggiungiNeedID                                                  from './pages/AggiungiPagine/AggiungiNeedID.jsx';
import AggiungiProgetto                                                from './pages/AggiungiPagine/AggiungiProgetto';
import AggiungiDipendente                                              from './pages/AggiungiPagine/AggiungiDipendente';
import ModificaAzienda                                                 from './pages/ModificaPagine/ModificaAzienda.jsx';
import DettaglioKeyPeople                                              from './pages/DettaglioPagine/DettaglioKeyPeople.jsx';
import ModificaContatto                                                from './pages/ModificaPagine/ModificaContatto.jsx';
import ListaNeed                                                       from './pages/DettaglioPagine/ListaNeed.jsx';
import NeedMatchPages                                                  from './pages/DettaglioPagine/NeedMatchPages.jsx';
import ModificaNeed                                                    from './pages/ModificaPagine/ModificaNeed.jsx';
import Interviste                                                      from './pages/DettaglioPagine/Interviste.jsx';
import DettaglioIntervista                                             from './pages/DettaglioPagine/DettaglioIntervista.jsx';
import ModificaIntervista                                              from './pages/ModificaPagine/ModificaIntervista.jsx';
import ModificaProgetto                                                from './pages/ModificaPagine/ModificaProgetto.jsx';
import ModificaFatturazionePassiva                                     from './pages/ModificaPagine/ModificaFatturazionePassiva.jsx';
import ModificaFornitori                                               from './pages/ModificaPagine/ModificaFornitori.jsx';
import DettaglioDipendente                                             from './pages/DettaglioPagine/DettaglioDipendente.jsx';
import Associazioni                                                    from './pages/DettaglioPagine/Associazioni.jsx';
import ModificaStaffing                                                from './pages/ModificaPagine/ModificaStaffing.jsx';
import ModificaFatturazioneAttiva                                      from './pages/ModificaPagine/ModificaFatturazioneAttiva.jsx';
import TimesheetPages                                                  from './pages/TimesheetPages.jsx';
import AggiungiIntervista                                              from './pages/AggiungiPagine/AggiungiIntervista.jsx';
import EstraiReport                                                    from './pages/DettaglioPagine/EstraiReport.jsx';
import authService                                                     from './services/auth.service.js';
import UserHomepage                                                    from './pages/UserPagine/UserHomepage.jsx';
import UserTimesheet                                                   from './pages/UserPagine/UserTimesheet.jsx';
import DettaglioNeed                                                   from './pages/DettaglioPagine/DettaglioNeed.jsx';
import ModificaDipendente                                              from './pages/ModificaPagine/ModificaDipendente.jsx';
import DettaglioAziende2                                               from './pages/DettaglioPagine/DettaglioAziende2.jsx';
import LoginPageTorchy from './pages/LoginTorchy.jsx';


import SidebarTorchy from './components/SidebarTorchy.jsx';
import AziendeTorchy from './pages/AziendeTorchy.jsx';
import NeedTorchy from './pages/NeedTorchy.jsx';
import NeedTorchy2 from './pages/NeedTorchy2.jsx';
import ModificaNeedTorchy from './pages/ModificaPagine/ModificaNeedTorchy.jsx';
import DettaglioNeedTorchy from './pages/DettaglioPagine/DettaglioNeedTorchy.jsx';

const App = () => {

  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);

    const onLoginSuccess = () => {
      const user = authService.getCurrentUser();
      setCurrentUser(user);
    };

    eventBus.on("loginSuccess", onLoginSuccess);

    const handleBeforeUnload = (event) => {
      localStorage.clear(); 
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      eventBus.remove("loginSuccess", onLoginSuccess);
      window.removeEventListener('beforeunload', handleBeforeUnload); 
    };
  }, []);
    
    const logOut = () => {
      authService.logout();
      setCurrentUser(undefined);

  };

  const getUserRole = () => {
    return currentUser && currentUser.roles && currentUser.roles[0];
  };

  const isAdmin           = getUserRole() === "ROLE_ADMIN";
  const isUser            = getUserRole() === "ROLE_USER";
  const isBm              = getUserRole() === "ROLE_BM";
  const isRecruiter       = getUserRole() === "ROLE_RECRUITER";
  

  // return (
  //   <BrowserRouter>
  //   <Routes>
  //     <Route path="/" element={<SidebarTorchy />} />
  //     </Routes>
  //     </BrowserRouter>
  // );


  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<LoginPageTorchy />} />
        <Route path="/login" element={<LoginPageTorchy />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/homepage"                                     element={<Homepage/>  } /> */}

        {(isAdmin || isBm || isRecruiter ) && (
          <>
          

          <Route path="/homepage"                                     element={<PrivateRoute>         <Homepage                    />   </PrivateRoute>} />
          <Route path="/home"                                         element={<PrivateRoute>         <Home                        />   </PrivateRoute>} />
          <Route path="/aziende"                                      element={<PrivateRoute>         <Aziende               />   </PrivateRoute>} />
          <Route path="/aziende/dettaglio/:id"                        element={<PrivateRoute>         <DettaglioAziende2           />   </PrivateRoute>} />
          <Route path="/aziende/modifica/:id"                         element={<PrivateRoute>         <ModificaAzienda             />   </PrivateRoute>} />
          <Route path="/keyPeople/modifica/:id"                       element={<PrivateRoute>         <ModificaContatto            />   </PrivateRoute>} />
          <Route path="/keyPeople/dettaglio/:id"                      element={<PrivateRoute>         <DettaglioKeyPeople          />   </PrivateRoute>} />
          <Route path="/keyPeople"                                    element={<PrivateRoute>         <KeyPeople                   />   </PrivateRoute>} />
          <Route path="/keyPeople/aggiungi"                           element={<PrivateRoute>         <AggiungiContatto            />   </PrivateRoute>} />
          <Route path="/need"                                         element={<PrivateRoute>         <NeedTorchy2                  />   </PrivateRoute>} />
          <Route path="/need/:id"                                     element={<PrivateRoute>         <ListaNeed                   />   </PrivateRoute>} />
          <Route path="/need/aggiungi/:id"                            element={<PrivateRoute>         <AggiungiNeedID              />   </PrivateRoute>} />
          <Route path="/need/match/:id"                               element={<PrivateRoute>         <NeedMatchPages              />   </PrivateRoute>} />
          <Route path="/recruiting"                                   element={<PrivateRoute>         <Recruiting                  />   </PrivateRoute>} />
          <Route path="/progetti"                                     element={<PrivateRoute>         <Progetti                    />   </PrivateRoute>} />
          <Route path="/progetti/modifica/:id"                        element={<PrivateRoute>         <ModificaProgetto            />   </PrivateRoute>} />
          <Route path="/fatturazioneAttiva"                           element={<PrivateRoute>         <FatturazioneAttiva          />   </PrivateRoute>} />
          <Route path="/fatturazione/passiva"                         element={<PrivateRoute>         <FatturazionePassiva         />   </PrivateRoute>} />
          <Route path="/fatturazione/passiva/modifica/:id"            element={<PrivateRoute>         <ModificaFatturazionePassiva />   </PrivateRoute>} />
          <Route path="/fornitori"                                    element={<PrivateRoute>         <Fornitori                   />   </PrivateRoute>} />
          <Route path="/fornitori/modifica/:id"                       element={<PrivateRoute>         <ModificaFornitori           />   </PrivateRoute>} />
          <Route path="/tesoreria"                                    element={<PrivateRoute>         <Tesoreria                   />   </PrivateRoute>} />
          <Route path="/hr"                                           element={<PrivateRoute>         <HR                          />   </PrivateRoute>} />
          <Route path="/hr/staff/modifica/:id"                        element={<PrivateRoute>         <ModificaDipendente          />   </PrivateRoute>} />
          <Route path="/hr/staff/visualizza/:id"                      element={<PrivateRoute>         <DettaglioDipendente         />   </PrivateRoute>} />
          <Route path="/aziende/aggiungi"                             element={<PrivateRoute>         <AggiungiAzienda             />   </PrivateRoute>} />
          <Route path="/need/aggiungi"                                element={<PrivateRoute>         <AggiungiNeed                />   </PrivateRoute>} />
          <Route path="/need/modifica/:id"                            element={<PrivateRoute>         <ModificaNeedTorchy                />   </PrivateRoute>} />
          <Route path="/need/dettaglio/:id"                           element={<PrivateRoute>         <DettaglioNeedTorchy               />   </PrivateRoute>} />
          <Route path="/recruiting/aggiungi"                          element={<PrivateRoute>         <AggiungiCandidato           />   </PrivateRoute>} />
          <Route path="/progetti/aggiungi"                            element={<PrivateRoute>         <AggiungiProgetto            />   </PrivateRoute>} />
          <Route path="/fatturazioneAttiva/aggiungi"                  element={<PrivateRoute>         <AggiungiFatturazioneAttiva  />   </PrivateRoute>} />
          <Route path="/fatturazioneAttiva/modifica/:id"              element={<PrivateRoute>         <ModificaFatturazioneAttiva  />   </PrivateRoute>} />
          <Route path="/fatturazione/passiva/aggiungi"                element={<PrivateRoute>         <AggiungiFatturazionePassiva />   </PrivateRoute>} />
          <Route path="/fornitori/aggiungi"                           element={<PrivateRoute>         <AggiungiFornitore           />   </PrivateRoute>} />
          <Route path="/hr/staff/aggiungi"                            element={<PrivateRoute>         <AggiungiDipendente          />   </PrivateRoute>} />
          <Route path="/staffing/intervista/:id"                      element={<PrivateRoute>         <Interviste                  />   </PrivateRoute>} />
          <Route path="/intervista/visualizza/:id"                    element={<PrivateRoute>         <DettaglioIntervista         />   </PrivateRoute>} />
          <Route path="/intervista/modifica/:id"                      element={<PrivateRoute>         <ModificaIntervista          />   </PrivateRoute>} />
          <Route path="/intervista/aggiungi"                          element={<PrivateRoute>         <AggiungiIntervista          />   </PrivateRoute>} />
          {/* <Route path="/associazioni/:id/:nome"                       element={<PrivateRoute>         <Associazioni                />   </PrivateRoute>} /> */}
          <Route path="/staffing/modifica/:id"                        element={<PrivateRoute>         <ModificaStaffing            />   </PrivateRoute>} />
          <Route path="/hr/staff/timesheet/:id"                       element={<PrivateRoute>         <TimesheetPages              />   </PrivateRoute>} />
          <Route path="/hr/report"                                    element={<PrivateRoute>         <EstraiReport                />   </PrivateRoute>} />
          {/* <Route path="/logout"                                       exact component={LogoutPopUp}                                /> */}

          </>
        )}

        {isUser && (
          <>
  
            <Route path="/userHomepage"  element={<PrivateRoute><UserHomepage  /></PrivateRoute>} />
            <Route path="/userTimesheet" element={<PrivateRoute><UserTimesheet /></PrivateRoute>} />
          </>
        )}

        {!currentUser && (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default App;