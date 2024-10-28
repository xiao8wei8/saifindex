"use client";
import React, { use, useEffect, useRef, useState } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import HighchartsExporting from "highcharts/modules/exporting";

import "./style.css";

import { DatePicker } from "antd";
const { RangePicker } = DatePicker;

import { Calendar, theme } from "antd";
import type { CalendarProps } from "antd";
import type { Dayjs } from "dayjs";
import aaplOhlcvData from "./aapl-ohlcv";


const onPanelChange = (
    value: Dayjs,
    mode: CalendarProps<Dayjs>["mode"]
): any => {
    console.log(value.format("YYYY-MM-DD"), mode);
};
const getAaplOhlcv = () => {
    const data = aaplOhlcvData;

    // split the data set into ohlc and volume
    const ohlc = [],
        volume = [],
        dataLength = data.length;

    for (let i = 0; i < dataLength; i += 1) {
        ohlc.push([
            data[i][0], // the date
            data[i][1], // open
            data[i][2], // high
            data[i][3], // low
            data[i][4], // close
        ]);

        volume.push([
            data[i][0], // the date
            data[i][5], // the volume
        ]);
    }

    const ret = {
        yAxis: [
            {
                labels: {
                    align: "left",
                },
                height: "80%",
                resize: {
                    enabled: true,
                },
            },
            {
                labels: {
                    align: "left",
                },
                top: "80%",
                height: "20%",
                offset: 0,
            },
        ],
        tooltip: {
            shape: "square",
            headerShape: "callout",
            borderWidth: 0,
            shadow: false,
            positioner: function (width: number, height: number, point:any) {
                // @ts-ignore
                const chart:any = this.chart ;
                let position;

                if (point.isHeader) {
                    position = {
                        x: Math.max(
                            // Left side limit
                            chart.plotLeft,
                            Math.min(
                                point.plotX + chart.plotLeft - width / 2,
                                // Right side limit
                                chart.chartWidth - width - chart.marginRight
                            )
                        ),
                        y: point.plotY,
                    };
                } else {
                    position = {
                        x: point.series.chart.plotLeft,
                        y: point.series.yAxis.top - chart.plotTop,
                    };
                }

                return position;
            },
        },
        series: [
            {
                type: "ohlc",
                id: "aapl-ohlc",
                name: "AAPL Stock Price",
                data: ohlc,
            },
            {
                type: "column",
                id: "aapl-volume",
                name: "AAPL Volume",
                data: volume,
                yAxis: 1,
            },
        ],
        responsive: {
            rules: [
                {
                    condition: {
                        maxWidth: 800,
                    },
                    chartOptions: {
                        rangeSelector: {
                            inputEnabled: false,
                        },
                    },
                },
            ],
        },
    };
    return ret;
};

const aaplOhlcvOptions = getAaplOhlcv();

let callfn :any= null
const PickerContainer: React.FC = () => {
    const { token } = theme.useToken();

    const wrapperStyle: React.CSSProperties = {
        width: 300,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
    };

    return (
        <div style={wrapperStyle}>
            <RangePicker picker="month" onPanelChange={onPanelChange as any} />
        </div>
    );
};

if (typeof Highcharts === "object") {
    HighchartsExporting(Highcharts);
}
// Import our demo components
import Chart from "./components/Chart";
import StockChart from "./components/Stock";
import MapChart from "./components/Map";
import Container from "./components/Container";
import mapData from "./components/mapData";
import HeatMaps from "./components/HeatMaps";
import LayoutContainer from "../components/LayoutContainer";
if (typeof window == "undefined") {
} else {
    // Load Highcharts modules
    require("highcharts/indicators/indicators-all")(Highcharts);
    require("highcharts/indicators/pivot-points")(Highcharts);
    require("highcharts/indicators/macd")(Highcharts);
    require("highcharts/modules/exporting")(Highcharts);
    require("highcharts/modules/map")(Highcharts);
    require("highcharts/modules/treemap")(Highcharts);
    require("highcharts/modules/drag-panes")(Highcharts);
    require("highcharts/modules/annotations-advanced")(Highcharts);
    require("highcharts/modules/price-indicator")(Highcharts);
    require("highcharts/modules/full-screen")(Highcharts);
    require("highcharts/modules/stock-tools")(Highcharts);
}

// The wrapper exports only a default component that at the same time is a
// namespace for the related Props interface (HighchartsReact.Props) and
// RefObject interface (HighchartsReact.RefObject). All other interfaces
// like Options come from the Highcharts module itself.

const stockOptions = {
    yAxis: [
        {
            height: "75%",
            labels: {
                align: "right",
                x: -3,
            },
            title: {
                text: "AAPL",
            },
        },
        {
            top: "75%",
            height: "25%",
            labels: {
                align: "right",
                x: -3,
            },
            offset: 0,
            title: {
                text: "MACD",
            },
        },
    ],
    series: [
        {
            data: [
                /* Jan 2017 */
                [1483401600000, 115.8, 116.33, 114.76, 116.15],
                [1483488000000, 115.85, 116.51, 115.75, 116.02],
                [1483574400000, 115.92, 116.86, 115.81, 116.61],
                [1483660800000, 116.78, 118.16, 116.47, 117.91],
                [1483920000000, 117.95, 119.43, 117.94, 118.99],
                [1484006400000, 118.77, 119.38, 118.3, 119.11],
                [1484092800000, 118.74, 119.93, 118.6, 119.75],
                [1484179200000, 118.9, 119.3, 118.21, 119.25],
                [1484265600000, 119.11, 119.62, 118.81, 119.04],
                [1484611200000, 118.34, 120.24, 118.22, 120.0],
                [1484697600000, 120.0, 120.5, 119.71, 119.99],
                [1484784000000, 119.4, 120.09, 119.37, 119.78],
                [1484870400000, 120.45, 120.45, 119.73, 120.0],
                [1485129600000, 120.0, 120.81, 119.77, 120.08],
                [1485216000000, 119.55, 120.1, 119.5, 119.97],
                [1485302400000, 120.42, 122.1, 120.28, 121.88],
                [1485388800000, 121.67, 122.44, 121.6, 121.94],
                [1485475200000, 122.14, 122.35, 121.6, 121.95],
                [1485734400000, 120.93, 121.63, 120.66, 121.63],
                [1485820800000, 121.15, 121.39, 120.62, 121.35],
                /* Feb 2017 */
                [1485907200000, 127.03, 130.49, 127.01, 128.75],
                [1485993600000, 127.98, 129.39, 127.78, 128.53],
                [1486080000000, 128.31, 129.19, 128.16, 129.08],
                [1486339200000, 129.13, 130.5, 128.9, 130.29],
                [1486425600000, 130.54, 132.09, 130.45, 131.53],
                [1486512000000, 131.35, 132.22, 131.22, 132.04],
                [1486598400000, 131.65, 132.44, 131.12, 132.42],
                [1486684800000, 132.46, 132.94, 132.05, 132.12],
                [1486944000000, 133.08, 133.82, 132.75, 133.29],
                [1487030400000, 133.47, 135.09, 133.25, 135.02],
                [1487116800000, 135.52, 136.27, 134.62, 135.51],
                [1487203200000, 135.67, 135.9, 134.84, 135.34],
                [1487289600000, 135.1, 135.83, 135.1, 135.72],
                [1487635200000, 136.23, 136.75, 135.98, 136.7],
                [1487721600000, 136.43, 137.12, 136.11, 137.11],
                [1487808000000, 137.38, 137.48, 136.3, 136.53],
                [1487894400000, 135.91, 136.66, 135.28, 136.66],
                [1488153600000, 137.14, 137.44, 136.28, 136.93],
                [1488240000000, 137.08, 137.44, 136.7, 136.99],
                /* Mar 2017 */
                [1488326400000, 137.89, 140.15, 137.6, 139.79],
                [1488412800000, 140.0, 140.28, 138.76, 138.96],
                [1488499200000, 138.78, 139.83, 138.59, 139.78],
                [1488758400000, 139.36, 139.77, 138.6, 139.34],
                [1488844800000, 139.06, 139.98, 138.79, 139.52],
                [1488931200000, 138.95, 139.8, 138.82, 139.0],
                [1489017600000, 138.74, 138.79, 137.05, 138.68],
                [1489104000000, 139.25, 139.36, 138.64, 139.14],
                [1489363200000, 138.85, 139.43, 138.82, 139.2],
                [1489449600000, 139.3, 139.65, 138.84, 138.99],
                [1489536000000, 139.41, 140.75, 139.02, 140.46],
                [1489622400000, 140.72, 141.02, 140.26, 140.69],
                [1489708800000, 141.0, 141.0, 139.89, 139.99],
                [1489968000000, 140.4, 141.5, 140.23, 141.46],
                [1490054400000, 142.11, 142.8, 139.73, 139.84],
                [1490140800000, 139.84, 141.6, 139.76, 141.42],
                [1490227200000, 141.26, 141.58, 140.61, 140.92],
                [1490313600000, 141.5, 141.74, 140.35, 140.64],
                [1490572800000, 139.39, 141.22, 138.62, 140.88],
                [1490659200000, 140.91, 144.04, 140.62, 143.8],
                [1490745600000, 143.68, 144.49, 143.19, 144.12],
                [1490832000000, 144.19, 144.5, 143.5, 143.93],
                [1490918400000, 143.72, 144.27, 143.01, 143.66],
                /* Apr 2017 */
                [1491177600000, 143.71, 144.12, 143.05, 143.7],
                [1491264000000, 143.25, 144.89, 143.17, 144.77],
                [1491350400000, 144.22, 145.46, 143.81, 144.02],
                [1491436800000, 144.29, 144.52, 143.45, 143.66],
                [1491523200000, 143.73, 144.18, 143.27, 143.34],
                [1491782400000, 143.6, 143.88, 142.9, 143.17],
                [1491868800000, 142.94, 143.35, 140.06, 141.63],
                [1491955200000, 141.6, 142.15, 141.01, 141.8],
                [1492041600000, 141.91, 142.38, 141.05, 141.05],
                [1492387200000, 141.48, 141.88, 140.87, 141.83],
                [1492473600000, 141.41, 142.04, 141.11, 141.2],
                [1492560000000, 141.88, 142.0, 140.45, 140.68],
                [1492646400000, 141.22, 142.92, 141.16, 142.44],
                [1492732800000, 142.44, 142.68, 141.85, 142.27],
                [1492992000000, 143.5, 143.95, 143.18, 143.64],
                [1493078400000, 143.91, 144.9, 143.87, 144.53],
                [1493164800000, 144.47, 144.6, 143.38, 143.68],
                [1493251200000, 143.92, 144.16, 143.31, 143.79],
                [1493337600000, 144.09, 144.3, 143.27, 143.65],
                /* May 2017 */
                [1493596800000, 145.1, 147.2, 144.96, 146.58],
                [1493683200000, 147.54, 148.09, 146.84, 147.51],
                [1493769600000, 145.59, 147.49, 144.27, 147.06],
                [1493856000000, 146.52, 147.14, 145.81, 146.53],
                [1493942400000, 146.76, 148.98, 146.76, 148.96],
                [1494201600000, 149.03, 153.7, 149.03, 153.01],
                [1494288000000, 153.87, 154.88, 153.45, 153.99],
                [1494374400000, 153.63, 153.94, 152.11, 153.26],
                [1494460800000, 152.45, 154.07, 152.31, 153.95],
                [1494547200000, 154.7, 156.42, 154.67, 156.1],
                [1494806400000, 156.01, 156.65, 155.05, 155.7],
                [1494892800000, 155.94, 156.06, 154.72, 155.47],
                [1494979200000, 153.6, 154.57, 149.71, 150.25],
                [1495065600000, 151.27, 153.34, 151.13, 152.54],
                [1495152000000, 153.38, 153.98, 152.63, 153.06],
                [1495411200000, 154.0, 154.58, 152.91, 153.99],
                [1495497600000, 154.9, 154.9, 153.31, 153.8],
                [1495584000000, 153.84, 154.17, 152.67, 153.34],
                [1495670400000, 153.73, 154.35, 153.03, 153.87],
                [1495756800000, 154.0, 154.24, 153.31, 153.61],
                [1496102400000, 153.42, 154.43, 153.33, 153.67],
                [1496188800000, 153.97, 154.17, 152.38, 152.76],
                /* Jun 2017 */
                [1496275200000, 153.17, 153.33, 152.22, 153.18],
                [1496361600000, 153.58, 155.45, 152.89, 155.45],
                [1496620800000, 154.34, 154.45, 153.46, 153.93],
                [1496707200000, 153.9, 155.81, 153.78, 154.45],
                [1496793600000, 155.02, 155.98, 154.48, 155.37],
                [1496880000000, 155.25, 155.54, 154.4, 154.99],
                [1496966400000, 155.19, 155.19, 146.02, 148.98],
                [1497225600000, 145.74, 146.09, 142.51, 145.42],
                [1497312000000, 147.16, 147.45, 145.15, 146.59],
                [1497398400000, 147.5, 147.5, 143.84, 145.16],
                [1497484800000, 143.32, 144.48, 142.21, 144.29],
                [1497571200000, 143.78, 144.5, 142.2, 142.27],
                [1497830400000, 143.66, 146.74, 143.66, 146.34],
                [1497916800000, 146.87, 146.87, 144.94, 145.01],
                [1498003200000, 145.52, 146.07, 144.61, 145.87],
                [1498089600000, 145.77, 146.7, 145.12, 145.63],
                [1498176000000, 145.13, 147.16, 145.11, 146.28],
                [1498435200000, 147.17, 148.28, 145.38, 145.82],
                [1498521600000, 145.01, 146.16, 143.62, 143.73],
                [1498608000000, 144.49, 146.11, 143.16, 145.83],
                [1498694400000, 144.71, 145.13, 142.28, 143.68],
                [1498780800000, 144.45, 144.96, 143.78, 144.02],
                /* Jul 2017 */
                [1499040000000, 144.88, 145.3, 143.1, 143.5],
                [1499212800000, 143.69, 144.79, 142.72, 144.09],
                [1499299200000, 143.02, 143.5, 142.41, 142.73],
                [1499385600000, 142.9, 144.75, 142.9, 144.18],
                [1499644800000, 144.11, 145.95, 143.37, 145.06],
                [1499731200000, 144.73, 145.85, 144.38, 145.53],
                [1499817600000, 145.87, 146.18, 144.82, 145.74],
                [1499904000000, 145.5, 148.49, 145.44, 147.77],
                [1499990400000, 147.97, 149.33, 147.33, 149.04],
                [1500249600000, 148.82, 150.9, 148.57, 149.56],
                [1500336000000, 149.2, 150.13, 148.67, 150.08],
                [1500422400000, 150.48, 151.42, 149.95, 151.02],
                [1500508800000, 151.5, 151.74, 150.19, 150.34],
                [1500595200000, 149.99, 150.44, 148.88, 150.27],
                [1500854400000, 150.58, 152.44, 149.9, 152.09],
                [1500940800000, 151.8, 153.84, 151.8, 152.74],
                [1501027200000, 153.35, 153.93, 153.06, 153.46],
                [1501113600000, 153.75, 153.99, 147.3, 150.56],
                [1501200000000, 149.89, 150.23, 149.19, 149.5],
                [1501459200000, 149.9, 150.33, 148.13, 148.73],
                /* Aug 2017 */
                [1501545600000, 149.1, 150.22, 148.41, 150.05],
                [1501632000000, 159.28, 159.75, 156.16, 157.14],
                [1501718400000, 157.05, 157.21, 155.02, 155.57],
                [1501804800000, 156.07, 157.4, 155.69, 156.39],
                [1502064000000, 157.06, 158.92, 156.67, 158.81],
                [1502150400000, 158.6, 161.83, 158.27, 160.08],
                [1502236800000, 159.26, 161.27, 159.11, 161.06],
                [1502323200000, 159.9, 160.0, 154.63, 155.32],
                [1502409600000, 156.6, 158.57, 156.07, 157.48],
                [1502668800000, 159.32, 160.21, 158.75, 159.85],
                [1502755200000, 160.66, 162.2, 160.14, 161.6],
                [1502841600000, 161.94, 162.51, 160.15, 160.95],
                [1502928000000, 160.52, 160.71, 157.84, 157.86],
                [1503014400000, 157.86, 159.5, 156.72, 157.5],
                [1503273600000, 157.5, 157.89, 155.11, 157.21],
                [1503360000000, 158.23, 160.0, 158.02, 159.78],
                [1503446400000, 159.07, 160.47, 158.88, 159.98],
                [1503532800000, 160.43, 160.74, 158.55, 159.27],
                [1503619200000, 159.65, 160.56, 159.27, 159.86],
                [1503878400000, 160.14, 162.0, 159.93, 161.47],
                [1503964800000, 160.1, 163.12, 160.0, 162.91],
                [1504051200000, 163.8, 163.89, 162.61, 163.35],
                [1504137600000, 163.64, 164.52, 163.48, 164.0],
                /* Sep 2017 */
                [1504224000000, 164.8, 164.94, 163.63, 164.05],
                [1504569600000, 163.75, 164.25, 160.56, 162.08],
                [1504656000000, 162.71, 162.99, 160.52, 161.91],
                [1504742400000, 162.09, 162.24, 160.36, 161.26],
                [1504828800000, 160.86, 161.15, 158.53, 158.63],
                [1505088000000, 160.5, 162.05, 159.89, 161.5],
                [1505174400000, 162.61, 163.96, 158.77, 160.86],
                [1505260800000, 159.87, 159.96, 157.91, 159.65],
                [1505347200000, 158.99, 159.4, 158.09, 158.28],
                [1505433600000, 158.47, 160.97, 158.0, 159.88],
                [1505692800000, 160.11, 160.5, 158.0, 158.67],
                [1505779200000, 159.51, 159.77, 158.44, 158.73],
                [1505865600000, 157.9, 158.26, 153.83, 156.07],
                [1505952000000, 155.8, 155.8, 152.75, 153.39],
                [1506038400000, 151.54, 152.27, 150.56, 151.89],
                [1506297600000, 149.99, 151.83, 149.16, 150.55],
                [1506384000000, 151.78, 153.92, 151.69, 153.14],
                [1506470400000, 153.8, 154.72, 153.54, 154.23],
                [1506556800000, 153.89, 154.28, 152.7, 153.28],
                [1506643200000, 153.21, 154.13, 152.0, 154.12],
                /* Oct 2017 */
                [1506902400000, 154.26, 154.45, 152.72, 153.81],
                [1506988800000, 154.01, 155.09, 153.91, 154.48],
                [1507075200000, 153.63, 153.86, 152.46, 153.48],
                [1507161600000, 154.18, 155.44, 154.05, 155.39],
                [1507248000000, 154.97, 155.49, 154.56, 155.3],
                [1507507200000, 155.81, 156.73, 155.48, 155.84],
                [1507593600000, 156.06, 158.0, 155.1, 155.9],
                [1507680000000, 155.97, 156.98, 155.75, 156.55],
                [1507766400000, 156.35, 157.37, 155.73, 156.0],
                [1507852800000, 156.73, 157.28, 156.41, 156.99],
            ],
            type: "ohlc",
            name: "AAPL Stock Price",
            id: "aapl",
        },
        {
            type: "pivotpoints",
            linkedTo: "aapl",
            zIndex: 0,
            lineWidth: 1,
            dataLabels: {
                overflow: "none",
                crop: false,
                y: 4,
                style: {
                    fontSize: 9,
                },
            },
        },
        {
            type: "macd",
            yAxis: 1,
            linkedTo: "aapl",
        },
    ],
};
let flagStr = false
const HeatMapsOptions = {
    series: [
        {
            type: "treemap",
            layoutAlgorithm: "stripes",
            alternateStartingDirection: true,
            borderColor: "#fff",
            borderRadius: 6,
            borderWidth: 2,

            events: {
                click: function (event: any) {
                    console.log("flagStr",flagStr);
                    // setFlag(!flag);
                    // flagStr = !flagStr;
                    callfn();
                },
            },
            dataLabels: {
                style: {
                    textOutline: "none",
                },
            },
            levels: [
                {
                    level: 1,
                    layoutAlgorithm: "sliceAndDice",
                    dataLabels: {
                        enabled: true,
                        align: "left",
                        verticalAlign: "top",
                        style: {
                            fontSize: "15px",
                            fontWeight: "bold",
                        },
                    },
                },
            ],
            data: [
                {
                    id: "A",
                    name: "Nord-Norge",
                    color: "#50FFB1",
                },
                {
                    id: "B",
                    name: "Trøndelag",
                    color: "#F5FBEF",
                },
                {
                    id: "C",
                    name: "Vestlandet",
                    color: "#A09FA8",
                },
                {
                    id: "D",
                    name: "Østlandet",
                    color: "#E7ECEF",
                },
                {
                    id: "E",
                    name: "Sørlandet",
                    color: "#A9B4C2",
                },
                {
                    name: "Troms og Finnmark",
                    parent: "A",
                    value: 70923,
                },
                {
                    name: "Nordland",
                    parent: "A",
                    value: 35759,
                },
                {
                    name: "Trøndelag",
                    parent: "B",
                    value: 39494,
                },
                {
                    name: "Møre og Romsdal",
                    parent: "C",
                    value: 13840,
                },
                {
                    name: "Vestland",
                    parent: "C",
                    value: 31969,
                },
                {
                    name: "Rogaland",
                    parent: "C",
                    value: 8576,
                },
                {
                    name: "Viken",
                    parent: "D",
                    value: 22768,
                },
                {
                    name: "Innlandet",
                    parent: "D",
                    value: 49391,
                },
                {
                    name: "Oslo",
                    parent: "D",
                    value: 454,
                },
                {
                    name: "Vestfold og Telemark",
                    parent: "D",
                    value: 15925,
                },
                {
                    name: "Agder",
                    parent: "E",
                    value: 14981,
                },
            ],
        },
    ],
    title: {
        text: "Norwegian regions and counties by area",
        align: "left",
    },
    subtitle: {
        text: 'Source: <a href="https://snl.no/Norge" target="_blank">SNL</a>',
        align: "left",
    },
    tooltip: {
        useHTML: true,
        pointFormat:
            "The area of <b>{point.name}</b> is <b>{point.value} km<sup>" +
            "2</sup></b>",
    },
};
const App = () => {
    const [flag, setFlag] = useState(false);
 
    useEffect(() => {
        console.log("flagStr//",flagStr);
        
        // return callfn = ()=>{
        //     setFlag(!flag);
        // }
    },[])

    if (typeof window == "undefined") {
        return <div></div>;
    }

    return (
        <div id="chartContainer">
            <HeatMaps options={HeatMapsOptions} highcharts={Highcharts}  />

            {flag?  <StockChart options={stockOptions} highcharts={Highcharts}  />:<StockChart options={aaplOhlcvOptions} highcharts={Highcharts} />}

          

            

            {/* <h2>Highcharts</h2>
                    <Chart options={this.state.options} highcharts={Highcharts} />
                    <button onClick={this.onClick}>Update Series</button>
    
                    <h2>Highmaps</h2>
                    <MapChart options={mapOptions} highcharts={Highcharts} />
    
                    <h2>Live updating chart</h2>
                    <Container /> */}
        </div>
    );
};



const APP2 = () => {
    if (typeof window == "undefined") {
        return <div></div>;
    } else {
        return (
            <LayoutContainer currentpathname="/a50">
                <PickerContainer />
                <App />
            </LayoutContainer>
        );
    }
};
export default APP2;
