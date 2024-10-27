import React from "react";
import HighchartsReact from "highcharts-react-official";
const Chart = ({ options, highcharts }: any) => {
    if (typeof window == "undefined") {
        return <div></div>;
    } else {
        return (
            <HighchartsReact
                highcharts={highcharts}
                constructorType={"chart"}
                options={options}
            />
        );
    }
};
export default Chart;
