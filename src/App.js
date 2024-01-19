import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';


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
import Login                                                           from './pages/Login.jsx';
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
import LogoutPopUp                                                     from './components/LogoutPopUp';
import AggiungiDipendente                                              from './pages/AggiungiPagine/AggiungiDipendente';
import AggiungiUser                                                    from './pages/AggiungiPagine/AggiungiUser.jsx';
import DettaglioAziende                                                from './pages/DettaglioPagine/DettaglioAziende.jsx';
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
import ModificaDipendente                                              from './pages/ModificaPagine/ModificaDipendente.jsx';
import DettaglioDipendente                                             from './pages/DettaglioPagine/DettaglioDipendente.jsx';
import Associazioni                                                    from './pages/DettaglioPagine/Associazioni.jsx';
import ModificaStaffing                                                from './pages/ModificaPagine/ModificaStaffing.jsx';
import ModificaFatturazioneAttiva                                      from './pages/ModificaPagine/ModificaFatturazioneAttiva.jsx';
import TimesheetPages                                                  from './pages/TimesheetPages.jsx';
import AggiungiIntervista                                              from './pages/AggiungiPagine/AggiungiIntervista.jsx';
import EstraiReport                                                    from './pages/DettaglioPagine/EstraiReport.jsx';
import ReportComponent from './components/ReportComponent.jsx';
import ReportPage from './pages/ReportPage.jsx';
import authService from './services/auth.service.js';







const App = () => {

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const PrivateRoute = ({ children }) => {
    return currentUser ? children : <Navigate to="/login" />;
  };











  // return (
  //   <div className='app-container'>
  //     <BrowserRouter>
  //       <Routes>
  //       <Route path="/" element={<Homepage />} />



          
  //         <Route path="/login"                                        element={<Login                       />} />
  //         <Route path="/register"                                     element={<Register                    />} />
  //         <Route path="/homepage"                                     element={<Homepage                    />} />
  //         <Route path="/home"                                         element={<Home                        />} />
  //         <Route path="/aziende"                                      element={<Aziende                     />} />
  //         <Route path="/aziende/dettaglio/:id"                        element={<DettaglioAziende            />} />
  //         <Route path="/aziende/modifica/:id"                         element={<ModificaAzienda             />} />
  //         <Route path="/keyPeople/modifica/:id"                       element={<ModificaContatto            />} />
  //         <Route path="/keyPeople/dettaglio/:id"                      element={<DettaglioKeyPeople          />} />
  //         <Route path="/keyPeople"                                    element={<KeyPeople                   />} />
  //         <Route path="/keyPeople/aggiungi"                           element={<AggiungiContatto            />} />
  //         <Route path="/need"                                         element={<Need                        />} />
  //         <Route path="/need/:id"                                     element={<ListaNeed                   />} />
  //         <Route path="/need/aggiungi/:id"                            element={<AggiungiNeedID              />} />
  //         <Route path="/need/match/:id"                               element={<NeedMatchPages              />} />
  //         <Route path="/recruiting"                                   element={<Recruiting                  />} />
  //         <Route path="/progetti"                                     element={<Progetti                    />} />
  //         <Route path="/progetti/modifica/:id"                        element={<ModificaProgetto            />} />
  //         <Route path="/fatturazioneAttiva"                           element={<FatturazioneAttiva          />} />
  //         <Route path="/fatturazionePassiva"                          element={<FatturazionePassiva         />} />
  //         <Route path="/fatturazione/passiva/modifica/:id"            element={<ModificaFatturazionePassiva />} />
  //         <Route path="/fornitori"                                    element={<Fornitori                   />} />
  //         <Route path="/fornitori/modifica/:id"                       element={<ModificaFornitori           />} />
  //         <Route path="/tesoreria"                                    element={<Tesoreria                   />} />
  //         <Route path="/hr"                                           element={<HR                          />} />
  //         <Route path="/hr/staff/modifica/:id"                        element={<ModificaDipendente          />} />
  //         <Route path="/hr/staff/visualizza/:id"                      element={<DettaglioDipendente         />} />
  //         <Route path="/aziende/aggiungi"                             element={<AggiungiAzienda             />} />
  //         <Route path="/need/aggiungi"                                element={<AggiungiNeed                />} />
  //         <Route path="/need/modifica/:id"                            element={<ModificaNeed                />} />
  //         <Route path="/recruiting/aggiungi"                          element={<AggiungiCandidato           />} />
  //         <Route path="/progetti/aggiungi"                            element={<AggiungiProgetto            />} />
  //         <Route path="/fatturazioneAttiva/aggiungi"                  element={<AggiungiFatturazioneAttiva  />} />
  //         <Route path="/fatturazioneAttiva/modifica/:id"              element={<ModificaFatturazioneAttiva  />} />
  //         <Route path="/fatturazionePassiva/aggiungi"                 element={<AggiungiFatturazionePassiva />} />
  //         <Route path="/fornitori/aggiungi"                           element={<AggiungiFornitore           />} />
  //         <Route path="/hr/staff/aggiungi"                            element={<AggiungiDipendente          />} />
  //         <Route path="/hr/crea/utente"                               element={<AggiungiUser                />} />
  //         <Route path="/staffing/intervista/:id"                      element={<Interviste                  />} />
  //         <Route path="/intervista/visualizza/:id"                    element={<DettaglioIntervista         />} />
  //         <Route path="/intervista/modifica/:id"                      element={<ModificaIntervista          />} />
  //         <Route path="/intervista/aggiungi"                          element={<AggiungiIntervista          />} />
  //         <Route path="/associazioni/:id/:nome"                       element={<Associazioni                />} />
  //         <Route path="/staffing/modifica/:id"                        element={<ModificaStaffing            />} />
  //         <Route path="/hr/staff/timesheet/:id"                       element={<TimesheetPages              />} />
  //         <Route path="/hr/report"                                    element={<EstraiReport                />} />
  //         <Route path="/logout"                                       exact component={LogoutPopUp}             />
  //       </Routes>
  //     </BrowserRouter>
  //   </div>
  // );




  return (
    <div className='app-container'>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/login"                                        element={<Login                       />} />
          <Route path="/register"                                     element={<Register                    />} />
          <Route path="/homepage"                                     element={<PrivateRoute>         <Homepage                    />   </PrivateRoute>} />
          <Route path="/home"                                         element={<PrivateRoute>         <Home                        />   </PrivateRoute>} />
          <Route path="/aziende"                                      element={<PrivateRoute>         <Aziende                     />   </PrivateRoute>} />
          <Route path="/aziende/dettaglio/:id"                        element={<PrivateRoute>         <DettaglioAziende            />   </PrivateRoute>} />
          <Route path="/aziende/modifica/:id"                         element={<PrivateRoute>         <ModificaAzienda             />   </PrivateRoute>} />
          <Route path="/keyPeople/modifica/:id"                       element={<PrivateRoute>         <ModificaContatto            />   </PrivateRoute>} />
          <Route path="/keyPeople/dettaglio/:id"                      element={<PrivateRoute>         <DettaglioKeyPeople          />   </PrivateRoute>} />
          <Route path="/keyPeople"                                    element={<PrivateRoute>         <KeyPeople                   />   </PrivateRoute>} />
          <Route path="/keyPeople/aggiungi"                           element={<PrivateRoute>         <AggiungiContatto            />   </PrivateRoute>} />
          <Route path="/need"                                         element={<PrivateRoute>         <Need                        />   </PrivateRoute>} />
          <Route path="/need/:id"                                     element={<PrivateRoute>         <ListaNeed                   />   </PrivateRoute>} />
          <Route path="/need/aggiungi/:id"                            element={<PrivateRoute>         <AggiungiNeedID              />   </PrivateRoute>} />
          <Route path="/need/match/:id"                               element={<PrivateRoute>         <NeedMatchPages              />   </PrivateRoute>} />
          <Route path="/recruiting"                                   element={<PrivateRoute>         <Recruiting                  />   </PrivateRoute>} />
          <Route path="/progetti"                                     element={<PrivateRoute>         <Progetti                    />   </PrivateRoute>} />
          <Route path="/progetti/modifica/:id"                        element={<PrivateRoute>         <ModificaProgetto            />   </PrivateRoute>} />
          <Route path="/fatturazioneAttiva"                           element={<PrivateRoute>         <FatturazioneAttiva          />   </PrivateRoute>} />
          <Route path="/fatturazionePassiva"                          element={<PrivateRoute>         <FatturazionePassiva         />   </PrivateRoute>} />
          <Route path="/fatturazione/passiva/modifica/:id"            element={<PrivateRoute>         <ModificaFatturazionePassiva />   </PrivateRoute>} />
          <Route path="/fornitori"                                    element={<PrivateRoute>         <Fornitori                   />   </PrivateRoute>} />
          <Route path="/fornitori/modifica/:id"                       element={<PrivateRoute>         <ModificaFornitori           />   </PrivateRoute>} />
          <Route path="/tesoreria"                                    element={<PrivateRoute>         <Tesoreria                   />   </PrivateRoute>} />
          <Route path="/hr"                                           element={<PrivateRoute>         <HR                          />   </PrivateRoute>} />
          <Route path="/hr/staff/modifica/:id"                        element={<PrivateRoute>         <ModificaDipendente          />   </PrivateRoute>} />
          <Route path="/hr/staff/visualizza/:id"                      element={<PrivateRoute>         <DettaglioDipendente         />   </PrivateRoute>} />
          <Route path="/aziende/aggiungi"                             element={<PrivateRoute>         <AggiungiAzienda             />   </PrivateRoute>} />
          <Route path="/need/aggiungi"                                element={<PrivateRoute>         <AggiungiNeed                />   </PrivateRoute>} />
          <Route path="/need/modifica/:id"                            element={<PrivateRoute>         <ModificaNeed                />   </PrivateRoute>} />
          <Route path="/recruiting/aggiungi"                          element={<PrivateRoute>         <AggiungiCandidato           />   </PrivateRoute>} />
          <Route path="/progetti/aggiungi"                            element={<PrivateRoute>         <AggiungiProgetto            />   </PrivateRoute>} />
          <Route path="/fatturazioneAttiva/aggiungi"                  element={<PrivateRoute>         <AggiungiFatturazioneAttiva  />   </PrivateRoute>} />
          <Route path="/fatturazioneAttiva/modifica/:id"              element={<PrivateRoute>         <ModificaFatturazioneAttiva  />   </PrivateRoute>} />
          <Route path="/fatturazionePassiva/aggiungi"                 element={<PrivateRoute>         <AggiungiFatturazionePassiva />   </PrivateRoute>} />
          <Route path="/fornitori/aggiungi"                           element={<PrivateRoute>         <AggiungiFornitore           />   </PrivateRoute>} />
          <Route path="/hr/staff/aggiungi"                            element={<PrivateRoute>         <AggiungiDipendente          />   </PrivateRoute>} />
          <Route path="/hr/crea/utente"                               element={<PrivateRoute>         <AggiungiUser                />   </PrivateRoute>} />
          <Route path="/staffing/intervista/:id"                      element={<PrivateRoute>         <Interviste                  />   </PrivateRoute>} />
          <Route path="/intervista/visualizza/:id"                    element={<PrivateRoute>         <DettaglioIntervista         />   </PrivateRoute>} />
          <Route path="/intervista/modifica/:id"                      element={<PrivateRoute>         <ModificaIntervista          />   </PrivateRoute>} />
          <Route path="/intervista/aggiungi"                          element={<PrivateRoute>         <AggiungiIntervista          />   </PrivateRoute>} />
          <Route path="/associazioni/:id/:nome"                       element={<PrivateRoute>         <Associazioni                />   </PrivateRoute>} />
          <Route path="/staffing/modifica/:id"                        element={<PrivateRoute>         <ModificaStaffing            />   </PrivateRoute>} />
          <Route path="/hr/staff/timesheet/:id"                       element={<PrivateRoute>         <TimesheetPages              />   </PrivateRoute>} />
          <Route path="/hr/report"                                    element={<PrivateRoute>         <EstraiReport                />   </PrivateRoute>} />
          <Route path="/hr/staff/timesheet/:id"                       element={<PrivateRoute>         <TimesheetPages              />   </PrivateRoute>} />
          <Route path="/logout"                                       exact component={LogoutPopUp}             />
        </Routes>
      </BrowserRouter>
    </div>
  );


};

export default App;
