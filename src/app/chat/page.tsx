'use client';
import { useState, useEffect } from 'react'
import { ProChat } from '@ant-design/pro-chat';
import { useTheme } from 'antd-style';
import e from 'cors';
import LayoutContainer from '../components/LayoutContainer';
import './index.css';
const Home = ()=> {

  const theme = useTheme();
  const [showComponent, setShowComponent] = useState(false)

  useEffect(() => setShowComponent(true), [])

  return (
    <div
      style={{
        backgroundColor: theme.colorBgLayout,
      }}
    >
      {
        showComponent && <ProChat
          style={{
            // height: 'calc(100vh - 100px)',
            // width: 'calc(100vw - 100px)',
            minHeight: 'calc(100vh - 200px)',
          }}
          request={async (messages) => {
            const response = await fetch('/rest2/qwen', {
              method: 'POST',
              body: JSON.stringify({ messages: messages }),
            });
            const data = await response.json();
            return new Response(data.output?.text);
          }}
        />
      }
    </div>
  );
}

const APP = () => {
    return (
      <LayoutContainer currentpathname='/chat'>
        <Home/>
      </LayoutContainer>
    )
  }
  export default APP
