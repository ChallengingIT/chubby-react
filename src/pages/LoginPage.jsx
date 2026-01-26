import Sfondo from '../images/login.svg'
import { Box } from '@mui/material';
import LoginComponent from '../components/LoginComponent';
const Login = () => {
    return (
        <Box
        sx={{
            position: 'relative',
            height: '100vh',
            width: '100vw',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}
        >
        {/* Immagine di sfondo */}
        <Box
            component="img"
            src={Sfondo}
            alt="Sfondo Login"  
            sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: -1, 
            }}
        />

        {/* Box per il contenuto del LoginComponent */}
            <LoginComponent />
        </Box>
    );
}

export default Login