"use client";
import { createContext, useContext } from "react";
const getInitialProps = async () => {
    const res = await fetch("https://api.github.com/repos/vercel/next.js");
    const json = await res.json();
    return { stars: json.stargazers_count };
};

const TDataContext = createContext({});
// export default TDataContext;

export const useData = () => {
    return useContext(TDataContext);
};
export const DataProvider = async({ children,value }: any) => {
    // const initiaData = await getInitialProps();
    console.log("[]initiaData", value);
    return (
        <TDataContext.Provider value={value}>
            {children}
        </TDataContext.Provider>
    );
};