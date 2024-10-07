'use client';
//@ts-ignore
import { PageContainer, ProLayout } from '@ant-design/pro-components';
import defaultProps from './_defaultProps';
import Welcome from './welcome';
import { useEffect, useState } from 'react';
//@ts-ignore
import { Button, Spin } from 'antd';
export default () => {
  const [spinning, setSpinning] = useState(false);
  const [showcontent, setShowcontent] = useState(false);
  const [percent, setPercent] = useState(0);


  const showLoader = () => {
    setSpinning(true);
    let ptg = -10;

    const interval = setInterval(() => {
      ptg += 30;
      setPercent(ptg);

      if (ptg > 120) {
        clearInterval(interval);
        setSpinning(false);
        setShowcontent(true);
        setPercent(0);
      }
    }, 100);
  };
  useEffect(()=>{
    showLoader()
  },[])
  return (
    <div
      style={{
        height: '100vh',
      }}
    >
      <ProLayout
       layout="top"
        menuItemRender={(item:any, dom:any) => (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
             {dom}
          </div>
        )}
        subMenuItemRender={(_:any, dom:any) => (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
             {dom}
          </div>
        )}
        title="SAIF Chat"
        logo="https://gw.alipayobjects.com/zos/antfincdn/upvrAjAPQX/Logo_Tech%252520UI.svg"
        menuHeaderRender={(logo:any, title:any) => (
          <div
            id="customize_menu_header"
            style={{
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              // color:"#cc2a30"
            }}
           
          >
            {logo}
            {title}
          </div>
        )}
        {...defaultProps}
        location={{
          pathname: '/welcome',
        }}
      >
         <Spin spinning={spinning} percent={percent} fullscreen />
        {showcontent?<PageContainer content="欢迎使用"><Welcome /></PageContainer>:null}
      </ProLayout>
    </div>
  );
};