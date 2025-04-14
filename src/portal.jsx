import React from 'react'
import ReactDOM from 'react-dom/client'

import Alert from '@mui/material/Alert'
import Backdrop from '@mui/material/Backdrop'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import CssBaseline from '@mui/material/CssBaseline'
import Paper from '@mui/material/Paper'
import Snackbar from '@mui/material/Snackbar'
import TextField from '@mui/material/TextField'

import { MEASUREMENT } from './api.jsx'
import {
  on_auth_state_changed,
  sign_in,
} from './auth.jsx'

const MessageContext = React.createContext({set_snackbar: () => {}})
const MessageSeverity = {
  ERROR: 'error',
  SUCCESS: 'success'
}
const LoadingContext = React.createContext({set_loading: () => {}})

const ContentMode = {
  QUESTIONNAIRE: {
    LIST: 'list',
    EDIT: 'edit'
  }
}

const CenteredProgressIndicator = ({open}) => {
  return <Backdrop open={open} sx={{zIndex: (theme) => theme.zIndex.drawer + 1}}>
    <CircularProgress />
  </Backdrop>
}

const Login = () => {
  const [ email, set_email ] = React.useState('')
  const [ password, set_password ] = React.useState('')

  const { set_snackbar } = React.useContext(MessageContext)
  const { set_loading } = React.useContext(LoadingContext)

  const login = async () => {
    set_loading(true)
    try {
      await sign_in(email, password)
      set_loading(false)
    } catch(error) {
      set_loading(false)
      const code = error?.code
      if (code == 'auth/invalid-credential') {
        set_snackbar({msg: 'Ungültige E-Mail-Adresse oder ungültiges Passwort', severity: MessageSeverity.ERROR})
      }
      else {
        set_snackbar({msg: 'Login fehlgeschlagen', severity: MessageSeverity.ERROR})
      }
    }
  }

  return <Box
      display='flex'
      flexDirection='column'
      justifyContent='center'
      width='50vw'
      height='100vh'
      margin='auto'
    >
      <Paper
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
        elevation={3}
      >
        <TextField
          value={email}
          onChange={e => set_email(e.target.value)}
          type='email'
          autoComplete='email'
          label='E-Mail'
          variant='standard'
          sx={{'margin': '1rem'}}
        />
        <TextField
          value={password}
          onChange={e => set_password(e.target.value)}
          type='password'
          autoComplete='password'
          label='Passwort'
          variant='standard'
          sx={{'margin': '1rem'}}
        />
        <Button
          onClick={async () => await login()}
          variant='outlined'
          sx={{'margin': '1rem'}}
        >
          Login
        </Button>
      </Paper>
    </Box>
}

const MeasurementView = () => {
  const [ measurements, set_measurements ] = React.useState([])
  const { set_loading } = React.useContext(LoadingContext)
  const { set_snackbar } = React.useContext(MessageContext)

  const fetch_measurements = async () => {
    set_loading(true)
    try {
      const res = await MEASUREMENT.LIST()
      set_measurements(res)
      set_loading(false)
    } catch (error) {
      set_loading(false)
      set_snackbar({msg: 'Konnte Messwerte nicht laden', severity: MessageSeverity.ERROR})
    }
  }

  React.useEffect(() => {fetch_measurements()}, [])

  return <div>HALLO</div>
}

const Portal = () => {
  const [ authenticated, set_authenticated ] = React.useState()
  const [ snackbar, set_snackbar ] = React.useState({msg: undefined, severity: undefined})
  const [ loading, set_loading ] = React.useState(false)

  React.useEffect(() => {on_auth_state_changed(set_authenticated)}, [])

  let content
  if (authenticated) {
    content = <MeasurementView />
  } else {
    content = <Login />
  }
  return <>
      <CssBaseline />
      <MessageContext.Provider value={{snackbar, set_snackbar}}>
        <LoadingContext.Provider value={{loading, set_loading}}>
          <CenteredProgressIndicator open={loading}/>
          {content}
          <Snackbar
            open={Boolean(snackbar.msg)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center'
            }}
            onClose={() => set_snackbar({msg: undefined, severity: snackbar.severity})}
            autoHideDuration={5000}
          >
            <Alert
              severity={snackbar.severity}
              sx={{minHeight: '10vh', minWidth: '90vw', alignItems: 'center', justifyContent: 'center', fontSize: 'x-large'}}
            >
              {snackbar.msg}
            </Alert>
          </Snackbar>
        </LoadingContext.Provider>
      </MessageContext.Provider>
    </>
}

export default Portal
