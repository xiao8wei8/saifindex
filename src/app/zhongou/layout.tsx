

import React from "react";
//@ts-ignore
import { AntdRegistry } from "@ant-design/nextjs-registry";
// import Icon from "@ant-design/icons";
import Layout, { Content, Footer } from "antd/lib/layout/layout";
import  './index.css'
// import "../layout.css";
import Textscroll from "@/components/textscroll/page";
import 'tailwindcss/tailwind.css';
// import {createContext} from "react";

import axios from "axios";
import { useRouter } from "next/router";
import config from "@/libs/config";
import { GetStaticPropsContext, GetServerSidePropsContext } from 'next';
// import { use, useEffect, useState } from "react";

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
               <div>
               {children}
               </div>
            </body>
        </html>
    )
};
export default RootLayout;
