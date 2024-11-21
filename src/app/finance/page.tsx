"use client";
import LayoutContainer from "../components/LayoutContainer";

const APP = () => {
    return (
        <LayoutContainer currentpathname="/hot">
            {/* <ECommerce /> */}
           
            <iframe src="./youwei/hot/index.html" style={{ width: "100%", height: "100%","minHeight":"800px" }}></iframe>
        </LayoutContainer>
    );
};
export default APP;
