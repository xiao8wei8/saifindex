

import { Box } from './Box'
import { Dustbin } from './Dustbin'

 const Container =  () => (
  
  <div>
    <div style={{ overflow: 'hidden', clear: 'both' }}>
      <Dustbin allowedDropEffect="折线图" />
      <Dustbin allowedDropEffect="柱状图" />
      <Dustbin allowedDropEffect="曲线图" />
    </div>
    <div style={{ overflow: 'hidden', clear: 'both' }}>
      <Box name="中国"  />
      <Box name="美国" />
      <Box name="日本" />
    </div>
  </div>
)
export default Container