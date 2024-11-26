"use client";
import LayoutContainer from "../components/LayoutContainer";
import './index.css';

const APP = () => {
    return (
        <LayoutContainer currentpathname="/dingpan">
            {/* <ECommerce /> */}
           
            <iframe src="https://xuangutong.com.cn/dingpan" style={{ width: "100%", height: "100%","minHeight":"800px" }}></iframe>
        </LayoutContainer>
    );
};
export default APP;
