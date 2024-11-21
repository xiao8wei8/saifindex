"use client";
import LayoutContainer from "../components/LayoutContainer";

const APP = () => {
    return (
        <LayoutContainer currentpathname="/shishi">
            {/* <ECommerce /> */}
           
            <iframe src="./youwei/index.html" style={{ width: "100%", height: "100%","minHeight":"800px" }}></iframe>
        </LayoutContainer>
    );
};
export default APP;
