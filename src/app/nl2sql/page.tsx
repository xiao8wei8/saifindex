"use client";
//@ts-ignore
import { PageContainer, ProLayout } from "@ant-design/pro-components";
import defaultProps from "../components/_defaultProps";
import Welcome from "./welcome";
import { useEffect, useState } from "react";
//@ts-ignore
import { Button, Spin } from "antd";
import LayoutContainer from "../components/LayoutContainer";
const SimpleDemo = () => {
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
    useEffect(() => {
        showLoader();
    }, []);
    return (
        <div>
            <Spin spinning={spinning} percent={percent} fullscreen />
            {showcontent ? (
               <Welcome />
            ) : null}
        </div>
    );
};
const APP = () => {
    return (
        <LayoutContainer currentpathname="/nl2sql">
            <SimpleDemo />
        </LayoutContainer>
    );
};
export default APP;
