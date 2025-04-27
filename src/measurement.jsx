import React from 'react'
import Chart from 'chart.js/auto'

import { MEASUREMENT } from './api.jsx'

import {
  LoadingContext,
  MessageContext,
  MessageSeverity
} from './context.jsx'

const MeasurementChart = ({measurements}) => {
  const canvas_ref = React.useRef(null)

  React.useEffect(() => {
    const x_axis = measurements.map(m => (new Date(m['measure_date'] * 1000)).toLocaleString())
    const load_watts = measurements.map(m => m['data']['load_watts'])
    const pv_gross_yield = measurements.map(m => m['data']['pv_gross_yield_watts'])
    const bat_soc = measurements.map(m => m['data']['bat_soc_percentage'])
    const chart_obj = new Chart(canvas_ref.current, {
      type: 'bar',
      options: {
        responsive: true
      },
      data: {
        labels: x_axis,
        datasets: [
          {
            label: 'PV Gesamtertrag',
            data: pv_gross_yield,
            borderWidth: 1
          },
          {
            label: 'Last',
            data: load_watts,
            borderWidth: 1
          },
          {
            label: 'Batterieladestand',
            data: bat_soc,
            borderWidth: 1
          }
        ]
      }
    })
    return () => { chart_obj.destroy() }
  }, [measurements])

  return <canvas ref={canvas_ref} id='chart_id'></canvas>
}

const MeasurementView = () => {
  const [ measurements, set_measurements ] = React.useState([])
  const { set_loading } = React.useContext(LoadingContext)
  const { set_snackbar } = React.useContext(MessageContext)

  const fetch_measurements = async () => {
    set_loading(true)
    try {
      const res = await MEASUREMENT.LIST()
      set_measurements(res.sort((left, right) => (left['measure_date'] > right['measure_date']) ? 1 : ((left['measure_date'] < right['measure_date']) ? -1 : 0)))
      set_loading(false)
    } catch (error) {
      set_loading(false)
      set_snackbar({msg: 'Konnte Messwerte nicht laden', severity: MessageSeverity.ERROR})
    }
  }

  React.useEffect(() => {fetch_measurements()}, [])
  const current_measurment = measurements.length > 0 ? measurements[measurements.length - 1] : null
  return <>
      <div style={{padding: '1rem'}}>
        <p>Aktuellster Messswert</p>
        {!current_measurment && 'N/A'}
        {current_measurment && <div>
          <p>Datum: {(new Date(current_measurment['measure_date'] * 1000)).toLocaleString()}</p>
          <p style={{lineBreak: 'anywhere'}}>
            {JSON.stringify(current_measurment['data'])}
          </p>
        </div>}
      </div>
      <MeasurementChart measurements={measurements} />
    </>
}

export default MeasurementView
