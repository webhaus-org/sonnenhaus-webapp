import { user_token } from './auth.jsx'

const base_url = import.meta.env.VITE_API_BASE_URL

const auth_header = async (header={}) => {
  const token = await user_token()
  return {...header, 'Authorization': `Bearer ${token}`}
}

const MEASUREMENT = {
  LIST: async (limit=24*60) => {
    const params = new URLSearchParams({limit: limit})
    const url = `${base_url}/measurement?${params}`
    const headers = await auth_header()
    const resp = await fetch(url, {method: 'GET', headers: headers})
    return resp.json()
  },
}

export { MEASUREMENT }
