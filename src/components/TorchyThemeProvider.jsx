    import React, { useState, useEffect, createContext, useContext } from 'react';
    import { createTheme, ThemeProvider } from '@mui/material/styles';
    import { useAuth } from '../services/authContext';

    // Definizione dei temi per gli utenti
    const themes = {
    default: createTheme({
        palette: {
        primary: { main: '#00B400' },
        secondary: { main: '#191919' },
        icon: {
            main: '#00B400',
            secondary: '#EDEDED'
        },
        hover: { main: '#00B400' },
        sidebar: { background: '#191919' },
        text: {
            primary: '#191919',
            secondary: '#191919',
        },
        text2: { primary: '#EDEDED' },
        button: {
            main: '#00B400',
            secondary: '#191919',
            black: '#191919'
        },
        textButton: {
            main: '#EDEDED',
            secondary: '#EDEDED',
            white: '#EDEDED'
        },
        aggiungiSidebar: {
            bg: '#00B400',
            title: '#191919',
            hover: '#191919',
            text: '#191919',
            textHover: '#EDEDED'
        },
        background: { paper: '#ffffff' },
        border: { main: '#00B400' },
        sidebarText: { main: '#EDEDED' },
        },
    }),
    user1: createTheme({
        palette: {
        primary: { main: '#EDEDED' },
        secondary: { main: '#ffffff' },
        icon: {
            main: '#191919',
            secondary: '#191919'
        },
        hover: { main: '#191919' },
        sidebar: { background: '#191919' },
        aggiungiSidebar: {
            bg: '#191919',
            hover: '#EDEDED',
            text: '#EDEDED',
            title: '#EDEDED',
            textHover: '#191919'
        },
        text: {
            primary: '#191919',
            secondary: '#191919',
        },
        text2: { primary: '#191919' },
        button: {
            main: '#191919',
            secondary: '#EDEDED',
            black: '#191919'
        },
        textButton: {
            main: '#EDEDED',
            secondary: '#191919',
            white: '#EDEDED'
        },
        border: { main: '#191919' },
        background: { paper: '#ffffff' },
        },
    }),
    };

    const UserThemeContext = createContext();

    export const useUserTheme = () => useContext(UserThemeContext);

    const TorchyThemeProvider = ({ children }) => {
    const { user } = useAuth();
    const [theme, setTheme] = useState(() => {
        const savedTheme = sessionStorage.getItem('theme');
        return themes[savedTheme] || themes.default;
    });

    let selectedTheme = themes.default;


    useEffect(() => {
        if (user && user.roles) {
        for (const role of user.roles) {
            switch (role) {
            case "ROLE_ADMIN":
                selectedTheme = themes.default;
                break;
            case "ROLE_BUSINESS":
                selectedTheme = themes.user1;
                break;
            case "ROLE_RECRUITER":
                selectedTheme = themes.default;
                break;
            case "ROLE_BM":
                selectedTheme = themes.default;
                break;
            default:
                selectedTheme = themes.default;
            }
        }
        }
        setTheme(selectedTheme);
        sessionStorage.setItem('theme', Object.keys(themes).find(key => themes[key] === selectedTheme));
    }, [user]);

    console.log("user", user);

    return (
        <UserThemeContext.Provider value={theme}>
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
        </UserThemeContext.Provider>
    );
    };

    export default TorchyThemeProvider;
