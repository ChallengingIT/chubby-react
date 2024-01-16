import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';


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





const App = () => {

  return (
    <div className='app-container'>
      <BrowserRouter>
        <Routes>
          <Route path="/"                                             element={<Homepage                    />} />
          <Route path="/login"                                        element={<Login                       />} />
          <Route path="/register"                                     element={<Register                    />} />
          <Route path="/homepage"                                     element={<Homepage                    />} />
          <Route path="/home"                                         element={<Home                        />} />
          <Route path="/aziende"                                      element={<Aziende                     />} />
          <Route path="/aziende/dettaglio/:id"                        element={<DettaglioAziende            />} />
          <Route path="/aziende/modifica/:id"                         element={<ModificaAzienda             />} />
          <Route path="/keyPeople/modifica/:id"                       element={<ModificaContatto            />} />
          <Route path="/keyPeople/dettaglio/:id"                      element={<DettaglioKeyPeople          />} />
          <Route path="/keyPeople"                                    element={<KeyPeople                   />} />
          <Route path="/keyPeople/aggiungi"                           element={<AggiungiContatto            />} />
          <Route path="/need"                                         element={<Need                        />} />
          <Route path="/need/:id"                                     element={<ListaNeed                   />} />
          <Route path="/need/aggiungi/:id"                            element={<AggiungiNeedID              />} />
          <Route path="/need/match/:id"                               element={<NeedMatchPages              />} />
          <Route path="/recruiting"                                   element={<Recruiting                  />} />
          <Route path="/progetti"                                     element={<Progetti                    />} />
          <Route path="/progetti/modifica/:id"                        element={<ModificaProgetto            />} />
          <Route path="/fatturazioneAttiva"                           element={<FatturazioneAttiva          />} />
          <Route path="/fatturazionePassiva"                          element={<FatturazionePassiva         />} />
          <Route path="/fatturazione/passiva/modifica/:id"            element={<ModificaFatturazionePassiva />} />
          <Route path="/fornitori"                                    element={<Fornitori                   />} />
          <Route path="/fornitori/modifica/:id"                       element={<ModificaFornitori           />} />
          <Route path="/tesoreria"                                    element={<Tesoreria                   />} />
          <Route path="/hr"                                           element={<HR                          />} />
          <Route path="/hr/staff/modifica/:id"                        element={<ModificaDipendente          />} />
          <Route path="/hr/staff/visualizza/:id"                      element={<DettaglioDipendente         />} />
          <Route path="/aziende/aggiungi"                             element={<AggiungiAzienda             />} />
          <Route path="/need/aggiungi"                                element={<AggiungiNeed                />} />
          <Route path="/need/modifica/:id"                            element={<ModificaNeed                />} />
          <Route path="/recruiting/aggiungi"                          element={<AggiungiCandidato           />} />
          <Route path="/progetti/aggiungi"                            element={<AggiungiProgetto            />} />
          <Route path="/fatturazioneAttiva/aggiungi"                  element={<AggiungiFatturazioneAttiva  />} />
          <Route path="/fatturazioneAttiva/modifica/:id"              element={<ModificaFatturazioneAttiva  />} />
          <Route path="/fatturazionePassiva/aggiungi"                 element={<AggiungiFatturazionePassiva />} />
          <Route path="/fornitori/aggiungi"                           element={<AggiungiFornitore           />} />
          <Route path="/hr/staff/aggiungi"                            element={<AggiungiDipendente          />} />
          <Route path="/hr/crea/utente"                               element={<AggiungiUser                />} />
          <Route path="/staffing/intervista/:id"                      element={<Interviste                  />} />
          <Route path="/intervista/visualizza/:id"                    element={<DettaglioIntervista         />} />
          <Route path="/intervista/modifica/:id"                      element={<ModificaIntervista          />} />
          <Route path="/intervista/aggiungi"                          element={<AggiungiIntervista          />} />
          <Route path="/associazioni/:id/:nome"                       element={<Associazioni                />} />
          <Route path="/staffing/modifica/:id"                        element={<ModificaStaffing            />} />
          <Route path="/hr/staff/timesheet/:id"                       element={<TimesheetPages              />} />
          <Route path="/hr/report"                                    element={<EstraiReport                />} />
          <Route path="/logout"                                       exact component={LogoutPopUp}             />
        </Routes>
      </BrowserRouter>
    </div>
  );



  // return (
  //   <div className='app-container'>
  //     <BrowserRouter>
  //       <Routes>
  //         <Route path="/" element={<Recruiting />} />
  //         <Route path="/staffing/intervista/:nome/:nomeAzienda"                     element={<Prova                    />} />
  //       </Routes>
  //     </BrowserRouter>
  //   </div>
  // );


};

export default App;
