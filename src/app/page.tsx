"use client";
import React from "react";


const Home = ({stars}:any) => {
    console.log("[stars]",stars);
    
    return (
        <div className="App">
         hello
        </div>
    );
};

Home.getInitialProps = async () => {
   
    return { stars: {
        test:1
    }};
};

export default Home;