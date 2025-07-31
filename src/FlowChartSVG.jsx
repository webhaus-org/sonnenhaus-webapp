const FlowChartSVG = () => {
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 230 160"
  >
    <title>Flow Chart</title>
    <g>
      <rect width="30" height="30" x="100" y="65" style={{strokeWidth: '0.5', stroke: 'black'}} fill="white" id="home" />
      <text x="105.5" y="82.5" textLength="19" style={{fontSize: '0.5em'}}>Home</text>
    </g>
    <g>
      <line x1="30" y1="30" x2="100" y2="65" style={{stroke: 'green', strokeWidth: '2'}} strokeDasharray="5,5" id="pv-home" />
      <circle r="20" cx="30" cy="30" fill="white" style={{strokeWidth: '0.5', stroke: 'black'}} id="pv"/>
      <text x="25" y="32.5" textLength="10" style={{fontSize: '0.5em'}}>PV</text>
      <text x="70" y="47.5" style={{fontSize: '0.5em'}} id="pv-power">0 W</text>
    </g>
    <g>
      <line x1="30" y1="130" x2="100" y2="95" style={{stroke: 'green', strokeWidth: '2'}} strokeDasharray="5,5" id="battery-home" />
      <circle r="20" cx="30" cy="130" fill="white" style={{strokeWidth: '0.5', stroke: 'black'}} id="battery"/>
      <text x="18.5" y="132.5" textLength="23" style={{fontSize: '0.5em'}}>Battery</text>
      <text x="70" y="117.5" style={{fontSize: '0.5em'}} id="battery-power">0 W</text>
    </g>
    <g>
      <line x1="200" y1="80" x2="130" y2="80" style={{stroke: 'green', strokeWidth: '2'}} strokeDasharray="5,5" id="grid-home" />
      <circle r="20" cx="200" cy="80" fill="white" style={{strokeWidth: '0.5', stroke: 'black'}}/>
      <text x="192.5" y="82.5" textLength="15" style={{fontSize: '0.5em'}}>Grid</text>
      <text x="145" y="77.5" style={{fontSize: '0.5em'}} id="grid-power">0 W</text>
    </g>
  </svg>
}

export default FlowChartSVG
