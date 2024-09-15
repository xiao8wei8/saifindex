'use client';
import Head from "next/head";

import { useState, useEffect } from 'react'
//@ts-ignore

import { ChatMessage, ProChat } from '@ant-design/pro-chat';
//@ts-ignore
import { useTheme } from 'antd-style';
import Alert from "antd/es/alert";

export default function Home() {

    const theme = useTheme();
    const [showComponent, setShowComponent] = useState(false)


    return (
        <div
            style={{
                backgroundColor: theme.colorBgLayout,
            }}
        >

          {
              <ProChat

                  chatItemRenderConfig={{
                      contentRender: (item: any, dom: any, defaultDom: any) => {
                          console.log(item)
                          if (item?.originData?.role === 'user-form') {
                              return <div>1</div>;
                          } else if (item?.originData?.role === 'preview') {
                              console.log(
                                  'JSON.parse(item?.originData?.content).color',
                                  JSON.parse(item?.originData?.content).color,
                              );

                              return (
                                  <div>3</div>
                              );
                          }
                          return defaultDom;
                      },
                  }}
                  style={{
                      height: '100vh',
                      width: '100vw',
                  }}
                 
                  request={async (messages: any) => {
                      const response = await fetch('/api/mapping_a', {
                          method: 'POST',
                          body: JSON.stringify({ messages: messages }),
                      });
                      const data = await response.json();
                      console.log(data);
                      return new Response(data.output?.text);
                  }}
              />
          }
      </div>
  );
}