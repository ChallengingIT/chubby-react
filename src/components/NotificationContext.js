// NotificationContext.js
import React, { createContext, useContext, useState } from 'react';
import { Snackbar } from '@mui/material';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState({ open: false, message: "" });

    const showNotification = (message) => {
        setNotification({ open: true, message });
    };

    const closeNotification = () => {
        setNotification({ ...notification, open: false });
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={closeNotification}
                message={notification.message}
            />
        </NotificationContext.Provider>
    );
};
