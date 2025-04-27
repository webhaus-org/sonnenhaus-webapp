import React from 'react'

const MessageContext = React.createContext({set_snackbar: () => {}})
const MessageSeverity = {
  ERROR: 'error',
  SUCCESS: 'success'
}
const LoadingContext = React.createContext({set_loading: () => {}})

export {
  LoadingContext,
  MessageContext,
  MessageSeverity
}
