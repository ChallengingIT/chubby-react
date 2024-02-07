import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import * as AiIcons from 'react-icons/ai';
import * as FaIcons from 'react-icons/fa';
import LogoutIcon from '@mui/icons-material/Logout';
import Button from '@mui/material/Button';
import Logo from '../../images/innotek.svg';
import Dialog from '@mui/material/Dialog';
import axios from 'axios';
import authService from '../../services/auth.service';

const SidebarContainer = styled.div`
  width: ${({ $sidebarcollapsed }) => ($sidebarcollapsed ? '60px' : '250px')};
  height: 100%;
  min-height: 100vh;
  background: #000000;
  display: flex;
  flex-direction: column;
  border-radius: 0px 20px 20px 0px;
  transition: width 0.4s;
`;

const SidebarHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  height: 100px;
  background: #000000;
  padding: 20px;
  border-radius: 0px 20px 20px 0px;
`;

const SidebarTitle = styled.h1`
  color: white;
  font-size: 1.5rem;
  flex: 1;
  display: ${({ $sidebarcollapsed }) => ($sidebarcollapsed ? 'none' : 'block')};
`;

const ImgContainer = styled.div`
  display: flex;
  width: 80px;
  height: 40px;
`;

const NavIcon = styled(NavLink)`
  color: #14D928;
  margin-right: 0rem;
  font-size: 2rem;
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
  cursor: pointer;
`;

const SidebarNav = styled.nav`
  background: #000000;
  display: flex;
  flex-direction: column;
`;

const SidebarWrap = styled.div`
  width: 100%;
`;

const SidebarLink = styled(NavLink)`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  list-style: none;
  height: 60px;
  text-decoration: none;
  font-size: 18px;

  &:hover,
  &:active,
  &:focus {
    background: #252831;
    border-left: 4px solid #14D928;
    cursor: pointer;
    border-radius: 40px;
  }
`;

const SidebarIcon = styled.span`
  color: #14D928;
`;

const LinkText = styled.div`
  font-size: 18px;
  color: #817b7b;
  margin-left: 20px;
  width: 100%;
  display: ${({ $sidebarcollapsed }) => ($sidebarcollapsed ? 'none' : 'flex')};
`;

const linkStyle = {
    display: "flex",
    justifyContent: "flex-start",
    textDecoration: "none",
    color: "inherit",
    cursor: "pointer",
    flexDirection: "column",
  };

const UserSidebar = ({ handleLogout }) => {
  const [sidebarcollapsed,                setSidebarcollapsed         ] = useState(true);
  const [isSidebarOpen,                   setIsSidebarOpen            ] = useState(true);
  const [activeLink,                      setActiveLink               ] = useState(null);
  const [isLogoutPopupOpen,               setLogoutPopupOpen          ] = useState(false);


  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  const handleLogoutClick = () => {
    setLogoutPopupOpen(true);
  };

  const closeLogoutPopup = () => {
    setLogoutPopupOpen(false);
  };

  const confirmLogout = () => {
    navigate('/login', { replace: true });
    // window.location.reload();
    closeLogoutPopup();
  };

  const toggleSidebar = () => {
    setSidebarcollapsed(!sidebarcollapsed);
    setIsSidebarOpen(!isSidebarOpen);
  };

  const MyLogoutPopup = ({ open, onClose, onConfirm }) => {
    const navigate = useNavigate();

  const handleConfirmLogout = async () => {
    try {
      await authService.logout(); 
      navigate('/login', { replace: true });
      // window.location.reload();
      closeLogoutPopup();        
    } catch (error) {
      console.error('Errore durante il logout:', error);

    }
    onConfirm();
  };
    

    return (
      <Dialog
        open={open}
        onClose={onClose}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <div
          className="popup-container"
          style={{
            backgroundColor: "black",
            color: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "40px",
            fontSize: "20px",
          }}
        >
          <h2>Conferma Logout</h2>

          <p>Sei sicuro di voler uscire?</p>
          <div>
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{
                borderColor: "#ffb900",
                color: "#ffb900",
                marginRight: "5px",
                marginTop: "20px",
                "&:hover": {
                  transform: "scale(1.05)",
                  borderColor: "#ffb900",
                },
              }}
            >
              Annulla
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirmLogout}
              sx={{
                backgroundColor: "#ffb900",
                marginLeft: "5px",
                marginTop: "20px",
                color: "black",
                "&:hover": {
                  backgroundColor: "#ffb900",
                  transform: "scale(1.05)",
                },
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </Dialog>
    );
  };

  const SidebarData = [
    {
      title: 'Timesheet',
      path: '/UserTimesheet',
      icon: <FaIcons.FaClock />,
      sidebarcollapsed: false,
    },
  ];

  return (
    <SidebarContainer $sidebarcollapsed={sidebarcollapsed}>
      <SidebarHeader>
        <SidebarTitle $sidebarcollapsed={sidebarcollapsed}>
        <NavLink to="/UserHomepage" style={linkStyle}>
            <span
              style={{
                color: "white",
                display: "flex",
                alignSelf: "flex-start",
                fontSize: "33px",
              }}
            >
              WE-HUB
            </span>
            <ImgContainer>
              <img src={Logo} alt="Logo" style={{ marginLeft: "5%" }} />
            </ImgContainer>
          </NavLink>
        </SidebarTitle>
        <NavIcon to="#" onClick={toggleSidebar}>
          <AiIcons.AiOutlineArrowRight
            style={{
              transform: sidebarcollapsed ? 'rotate(0deg)' : 'rotate(180deg)',
              transition: 'transform 0.8s',
            }}
          />
        </NavIcon>
      </SidebarHeader>
      <SidebarNav>
        <SidebarWrap>
          {SidebarData.map((item, index) => (
            <SidebarLink
              key={index}
              to={item.path}
              activeclassname="active"
              className={activeLink === item.path ? 'active' : ''}
            >
              <SidebarIcon>{item.icon}</SidebarIcon>
              <LinkText $sidebarcollapsed={sidebarcollapsed}>{item.title}</LinkText>
            </SidebarLink>
          ))}
        </SidebarWrap>
      </SidebarNav>
      {sidebarcollapsed ? (
        <Button
          variant="filled"
          size="small"
          startIcon={<LogoutIcon />}
          onClick={handleLogoutClick}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            height: '60px',
            minWidth: '60px !important',
            color: '#ffb800',
            backgroundColor: 'black',
            borderStyle: 'none',
            padding: '23px',
            width: '60px',
            borderRadius: '60%',
            '&:hover': {
              width: '60px',
              height: '60px',
              color: 'black',
              backgroundColor: '#e0a81a',
              transform: 'scale(1.05)',
              cursor: 'pointer',
              borderRadius: '50%',
              borderStyle: 'none',
            },
          }}
        />
      ) : (
        <Button
          variant="outlined"
          size="small"
          startIcon={<LogoutIcon />}
          onClick={handleLogoutClick}
          sx={{
            display: 'flex',
            width: '100%',
            maxWidth: '120px',
            color: '#FFB900',
            borderColor: '#FFB900',
            margin: '15px',
            '&:hover': {
              variant: 'filled',
              borderColor: '#ffb900',
              backgroundColor: '#ffb800',
              color: 'black',
              padding: '0.55rem 0.55rem',
            },
          }}
        >
          Logout
        </Button>
      )}

      <Dialog open={isLogoutPopupOpen} onClose={closeLogoutPopup}>
        <div
          style={{
            backgroundColor: 'black',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '40px',
            fontSize: '20px',
          }}
        >
          <h2>Conferma Logout</h2>
          <p>Sei sicuro di voler uscire?</p>
          <div>
            <Button
              variant="outlined"
              onClick={closeLogoutPopup}
              sx={{
                borderColor: '#ffb900',
                color: '#ffb900',
                marginRight: '5px',
                marginTop: '20px',
                '&:hover': {
                  transform: 'scale(1.05)',
                  borderColor: '#ffb900',
                },
              }}
            >
              Annulla
            </Button>
            <Button
              variant="contained"
              onClick={confirmLogout}
              sx={{
                backgroundColor: '#ffb900',
                marginLeft: '5px',
                marginTop: '20px',
                color: 'black',
                '&:hover': {
                  backgroundColor: '#ffb900',
                  transform: 'scale(1.05)',
                },
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </Dialog>
    </SidebarContainer>
  );
};

export default UserSidebar;
