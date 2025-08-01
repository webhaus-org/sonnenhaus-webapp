import React from 'react'
import Chart from 'chart.js/auto'

import AdjustIcon from '@mui/icons-material/Adjust'
import Battery0BarIcon from '@mui/icons-material/Battery0Bar'
import Box from '@mui/material/Box'
import FactoryIcon from '@mui/icons-material/Factory'
import HomeIcon from '@mui/icons-material/Home'
import SunnyIcon from '@mui/icons-material/Sunny'

import { MEASUREMENT } from './api.jsx'

import {
  LoadingContext,
  MessageContext,
  MessageSeverity
} from './context.jsx'

import FlowChartSVG from './FlowChartSVG.jsx'

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

const FlowChart = ({measurement}) => {
  React.useEffect(() => {
    const key_frames_to_home = [{strokeDashoffset: 100}, {strokeDashoffset: 0}]
    const key_frames_from_home = [{strokeDashoffset: 0}, {strokeDashoffset: 100}]
    const animation_options = {duration: 5000, iterations: Infinity}

    const battery_power = document.getElementById("battery-power")
    const pv_power = document.getElementById("pv-power")
    const grid_power = document.getElementById("grid-power")

    const battery_home = document.getElementById("battery-home")
    const pv_home = document.getElementById("pv-home")
    const grid_home = document.getElementById("grid-home")

    const bat_charging_power = measurement["data"]["bat_charging_power_watts"]
    const bat_discharging_power = measurement["data"]["bat_discharging_power_watts"]

    const grid_feed_power = measurement["data"]["net_feed_watts"]
    const grid_consumption_power = measurement["data"]["net_consumption_watts"]

    const pv_yield = measurement["data"]["pv_gross_yield_watts"]

    if (pv_yield > 0) {
      pv_power.innerHTML = `${pv_yield} W`
      pv_home.getAnimations().forEach(a => a.cancel())
      pv_home.animate(key_frames_to_home, animation_options)
    }
    else {
      pv_power.innerHTML = `${pv_yield} W`
      pv_home.getAnimations().forEach(a => a.cancel())
    }

    if (bat_charging_power > bat_discharging_power) {
      battery_power.innerHTML = `${bat_charging_power} W`
      battery_home.getAnimations().forEach(a => a.cancel())
      battery_home.animate(key_frames_from_home, animation_options)
    }
    else {
      battery_power.innerHTML = `${bat_discharging_power} W`
      battery_home.getAnimations().forEach(a => a.cancel())
      battery_home.animate(key_frames_to_home, animation_options)
    }

    if (grid_feed_power > grid_consumption_power) {
      grid_power.innerHTML = `${grid_feed_power} W`
      grid_home.getAnimations().forEach(a => a.cancel())
      grid_home.animate(key_frames_from_home, animation_options)
    }
    if (grid_feed_power < grid_consumption_power) {
      grid_power.innerHTML = `${grid_consumption_power} W`
      grid_home.getAnimations().forEach(a => a.cancel())
      grid_home.animate(key_frames_to_home, animation_options)
    }
    if (grid_feed_power == grid_consumption_power) {
      grid_home.getAnimations().forEach(a => a.cancel())
      grid_power.innerHTML = `${grid_feed_power} W`
    }
  }, [measurement])
  return <div style={{display: 'flex', height: '50vh', justifyContent: 'center', flexDirection: 'row'}}><FlowChartSVG /></div>
}

const MeasurementView = () => {
  const [ measurements, set_measurements ] = React.useState([])
  const { set_loading } = React.useContext(LoadingContext)
  const { set_snackbar } = React.useContext(MessageContext)

  const fetch_measurements = async () => {
    const res = await MEASUREMENT.LIST()
    set_measurements(res.sort((left, right) => (left['measure_date'] > right['measure_date']) ? 1 : ((left['measure_date'] < right['measure_date']) ? -1 : 0)))
  }

  const init_fetch_measurements = async () => {
    set_loading(true)
    try {
      await fetch_measurements()
      set_loading(false)
    } catch (error) {
      set_loading(false)
      set_snackbar({msg: 'Konnte Messwerte nicht laden', severity: MessageSeverity.ERROR})
    }
  }

  React.useEffect(() => {
    init_fetch_measurements()
    const ms = setInterval(() => {
      fetch_measurements()
    }, 30000)
    return () => clearInterval(ms)
  }, [])

  const current_measurment = measurements.length > 0 ? measurements[measurements.length - 1] : null
  return <>
      <div style={{padding: '1rem'}}>
        <p>Aktuellster Messswert</p>
        {!current_measurment && 'N/A'}
        {current_measurment && <div>
          <FlowChart measurement={current_measurment}/>
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
