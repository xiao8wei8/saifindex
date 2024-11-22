"use client"

import { createContext, use, useContext, useEffect, useState } from "react";


export const TDataContext = createContext({});


// export const useData = () => {
//     return useContext(TDataContext);
// };
export const DataProvider = ({ children,value }: any) => {
    // const getInitialProps = async () => {
    //     const res = await fetch("https://api.github.com/repos/vercel/next.js");
    //     const json = await res.json();
    //     return { stars: json.stargazers_count };
    // };
    // const [data, setData] = useState({});
    // useEffect( async () => {
    //     const initiaData = await getInitialProps();
    // },[])
    
    console.log("[]initiaData",value);
    return (
        <TDataContext.Provider value={value}>
            {children}
        </TDataContext.Provider>
    );
};