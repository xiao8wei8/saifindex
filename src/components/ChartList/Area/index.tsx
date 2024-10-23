// @ts-ignore
import { Chart } from '@antv/g2';
import { useEffect, useRef } from 'react';
// @ts-ignore
import { Plugin } from '@antv/g-plugin-rough-canvas-renderer';
// @ts-ignore
import WebFont from 'webfontloader';

const AreaChart = (props: any) => {
    const ref = useRef<any>(null);
    const { data, draw } = props;
    useEffect(() => {
        if(!data.length) return
        if(draw) {
          WebFont.load({
            google: {
              families: ['Gaegu'],
            },
            active: () => {
              const chart = new Chart({
                container: ref.current,
                autoFit: true,
                paddingLeft: 60,
                plugins: [new Plugin()],
              });
  
              chart
              .area()
              .data(data)
              .encode('x', 'name')
              .encode('y', 'value')
              .axis('x', {title: '名称'})
              .axis('y', {title: '值'}); 
            
            chart.render();
              
            },
          });
          return
        }

        const chart = new Chart({
            container: ref.current,
            autoFit: true,
          });
          
          chart
            .area()
            .data(data)
            .encode('x', 'name')
            .encode('y', 'value')
            .axis('x', {title: '名称'})
            .axis('y', {title: '值'});
          
          
          chart.render();
          return () => {
            chart.destroy();
          }
    }, [data, draw])
    return <div ref={ref} style={{width: '70%', height: '70%', paddingTop: 12}}></div>
}

  export default AreaChart