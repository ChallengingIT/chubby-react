    import React, { useState, useEffect, createContext, useContext } from "react";
    import { createTheme, ThemeProvider } from "@mui/material/styles";
    import { useAuth } from "../services/authContext";

    // Definizione dei temi per gli utenti
    const themes = {
    default: createTheme({
        palette: {
        primary: { main: "#00B400" },
        secondary: { main: "#191919" },
        icon: {
            main: "#00B400",
            secondary: "#EDEDED",
        },
        hover: { main: "#00B400" },
        sidebar: { background: "#191919" },
        text: {
            primary: "#191919",
            secondary: "#191919",
        },
        text2: { primary: "#EDEDED" },
        button: {
            main: "#00B400",
            secondary: "#191919",
            black: "#191919",
        },
        textButton: {
            main: "#EDEDED",
            secondary: "#EDEDED",
            white: "#EDEDED",
        },
        aggiungiSidebar: {
            bg: "#00B400",
            title: "#191919",
            hover: "#191919",
            text: "#191919",
            textHover: "#EDEDED",
        },
        background: { paper: "#ffffff" },
        border: { main: "#00B400" },
        sidebarText: { main: "#EDEDED" },
        },
    }),

    ribaMundo: createTheme({
        palette: {
        primary: { main: "#EDEDED" },
        secondary: { main: "#EDEDED" },
        icon: {
            main: "#191919",
            secondary: "#191919",
        },
        hover: { main: "#191919" },
        sidebar: { background: "#191919" },
        aggiungiSidebar: {
            bg: "#191919",
            hover: "#EDEDED",
            text: "#EDEDED",
            title: "#EDEDED",
            textHover: "#191919",
        },
        text: {
            primary: "#191919",
            secondary: "#191919",
        },
        text2: { primary: "#191919" },
        button: {
            main: "#191919",
            secondary: "#EDEDED",
            black: "#191919",
        },
        textButton: {
            main: "#EDEDED",
            secondary: "#191919",
            white: "#EDEDED",
        },
        border: { main: "#191919" },
        background: { paper: "#ffffff" },
        },
    }),
    };

    // Mappa degli ID azienda ai temi
    const aziendaThemes = {
    18: themes.ribaMundo,
    };

    const UserThemeContext = createContext();

    export const useUserTheme = () => useContext(UserThemeContext);

    const TorchyThemeProvider = ({ children }) => {
    const { user } = useAuth();
    const [theme, setTheme] = useState(() => {
        const savedTheme = sessionStorage.getItem("theme");
        return themes[savedTheme] || themes.default;
    });

    useEffect(() => {
        let selectedTheme = themes.default;

        if (user && user.roles) {
            user.roles.forEach(role => {
                switch (role) {
                    case "ROLE_ADMIN":
                    case "ROLE_RECRUITER":
                    case "ROLE_BM":
                        selectedTheme = themes.default;
                        break;
                    case "ROLE_BUSINESS":
                        if (user.idAzienda) {
                            const aziendaIds = Array.isArray(user.idAzienda) ? user.idAzienda : [user.idAzienda];
                            aziendaIds.forEach(aziendaId => {
                                if (aziendaThemes[aziendaId]) {
                                    selectedTheme = aziendaThemes[aziendaId];
                                }
                            });
                        }
                        break;
                    default:
                        selectedTheme = themes.default;
                }
            });
        }

        setTheme(selectedTheme);
        sessionStorage.setItem(
            "theme",
            Object.keys(themes).find(key => themes[key] === selectedTheme)
        );
    }, [user]);

    return (
        <UserThemeContext.Provider value={theme}>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </UserThemeContext.Provider>
    );
};

export default TorchyThemeProvider;
