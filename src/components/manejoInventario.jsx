import React, { useState, useEffect } from 'react'
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { mainListItems } from './dashboardComponents/listItems';
import { mainListItemsMec } from './dashboardComponents/listItemsMecanico';
import Tablestock from './small-component/TableStock';
import {getStock} from '../api/article.api'
import img from '../assets/logo.png'
import { Link } from "react-router-dom";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useNavigate } from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';

import Cookies from 'universal-cookie';

const cookies = new Cookies()

const drawerWidth = 200;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, 
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: '#212529',
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(7),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));

export default function DashboardInventario() {
  const navigateTo = useNavigate();

  const deleteCookies = () => {
    cookies.set('user', undefined, {
      path: '/',
      sameSite: 'None',
      secure: true,
    });
    navigateTo('/');
  };

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [stockReg, setStock] = useState([]);
  const [manager, setManager] = useState(false);
  const loaded = async () => {
    if(cookies.get('user') != undefined){
      if(cookies.get('user').role == "Man"){
        setManager(true);
      }
    }

    const result = await getStock(cookies.get('user').branch);
    setStock(result.data.data);
  };

  useEffect(() => {
    loaded();
  }, []);


  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Link className="navbar-brand " to='/'><img src={img} alt="Litio" width={130} /></Link>
          {manager &&
            <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
              &emsp; Manejo de Piezas
            </Typography>
          }
          {!manager &&
            <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
              &emsp; Consulta de Piezas
            </Typography>
          }
          <div onClick={deleteCookies}>
            <Tooltip title="Salir">
              <IconButton>
                  <ExitToAppIcon style={{ fill: '#ee2641' }}/>
              </IconButton>
            </Tooltip>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        {manager &&
          <List>{mainListItems}</List>
        }
        {!manager &&
          <List>{mainListItemsMec}</List>
        } 
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Tablestock stock={stockReg} />
              </Paper>
            </Grid>
          </Grid>
          <Box pt={4}>
          </Box>
        </Container>
      </main>
    </div>
  );
}
