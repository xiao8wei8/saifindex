

import React from "react";
//@ts-ignore
import { AntdRegistry } from "@ant-design/nextjs-registry";
// import Icon from "@ant-design/icons";
import Layout, { Content, Footer } from "antd/lib/layout/layout";
import "./layout.css";
import Textscroll from "@/components/textscroll/page";
import 'tailwindcss/tailwind.css';
// import {createContext} from "react";
import { DataProvider } from "./components/DataProvider";
import axios from "axios";
import { useRouter } from "next/router";
import config from "@/libs/config";
import { GetStaticPropsContext, GetServerSidePropsContext } from 'next';
// import { use, useEffect, useState } from "react";
const geturl = config.url;
const getInitialProps = async () => {
    // const res = await fetch('https://api.github.com/repos/vercel/next.js')
    // const json = await res.json()

     // const main = async () => {
        //     const response = await axios.get(
        //         "/api/sql",
        //         {} // Include the config object as the third argument
        //     );
        //     const items = response.data;
        //     console.log("[items]", items);
        // }
        // main()
        // if (items.success == false) {

        // }

    // const response = await axios.get(
    //     "/api/sql?type=hs300",
    //     {} // Include the config object as the third argument
    // );
    // const items = response.data;
    // console.log("[items]", items);
   let ret:any = {}
   try {
       const res = await fetch(geturl + "?type=indexshortname");
       const json = await res.json();
       ret['indexshortname'] = json
    //    return { data: json };
   } catch (error:any) {
    //    return { data: {}, state: error?.message };
       ret['indexshortname'] =  { data: {}, state: error?.message }
   }

   try {
    const res = await fetch(geturl + "?type=catalogue");
    const json = await res.json();
    ret['catalogue'] = json
        // return { data: json };
    } catch (error:any) {
        // return { data: {}, state: error?.message };
        ret['catalogue'] =  { data: {}, state: error?.message }
    }

    try {
        const res = await fetch(geturl + "?type=countryname");
        const json = await res.json();
        ret['countryname'] = json
            // return { data: json };
        } catch (error:any) {
            // return { data: {}, state: error?.message };
            ret['countryname'] =  { data: {}, state: error?.message }
        }
    

    return ret

    
  }
//   export async function getStaticProps() {
//     const categories =  {}//await getCategoriesFromCMS();
  
//     return {
//       props: { categories },
//     };
//   }
  
const RootLayout = async ({ children }: any) => {
    // const initialItems = await getInitialProps();
    const initialItems:any =[]

    console.log("[initialItems]",initialItems)
    return (
        <html lang="en">
            <body>
                <AntdRegistry>
                    {/* <Layout style={{minHeight: "100vh"}}> */}
                    {/* <Content style={{ margin: "24px 16px 0" }}>
                            <div
                                style={{
                                    padding: 24,
                                    minHeight: 520,
                                }}
                            > */}
                    <Textscroll/>
                    {/* <TDataContext.Provider value={initialItems}> */}
                    <DataProvider value={initialItems}>{children}</DataProvider>
                    {/* {children} */}
                    {/* </TDataContext.Provider> */}
                 
                    {/* </div>
                        </Content> */}
    
                    {/* </Layout> */}
                </AntdRegistry>
                {/* <Footer
                    style={{
                        textAlign: "center",
                        // position: "fixed",
                        // bottom: "0",
                        // width: "100%",
                        // minWidth: "430px",
                        // height: "66px",
                        zIndex: 999,
                        margin: "8px",
                    }}
                    className="footer"
                    id="footer"
                >
                    <div>
                        SAIF AI-BASE ©{new Date().getFullYear()} Created by SAIF
                        24Gr.技术小组
                    </div>
                    <div style={{ marginTop: "10px" }}>
                        © 备案号：
                        <a href="https://beian.miit.gov.cn/" target="_blank">
                            沪ICP备2024095623号-1
                        </a>
                    </div>
                </Footer> */}
                <div
                  
                    className="footer"
                    id="footer"
                >
                    <div>
                        SAIF AI-BASE ©{new Date().getFullYear()} Created by SAIF
                        24Gr.技术小组
                    </div>
                    <div style={{ marginTop: "10px" }}>
                        © 备案号：
                        <a href="https://beian.miit.gov.cn/" target="_blank">
                            沪ICP备2024095623号-1
                        </a>
                    </div>
                </div>
            </body>
        </html>
    )
};
export default RootLayout;
// RootLayout.getInitialProps = async () => {
   
//     return { stars: {
//         test:1
//     }};
// };
// export async function getStaticProps(context: GetStaticPropsContext) {
//     let ret:any = {}
//     try {
//         const res = await fetch(geturl + "?type=indexshortname");
//         const json = await res.json();
//         ret['indexshortname'] = json
//      //    return { data: json };
//     } catch (error:any) {
//      //    return { data: {}, state: error?.message };
//         ret['indexshortname'] =  { data: {}, state: error?.message }
//     }
 
//     try {
//      const res = await fetch(geturl + "?type=catalogue");
//      const json = await res.json();
//      ret['catalogue'] = json
//          // return { data: json };
//      } catch (error:any) {
//          // return { data: {}, state: error?.message };
//          ret['catalogue'] =  { data: {}, state: error?.message }
//      }
 
//      try {
//          const res = await fetch(geturl + "?type=countryname");
//          const json = await res.json();
//          ret['countryname'] = json
//              // return { data: json };
//          } catch (error:any) {
//              // return { data: {}, state: error?.message };
//              ret['countryname'] =  { data: {}, state: error?.message }
//          }
     
 
      
  
//     // Pass data to the page via props
//     return { props: { data:ret } }
//   }

