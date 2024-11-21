"use client";
import LayoutContainer from "../components/LayoutContainer";

const APP = () => {
    return (
        <LayoutContainer currentpathname="/politic">
            {/* <ECommerce /> */}
           
            <iframe src="./youwei/politic/index.html" style={{ width: "100%", height: "100%","minHeight":"800px" }}></iframe>
        </LayoutContainer>
    );
};
export default APP;
