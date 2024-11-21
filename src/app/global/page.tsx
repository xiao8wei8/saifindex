"use client";
import LayoutContainer from "../components/LayoutContainer";

const APP = () => {
    return (
        <LayoutContainer currentpathname="/global">
            {/* <ECommerce /> */}
           
            <iframe src="./youwei/global.html" style={{ width: "100%", height: "100%","minHeight":"800px" }}></iframe>
        </LayoutContainer>
    );
};
export default APP;
