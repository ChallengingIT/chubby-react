import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Modal,
  Box,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Tab,
  Tabs
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

import Tabella from "../components/Tabella.jsx";
import ModalBox from "../components/ModalBox.jsx";
import CloseIconButton from "../components/button/CloseIconButton.jsx";
import IntervistaButton from "../components/button/IntervistaButton.jsx";
import ClipButton from "../components/button/ClipButton.jsx";
import SchemePage from "../components/SchemePage.jsx";
import NuovaRicercaNeedMatch from "../components/nuoveRicerche/NuovaRicercaNeedMatch.jsx";
import CheckListButton from "../components/button/CheckListButton.jsx";
import IntervisteModalButton from "../components/button/IntervisteModalButton.jsx";
import IntervisteModal from "../components/modal/IntervisteModal.jsx";
import TabellaCandidati from "../components/Tabelle/TabellaCandidati.jsx";

const NeedMatch = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const { id } = useParams();

  const DEFAULT_POOL_VIEW = "ALL";


  const location = useLocation();
  const valori = location?.state;

  const descrizione = valori?.descrizione ?? "";
  const nomeAzienda = valori?.cliente?.denominazione ?? "";

  const [originalCandidatiAll, setOriginalCandidatiAll] = useState([]);
  const [originalStorico, setOriginalStorico] = useState([]);
  const [originalAssociati, setOriginalAssociati] = useState([]);

  const [righeTotStorico, setRigheTotStorico] = useState(0);
  const [righeTotAssociati, setRigheTotAssociati] = useState(0);

  const [ownerOptions, setOwnerOptions] = useState([]);
  const [statoOptions, setStatoOptions] = useState([]);
  const [tipoOptions, setTipoOptions] = useState([]);
  const [tipologiaOptions, setTipologiaOptions] = useState([]);  
  const [poolView, setPoolView ] = useState(() => {
    return sessionStorage.getItem("poolView") || DEFAULT_POOL_VIEW;
  });

  const tipologiaMap = useMemo(() => {
    const m = new Map();
    (tipologiaOptions ?? []).forEach((o) => {
      const id = Number(o.value);
      if (Number.isFinite(id)) m.set(id, o.label ?? "");
    });
    return m;
  }, [tipologiaOptions]);

  const tipoMap = useMemo(() => {
    const m = new Map();
    (tipoOptions ?? []).forEach((o) => {
      const id = Number(o.value);
      if (Number.isFinite(id)) m.set(id, o.label ?? "");
    });
    return m;
  }, [tipoOptions]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialValuesAggiorna, setInitialValuesAggiorna] = useState([]);

  const [openModalIntervista, setOpenModalIntervista] = useState(false);
  const [selectedIntervista, setSelectedIntervista] = useState(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleCloseDialog = () => {
    setSelectedRow(null);
    setOpenDialog(false);
  };

  const [paginaCandidati, setPaginaCandidati] = useState(0);
  const [paginaStorico, setPaginaStorico] = useState(0);
  const [paginaAssociati, setPaginaAssociati] = useState(0);

  const quantita = 10;

  const user = useMemo(() => {
    const raw = sessionStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  }, []);

  const token = user?.token;

  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
    }),
    [token]
  );

  const userHasRole = (roleToCheck) => {
    const userString = sessionStorage.getItem("user");
    if (!userString) return false;
    const userObj = JSON.parse(userString);
    return Array.isArray(userObj.roles) && userObj.roles.includes(roleToCheck);
  };

  const getOwnerUrl = () => {
    const userString = sessionStorage.getItem("user");
    const u = userString ? JSON.parse(userString) : null;
    const username = u?.username;

    return userHasRole("ADMIN")
      ? "http://localhost:8080/owner"
      : `http://localhost:8080/owner/${username}`;
  };


  const seniorityOptions = useMemo(
    () => [
      { label: "Neo", value: "0", min: 0, max: 1 },
      { label: "Junior", value: "1", min: 1, max: 2 },
      { label: "Middle", value: "2", min: 2, max: 3 },
      { label: "Senior", value: "3", min: 3 },
    ],
    []
  );

  const [filtri, setFiltri] = useState(() => {
    const filtriSalvati = sessionStorage.getItem("filtriRicercaNeedMatch");
    return filtriSalvati
      ? JSON.parse(filtriSalvati)
      : {
          nome: null,
          cognome: null,
          tipologia: null,
          tipo: null,
          seniority: null,
        };
  });

  useEffect(() => {
    sessionStorage.setItem("filtriRicercaNeedMatch", JSON.stringify(filtri));
  }, [filtri]);

  const areFiltersActive = (obj) =>
    Object.values(obj).some((v) => v !== null && v !== "" && v !== undefined);

  const getMinMaxBySeniority = (seniorityValue) => {
    if (!seniorityValue) return { minimo: null, massimo: null };
    const found = seniorityOptions.find((s) => s.value === seniorityValue);
    if (!found) return { minimo: null, massimo: null };
    return {
      minimo: found.min ?? null,
      massimo: found.max ?? null,
    };
  };

  const navigateToCercaCandidato = (params) => {
    navigate("/recruiting", { state: { params } });
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const fadeInVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };
  const fetchAllAssociabili = async () => {
    const baseUrl = `http://localhost:8080/need/react/match/associabili/mod/${id}`;

    const chunk = 200;
    let pagina = 0;
    let all = [];

    try {
      while (true) {
        const resp = await axios.get(baseUrl, {
          headers: headers,
          params: { pagina, quantita: chunk },
        });

        const data = resp?.data ?? {};
        const items = Array.isArray(data?.candidati) ? data.candidati : [];
        const record = typeof data?.record === "number" ? data.record : null;

        all = all.concat(items);

        if (record === null) break;
        if (all.length >= record) break;
        if (items.length < chunk) break;

        pagina += 1;
      }

      setOriginalCandidatiAll(all);
    } catch (error) {
      console.error("Errore durante il recupero associabili (tutti): ", error);

      try {
        const resp = await axios.get(baseUrl, { headers });
        const data = resp?.data ?? {};
        setOriginalCandidatiAll(Array.isArray(data?.candidati) ? data.candidati : []);
      } catch (e2) {
        console.error("Errore fallback associabili: ", e2);
        setOriginalCandidatiAll([]);
      }
    }
  };

  const fetchStoricoPage = async (page) => {
    const paginazione = { pagina: page, quantita };
    const resp = await axios.get(`http://localhost:8080/need/react/storico/${id}`, {
      headers,
      params: paginazione,
    });

    const data = resp?.data ?? {};
    setRigheTotStorico(data?.record ?? 0);
    setOriginalStorico(Array.isArray(data?.associazioni) ? data.associazioni : []);
  };

  const fetchAssociatiPage = async (page) => {
    const paginazione = { pagina: page, quantita };
    const resp = await axios.get(
      `http://localhost:8080/need/react/match/associati/mod/${id}`,
      {
        headers: headers,
        params: paginazione,
      }
    );

    const data = resp?.data ?? {};
    setRigheTotAssociati(data?.record ?? 0);
    setOriginalAssociati(Array.isArray(data?.candidati) ? data.candidati : []);
  };

  const fetchOptions = async () => {
    const [responseTipologia, responseTipo, statoResponse, ownerResponse] =
      await Promise.all([
        axios.get("http://localhost:8080/aziende/react/tipologia", { headers: headers }),
        axios.get("http://localhost:8080/staffing/react/tipo", { headers: headers }),
        axios.get("http://localhost:8080/associazioni/react/stati", { headers: headers }),
        axios.get(getOwnerUrl(), { headers: headers }),
      ]);

    if (Array.isArray(ownerResponse.data)) {
      setOwnerOptions(
        ownerResponse.data.map((owner) => ({
          label: owner.descrizione,
          value: owner.id,
        }))
      );
    }

    if (Array.isArray(statoResponse.data)) {
      setStatoOptions(
        statoResponse.data.map((stato) => ({
          label: stato.descrizione,
          value: stato.id,
        }))
      );
    }

    if (Array.isArray(responseTipologia.data)) {
      setTipologiaOptions(
        responseTipologia.data.map((tipologia) => ({
          label: tipologia.descrizione,
          value: tipologia.id,
        }))
      );
    }

    if (Array.isArray(responseTipo.data)) {
      setTipoOptions(
        responseTipo.data.map((tipo) => ({
          label: tipo.descrizione,
          value: tipo.id,
        }))
      );
    }
  };

  const loadInitial = async () => {
    try {
      await Promise.all([
        fetchAllAssociabili(),
        fetchStoricoPage(0),
        fetchAssociatiPage(0),
        fetchOptions(),
      ]);
    } catch (error) {
      console.error("Errore durante il load iniziale: ", error);
    }
  };

  useEffect(() => {
    loadInitial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const normalize = (v) => (v ?? "").toString().trim().toLowerCase();

  const getFilterId = (v) => {
    if (v == null || v === "") return null;
    if (typeof v === "object") return v.value ?? v.id ?? null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  const filteredCandidatiAll = useMemo(() => {
    if (!Array.isArray(originalCandidatiAll)) return [];

    const hasActive = areFiltersActive(filtri);
    if (!hasActive) return originalCandidatiAll;

    const nomeF = normalize(filtri.nome);
    const cognomeF = normalize(filtri.cognome);

    const tipologiaIdFilter = getFilterId(filtri?.tipologia);
    const tipoIdFilter = getFilterId(filtri?.tipo);

    const { minimo, massimo } = getMinMaxBySeniority(filtri?.seniority);

    return originalCandidatiAll.filter((row) => {
      if (nomeF && !normalize(row?.nome).includes(nomeF)) return false;
      if (cognomeF && !normalize(row?.cognome).includes(cognomeF)) return false;

      if (tipologiaIdFilter != null) {
        if (Number(row?.tipologiaId) !== Number(tipologiaIdFilter)) return false;
      }

      if (tipoIdFilter != null) {
        const rowTipoId = row?.tipo?.id != null ? Number(row.tipo.id) : null;
        if (rowTipoId == null) return false;
        if (rowTipoId !== Number(tipoIdFilter)) return false;
      }

      if (minimo !== null || massimo !== null) {
        const r = Number(row?.rating);
        const rating = Number.isFinite(r) ? r : null;

        if (rating === null) return false;

        if (minimo !== null && rating < minimo) return false;
        if (massimo !== null && rating > massimo) return false;
      }

      return true;
    });
  }, [originalCandidatiAll, filtri, seniorityOptions]);

  const righeTotCandidati = filteredCandidatiAll.length;


  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(righeTotCandidati / quantita) - 1);
    if (paginaCandidati > maxPage) setPaginaCandidati(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [righeTotCandidati]);

  const handlePageChangeCandidati = (newPage) => {
    setPaginaCandidati(newPage);
  };

  const handlePageChangeStorico = async (newPageStorico) => {
    setPaginaStorico(newPageStorico);
    try {
      await fetchStoricoPage(newPageStorico);
    } catch (error) {
      console.error("Errore paginazione storico: ", error);
    }
  };

  const handlePageChangeAssociati = async (newPageAssociati) => {
    setPaginaAssociati(newPageAssociati);
    try {
      await fetchAssociatiPage(newPageAssociati);
    } catch (error) {
      console.error("Errore paginazione associati: ", error);
    }
  };

  const handleFilterChange = (name) => (event) => {
    const newValue = event?.target?.value ?? null;

    setFiltri((current) => ({ ...current, [name]: newValue }));
    setPaginaCandidati(0);
  };

  const handleReset = () => {
    const resetObj = {
      nome: "",
      cognome: "",
      tipo: null,
      tipologia: null,
      seniority: null,
    };

    setFiltri(resetObj);
    setPaginaCandidati(0);
    loadInitial();
  };

  const handleDeleteAssociati = async (row) => {
    try {
      const idNeed = parseInt(id, 10);
      const idCandidato = row;
      const url = `http://localhost:8080/associazioni/react/rimuovi/candidato/associa?idNeed=${idNeed}&idCandidato=${idCandidato}`;
      await axios.delete(url, { headers });

      await Promise.all([
        fetchAllAssociabili(),
        fetchStoricoPage(paginaStorico),
        fetchAssociatiPage(paginaAssociati),
      ]);
    } catch (error) {
      console.error("Errore durante l'eliminazione: ", error);
    }
  };

  const handleDeleteStorico = async (row) => {
    try {
      const idAssociazione = row;
      const url = `http://localhost:8080/associazioni/react/rimuovi/associa/${idAssociazione}`;
      await axios.delete(url, { headers });

      await Promise.all([
        fetchAllAssociabili(),
        fetchStoricoPage(paginaStorico),
        fetchAssociatiPage(paginaAssociati),
      ]);
    } catch (error) {
      console.error("Errore durante l'eliminazione: ", error);
    }
  };

  const handleAssocia = async (row) => {
    try {
      const idNeed = parseInt(id, 10);
      const idCandidato = row.id;

      await axios.post(
        `http://localhost:8080/associazioni/react/associa?idNeed=${idNeed}&idCandidato=${idCandidato}`,
        {},
        { headers }
      );

      await Promise.all([
        fetchAllAssociabili(),
        fetchStoricoPage(paginaStorico),
        fetchAssociatiPage(paginaAssociati),
      ]);
    } catch (error) {
      console.error("Errore durante l'associazione: ", error);
    }
  };

  const handleOpenModal = (selectedRow) => {
    const initialValuesWithDefaults = {
      cliente: nomeAzienda || "",
      idNeed: descrizione || "",
      candidato: `${selectedRow.nome || ""} ${selectedRow.cognome || ""}`.trim(),
      idCandidato: selectedRow.id || "",
      stato: null,
      idOwner: null,
    };

    setInitialValuesAggiorna(initialValuesWithDefaults);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveModal = async (selectedRow) => {
    try {
      const idNeedNum = parseInt(id, 10);
      const idCandidatoNum = parseInt(selectedRow.idCandidato, 10);

      const updateValues = {
        ...selectedRow,
        idNeed: idNeedNum,
        idCandidato: idCandidatoNum,
      };

      delete updateValues.candidato;
      delete updateValues.cliente;

      await axios.post(`http://localhost:8080/associazioni/salva`, updateValues, { headers });

      await Promise.all([
        fetchAllAssociabili(),
        fetchStoricoPage(paginaStorico),
        fetchAssociatiPage(paginaAssociati),
      ]);
    } catch (error) {
      console.error("Errore durante il salvataggio associazione: ", error);
    } finally {
      handleCloseModal();
    }
  };

  const handleDownloadCV = async (idFile, fileDescrizione) => {
    const url = `http://localhost:8080/files/react/download/file/${idFile}`;
    try {
      const responseDownloadCV = await axios({
        method: "GET",
        url,
        responseType: "blob",
        headers,
      });

      const fileURL = window.URL.createObjectURL(
        new Blob([responseDownloadCV.data], { type: "application/pdf" })
      );

      const link = document.createElement("a");
      link.href = fileURL;
      link.setAttribute("download", `${fileDescrizione}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Errore durante il download del file: ", error);
    }
  };

  const handleModalIntervista = async (idCandidato) => {
    try {
      const responseIntervista = await axios.get(
        `http://localhost:8080/intervista/ultima/${idCandidato}`,
        { headers }
      );
      setSelectedIntervista(responseIntervista.data);
      setOpenModalIntervista(true);
    } catch (error) {
      console.error("Errore durante il recupero dell'intervista: ", error);
    }
  };

  const fieldsAggiorna = [
    { label: t("Cliente"), name: "cliente", type: "text", sortable: false, filterable: false, disableColumnMenu: true },
    { label: t("Need"), name: "idNeed", type: "text", sortable: false, filterable: false, disableColumnMenu: true },
    { label: t("Candidato"), name: "candidato", type: "text", sortable: false, filterable: false, disableColumnMenu: true },
    {
      label: t("Stato"),
      name: "stato",
      type: "select",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      options: statoOptions || [],
    },
    { label: t("Data Aggiornamento"), name: "dataModifica", type: "date", sortable: false, filterable: false, disableColumnMenu: true },
    {
      label: t("Owner"),
      name: "idOwner",
      type: "select",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      options: ownerOptions || [],
    },
  ];

  const disableFields = { cliente: true, idNeed: true, candidato: true };

  const tabellaCandidati = [
    {
      field: "nome",
      headerName: t("Nome"),
      flex: 1,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const isHotpool = params.row?.pool === 2;

        return (
          <Box
            onClick={() => navigateToCercaCandidato(params.row)}
            sx={{
              cursor: "pointer",
              color: isHotpool ? "#00B400" : "black",
              fontWeight: isHotpool ? 700 : 400,
              textDecoration: "underline",
              "&:hover": { opacity: 0.85 },
            }}
          >
            {params.row.nome} {params.row.cognome}
          </Box>
        );
      },
    },
    {
      field: "tipologia",
      headerName: t("Job Title"),
      flex: 1,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const descr =
          params.row?.tipologiaDescrizione ||
          tipologiaMap.get(Number(params.row?.tipologiaId)) ||
          "N/A";

        return <div style={{ textAlign: "start" }}>{descr}</div>;
      },
    },
    { field: "email", headerName: "E-Mail", flex: 1.4, sortable: false, filterable: false, disableColumnMenu: true },
    {
      field: "rating",
      headerName: t("Rating"),
      flex: 1,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <div style={{ textAlign: "start" }}>
          {params.row.rating !== null && params.row.rating !== undefined ? Number(params.row.rating).toFixed(2) : ""}
        </div>
      ),
    },
    {
      field: "stato",
      headerName: t("Stato"),
      flex: 1,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <div style={{ textAlign: "start" }}>
          {params.row.stato && params.row.stato.descrizione ? params.row.stato.descrizione : "N/A"}
        </div>
      ),
    },
    { field: "dataUltimoContatto", headerName: t("Contatto"), flex: 1, sortable: false, filterable: false, disableColumnMenu: true },
    {
      field: "azioni",
      headerName: "",
      flex: 1,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <div>
          <Tooltip title="Visualizza intervista">
            <span>
              <IntervisteModalButton
                hasIntervista={!!params.row?.hasInterviste}
                onClick={() => handleModalIntervista(params.row?.id)}
              />
            </span>
          </Tooltip>

          <Tooltip title="Visualizza CV">
            <span>
              <ClipButton
                hasFile={!!params.row?.file}
                idFile={params.row.file ? params.row.file.id : null}
                fileDescrizione={params.row.file ? params.row.file.descrizione : null}
                onClick={() =>
                  handleDownloadCV(
                    params.row.file ? params.row.file.id : null,
                    params.row.file ? params.row.file.descrizione : null
                  )
                }
              />
            </span>
          </Tooltip>

          <Tooltip title="Associa">
            <IconButton onClick={() => handleAssocia(params.row)}>
              <AddCircleIcon sx={{ color: "#00B400" }} />
            </IconButton>
          </Tooltip>
        </div>
      ),
    },
  ];

  const tabellaStorico = [
    { field: "dataModifica", headerName: t("Data"), flex: 1, sortable: false, filterable: false, disableColumnMenu: true },
    {
      field: "candidato",
      headerName: t("Nome"),
      flex: 1,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <div style={{ textAlign: "left" }}>
          <div onClick={() => navigateToCercaCandidato(params.row)}>
            {params.row.candidato ? `${params.row.candidato.nome} ${params.row.candidato.cognome}` : ""}
          </div>
        </div>
      ),
    },
    {
      field: "tipologia",
      headerName: t("Job Title"),
      flex: 1.5,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const cand = params.row?.candidato;
        const descr =
          cand?.tipologiaDescrizione ||
          tipologiaMap.get(Number(cand?.tipologiaId)) ||
          cand?.tipologia?.descrizione ||
          "N/A";
        return <div style={{ textAlign: "start" }}>{descr}</div>;
      },
    },
    {
      field: "rating",
      headerName: t("Rating"),
      flex: 0.7,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <div style={{ textAlign: "start" }}>
          {params.row?.candidato?.rating !== null && params.row?.candidato?.rating !== undefined
            ? Number(params.row.candidato.rating).toFixed(2)
            : ""}
        </div>
      ),
    },
    {
      field: "stato",
      headerName: t("Stato"),
      flex: 1,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <div style={{ textAlign: "start" }}>
          {params.row.stato && params.row.stato.descrizione ? params.row.stato.descrizione : "N/A"}
        </div>
      ),
    },
    {
      field: "tipo",
      headerName: t("Tipologia"),
      flex: 1,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const cand = params.row?.candidato;
        const descr =
          cand?.tipo?.descrizione ||
          tipoMap.get(Number(cand?.tipo?.id)) ||
          "N/A";
        return <div style={{ textAlign: "start" }}>{descr}</div>;
      },
    },
    {
      field: "owner",
      headerName: t("Owner"),
      flex: 0.5,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <div style={{ textAlign: "start" }}>
          {params.row.owner && params.row.owner.descrizione ? params.row.owner.descrizione : "N/A"}
        </div>
      ),
    },
    {
      field: "azioni",
      headerName: "",
      flex: 1,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <div>
          <Tooltip title="Elimina da storico">
            <span>
              <CloseIconButton onClick={handleDeleteStorico} id={params.row.id} />
            </span>
          </Tooltip>
        </div>
      ),
    },
  ];

  const tabellaAssociati = [
    {
      field: "nome",
      headerName: t("Nome"),
      flex: 1.3,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <div style={{ textAlign: "left" }}>
          <Link
            to={`/recruiting/modifica/${params.row.id}`}
            state={{ recruitingData: params.row }}
            style={{ color: "black" }}
          >
            {params.row.nome} {params.row.cognome}
          </Link>
        </div>
      ),
    },
    {
      field: "tipologia",
      headerName: t("Job Title"),
      flex: 1.4,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const descr =
          params.row?.tipologiaDescrizione ||
          tipologiaMap.get(Number(params.row?.tipologiaId)) ||
          params.row?.tipologia?.descrizione ||
          "N/A";
        return <div style={{ textAlign: "start" }}>{descr}</div>;
      },
    },
    {
      field: "rating",
      headerName: t("Rating"),
      flex: 0.5,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <div style={{ textAlign: "start" }}>
          {params.row.rating !== null && params.row.rating !== undefined ? Number(params.row.rating).toFixed(2) : ""}
        </div>
      ),
    },
    {
      field: "stato",
      headerName: t("Stato Candidato"),
      flex: 1,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <div style={{ textAlign: "start" }}>
          {params.row.stato && params.row.stato.descrizione ? params.row.stato.descrizione : "N/A"}
        </div>
      ),
    },
    { field: "dataUltimoContatto", headerName: t("Contatto"), flex: 0.8, sortable: false, filterable: false, disableColumnMenu: true },
    {
      field: "azioni",
      headerName: "",
      flex: 1.5,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
          <Tooltip title="Vai ad intervista">
            <span>
              <Link
                to={`/recruiting/intervista/${params.row.id}`}
                state={{ recruitingData: params.row }}
              >
                <IntervistaButton />
              </Link>
            </span>
          </Tooltip>

          <Tooltip title="Visualizza CV">
            <span>
              <ClipButton
                hasFile={!!params.row?.file}
                idFile={params.row.file ? params.row.file.id : null}
                fileDescrizione={params.row.file ? params.row.file.descrizione : null}
                onClick={() =>
                  handleDownloadCV(
                    params.row.file ? params.row.file.id : null,
                    params.row.file ? params.row.file.descrizione : null
                  )
                }
              />
            </span>
          </Tooltip>

          <Tooltip title="Modifica associazione">
            <span>
              <CheckListButton onClick={() => handleOpenModal(params.row)} />
            </span>
          </Tooltip>

          <Tooltip title="Elimina da associati">
            <span>
              <CloseIconButton onClick={handleDeleteAssociati} id={params.row.id} />
            </span>
          </Tooltip>
        </Box>
      ),
    },
  ];

    const candidatiByPoolView = useMemo(() => {
      const data = filteredCandidatiAll ?? [];

      if (poolView === "POOL") {
        return data.filter((c) => c.pool === 1 || c.pool === 2);
      }

      if (poolView === "HOTPOOL") {
        return data.filter((c) => c.pool === 2);
      }

      return data;
    }, [filteredCandidatiAll, poolView]);

  return (
    <SchemePage>
      <motion.div initial="hidden" animate="visible" variants={fadeInVariants}>
        <Box sx={{ position: "sticky", top: 0, zIndex: 1000 }}>
          <NuovaRicercaNeedMatch
            filtri={filtri}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
            tipoOptions={tipoOptions}
            tipologiaOptions={tipologiaOptions}
            seniorityOptions={seniorityOptions}
            onGoBack={handleGoBack}
          />
        </Box>
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={fadeInVariants}>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{ ml: 5, fontWeight: "bold", fontSize: "1.8rem", color: "#00B401" }}
          >
            {descrizione} {nomeAzienda}
          </Typography>
        </Box>
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={fadeInVariants}>
        <Modal
          open={isModalOpen}
          onClose={handleCloseModal}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          sx={{ display: "flex", alignItems: "center", justifyContent: "center", ml: 10 }}
        >
          <ModalBox
            fields={fieldsAggiorna}
            initialValues={initialValuesAggiorna}
            disableFields={disableFields}
            onSubmit={handleSaveModal}
            title={t("Modifica Stato Associazioni")}
            showBackButton={true}
            onClose={handleCloseModal}
          />
        </Modal>

        <Box sx={{ height: "auto", mt: 2, width: "100%", mb: 3 }}>
          <TabellaCandidati
            data={candidatiByPoolView}
            columns={tabellaCandidati}
            title="Candidati"
            getRowId={(row) => row.id}
            pagina={paginaCandidati}
            quantita={quantita}
            righeTot={righeTotCandidati}
            headerRight={
                          <Tabs
                            value={poolView}
                            onChange={(e, v) => {
                              setPoolView(v);
                              sessionStorage.setItem("poolView", v);
                              setPagina(0);
                            }}
                            variant="scrollable"
                            scrollButtons="auto"
                            sx={{
                              minHeight: 36,
                              "& .MuiTab-root": { minHeight: 36, textTransform: "none", fontWeight: 700, color: '#6d6c6c' },
                              "& .MuiTab-root.Mui-selected": {
                                color: "#00B400",
                              },
                            }}
                          >
                            <Tab value="ALL" label="Tutti" />
                            <Tab value="POOL" label="Pool" />
                            <Tab value="HOTPOOL" label="Hotpool" />
                          </Tabs>
                        }
            onPageChange={handlePageChangeCandidati}
          />
        </Box>

        <Box sx={{ height: "auto", mt: 2, width: "100%", mb: 3 }}>
          <Tabella
            data={originalStorico}
            columns={tabellaStorico}
            title="Storico"
            getRowId={(row) => row.id}
            pagina={paginaStorico}
            quantita={quantita}
            righeTot={righeTotStorico}
            onPageChange={handlePageChangeStorico}
          />
        </Box>

        <Box sx={{ height: "auto", mt: 2, width: "100%", mb: 3 }}>
          <Tabella
            data={originalAssociati}
            columns={tabellaAssociati}
            title="Candidati Associati"
            getRowId={(row) => row.id}
            pagina={paginaAssociati}
            quantita={quantita}
            righeTot={righeTotAssociati}
            onPageChange={handlePageChangeAssociati}
          />
        </Box>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle id="form-dialog-title">{t("Modifica Azienda")}</DialogTitle>
          <DialogContent />
        </Dialog>

        <IntervisteModal
          open={openModalIntervista}
          handleClose={() => setOpenModalIntervista(false)}
          intervista={selectedIntervista}
        />
      </motion.div>
    </SchemePage>
  );
};

export default NeedMatch;
