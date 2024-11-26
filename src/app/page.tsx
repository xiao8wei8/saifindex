"use client";
import { Spin } from "antd";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";


const Home = ({stars}:any) => {
    console.log("[stars]",stars);
    useEffect(() => {
        redirect(`/home`); 
    },[])
    
    return (
        <div className="App">
         <Spin size="large" />

       

        </div>
    );
};

Home.getInitialProps = async () => {
   
    return { stars: {
        test:1
    }};
};

export default Home;