import React from 'react'
import HighchartsReact from 'highcharts-react-official';
const HeatMaps = ({ options, highcharts }:any) =>{
  console.log("[HeatMaps]",options)
  return(
    <HighchartsReact
    highcharts={highcharts}
    // constructorType={'ganttChart'}
    
    options={options}
   onClick={(e:any)=>{console.log(e)}}
   style={{ minHeight: "600px" }}
  />
  )
}

export default HeatMaps