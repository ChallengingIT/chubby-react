import React from 'react';
import { useNavigate } from 'react-router-dom';
import loginTorchy from '../images/loginTorchy.png';
import logoTorchySF from '../images/logoTorchySF.png';
import logoTorchySF2 from '../images/logoTorchySF2.png'
import { Box } from '@mui/material';
import LoginComponentTorchy from '../components/LoginComponentTorchy';

const LoginPageTorchy = () => {
    const navigate = useNavigate();
    return (
        <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100vh',
        alignItems: 'center', 
        justifyContent: 'center', 
        position: 'relative', 
        }}>
        <img
            alt="Login background"
            src={loginTorchy}
            style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute', 
            top: 0,
            left: 0,
            zIndex: -1, 
            }}
        />
        <Box sx={{
            position: 'absolute', 
            top: '5%', 
            left: '5%', 
        }}>
            <img
            alt="Torchy logo"
            src={logoTorchySF2}
            style={{
                height: '100%',
                width: '45%', 
            }}
            />
        </Box>

        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40%',
            height: '100vh',
        }}>
            <LoginComponentTorchy
            navigate={navigate}
            />
        </Box>
        </Box>
    );
    }

export default LoginPageTorchy;
