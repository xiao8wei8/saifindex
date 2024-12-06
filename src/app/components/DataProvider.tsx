"use client"


import config from "@/libs/config";
import { Spin } from "antd";
import { GetStaticPropsContext, GetServerSidePropsContext } from 'next';
// import { use, useEffect, useState } from "react";
const geturl = config.url;
import { createContext, use, useContext, useEffect, useState } from "react";


export const TDataContext = createContext({});


// export const useData = () => {
//     return useContext(TDataContext);
// };

export const DataProvider =  ({ children }: any) => {
    const [value,setValue] = useState(null);
 
    // const [data, setData] = useState({});
    useEffect(  () => {
        async function _getStaticProps() {
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
             
         
              
          
            // Pass data to the page via props
            return { props: { data:ret } }
          }
        
        const getInitialProps = async () => {
            const initialItems:any = await _getStaticProps();
             const value:any = initialItems.props.data
             setValue(value);
        };
        getInitialProps();
    },[])
  
    if(!value) return (
        <Spin spinning={true} size="small" wrapperClassName="spin">
        <div>加载中......</div>
      </Spin>
    )
    console.log("[]initiaData",value);
    
    return (
        <TDataContext.Provider value={value}>
            {children}
        </TDataContext.Provider>
    );
};

