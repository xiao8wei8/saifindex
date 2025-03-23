"use client";
import { use, useEffect, useRef, useState } from "react";
import LayoutContainer from "../components/LayoutContainer";
import axios from "axios";
axios.defaults.timeout = 50000;
import "./index.css";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
// @ts-ignore
import config from "@/libs/config";
import {
    AutoComplete,
    AutoCompleteProps,
    Button,
    DatePicker,
    Flex,
    FlexProps,
    Input,
    Space,
    Table,
    Tag,
    Tooltip,
} from "antd";
import React from "react";
import dayjs from "dayjs";
import symbols from "./symbol";
import { createStyles } from "antd-style";
import { set } from "react-hook-form";
import { text } from "stream/consumers";
import { CloseOutlined } from "@ant-design/icons";
import { Select } from "antd";
// import { use, useEffect, useState } from "react";
import * as ExcelJs from 'exceljs';
import { generateHeaders, saveWorkbook } from "@/libs/utils";

const geturl = config.url;

const boxStyle: React.CSSProperties = {
    width: "100%",
    height: 40,
    borderRadius: 6,
    // border: '1px solid #40a9ff',
};

const justifyOptions = [
    "flex-start",
    "center",
    "flex-end",
    "space-between",
    "space-around",
    "space-evenly",
];
const alignOptions = ["flex-start", "center", "flex-end"];

const mockVal = (str: string, repeat = 1) => ({
    value: str.repeat(repeat),
});
const mockVal2 = (str: string, repeat = 1) => {
    let ret: any = [];
    for (let index = 0; index < symbols.length; index++) {
        const symbol = symbols[index];
        if (symbol[0].indexOf(str) != -1 || symbol[1].indexOf(str) != -1) {
            ret = [{ value: symbol[0].trim() + "-" + symbol[1].trim() }];
            break;
        }
    }

    console.log("[ret]", ret);
    return ret;
};

const useStyle = createStyles(({ css, token }) => {
    const { antCls }: any = token;
    return {
        customTable: css`
            ${antCls}-table {
                ${antCls}-table-container {
                    ${antCls}-table-body,
                    ${antCls}-table-content {
                        scrollbar-width: thin;
                        scrollbar-color: #eaeaea transparent;
                        scrollbar-gutter: stable;
                    }
                }
            }
        `,
    };
});

// 默认字体为微软雅黑 Microsoft YaHei,字体大小为 14px
function getTextWidth(text: any, font = "14px Microsoft YaHei") {
    const canvas = document.createElement("canvas");
    let context: any = canvas.getContext("2d");
    context.font = font;
    let textmetrics = context.measureText(text);
    return textmetrics.width;
}

const APP = () => {
    // const dataSource:any = [

    //   ];
    const [loading, setLoading] = useState(true);
    const handleLoadingChange = (enable: boolean) => {
        setLoading(enable);
    };
    const [isShowStock, setIsShowStock] = useState(false);
    const onClose = () => {
        setIsShowStock(!isShowStock);
    };
    const getWidth = (valueArr: any, num?: any) => {
        // 计算平均值,保证列宽尽量保持均衡

        let len = valueArr.length;

        len = len * 20;
        if (num) {
            len += num;
        }
        return len;
    };

    // columns 为动态表格的表头数组 data为展示数据的数组
   
    let columns_dashboard_default: any = [
        {
            title: "交易日期",
            dataIndex: "交易日期",
            key: "交易日期",
            width: getWidth("交易日期", 20),
            fixed: "left",
        },
        {
            title: "股票代码",
            dataIndex: "股票代码",
            key: "股票代码",
            width: getWidth("股票代码"),
            fixed: "left",
            sorter: (a: any, b: any) =>
                parseInt(a["股票代码"]) - parseInt(b["股票代码"]),
        },
       
       
        {
            title: "当日开盘价",
            dataIndex: "当日开盘价",
            key: "当日开盘价",
            width: getWidth("当日开盘价"),
            sorter: (a: any, b: any) =>
                parseFloat(a["当日开盘价"]) - parseFloat(b["当日开盘价"]),
        },
        {
            title: "当日收盘价",
            dataIndex: "当日收盘价",
            key: "当日收盘价",
            width: getWidth("当日收盘价"),
            sorter: (a: any, b: any) =>
                parseFloat(a["当日收盘价"]) - parseFloat(b["当日收盘价"]),
        },
        {
            title: "当日最高价",
            dataIndex: "当日最高价",
            key: "当日最高价",
            width: getWidth("当日最高价"),
            sorter: (a: any, b: any) =>
                parseFloat(a["当日最高价"]) - parseFloat(b["当日最高价"]),
        },
       
        {
            title: "当日最低价",
            dataIndex: "当日最低价",
            key: "当日最低价",
            width: getWidth("当日最低价"),
            sorter: (a: any, b: any) =>
                parseFloat(a["当日最低价"]) - parseFloat(b["当日最低价"]),
        },
        {
            title: "前一日收盘价",
            dataIndex: "前一日收盘价",
            key: "前一日收盘价",
            width: getWidth("前一日收盘价"),
            sorter: (a: any, b: any) =>
                parseFloat(a["前一日收盘价"]) - parseFloat(b["前一日收盘价"]),
        },

       
        {
            title: "当日成交量",
            dataIndex: "当日成交量",
            key: "当日成交量",
            width: getWidth("当日成交量"),
            sorter: (a: any, b: any) =>
                parseFloat(a["当日成交量"]) - parseFloat(b["当日成交量"]),
        }
       
    ];
    
    const [dataSource, setDataSource] = useState([]);
    const [dataSource_dashboard, setDataSourceDashboard] = useState([]);
    let first_dataSource_dashboard: any = [];
    const dataSource_dashboardRef = useRef(dataSource_dashboard);
    useEffect(() => {
        dataSource_dashboardRef.current = dataSource_dashboard;
    });
    const [typeoptions, setTypeoptions] = useState([]);
    const [columns_dashboard, setColumnsDashboard] = useState(
        columns_dashboard_default
    );
    const [options2, setOptions2] = useState({});
    const [currentLineSeries, setCurrentLineSeries] = useState([
        {
            name: "中国",
            marker: {
                symbol: "square",
            },
            data: [
                43934,
                {
                    y: 48656,
                    marker: {
                        symbol: "url(/die.jpg)",
                    },
                },
                65165,
                81827,
                112143,
                142383,
                171533,
                165174,
                155157,
                161454,
                154610,
                168960,
            ],
        },
    ]);
    const [xAxis, setXAxis] = useState({});

    let columns = columns_dashboard_default

    // columns = columns.map((item) => {
    //   return {
    //     ...item,
    //     minWidth:"200px"
    //   };
    // });
    for (let index = 0; index < columns.length; index++) {
        let item: any = columns[index];

        // if (index <= 6) {
        //     item["width"] = 140;
        // } else {
        //     item["width"] = 180;
        // }

        if (index <= 3) {
            item["fixed"] = "left";
        }
    }
    console.log("[columns]", columns);
    let filters: any = {};
    let isFirst = true;
    const getValDashboard = async (stockcode: any,date?:any) => {
        const data = await getStockDataByCode("tradesignaldashboardus", {
            stockcode: (stockcode || "").trim(),
            date: date,
        });
        console.log("[--data]", data);

        let results = data.data.data.results;
        let new_results: any = [];
        results.map((item: any, index: number) => {
            item["交易日期"] = dayjs(new Date(item["交易日期"])).format(
                "YYYY-MM-DD"
            );
            // item["涨幅次数"]=parseInt(item["涨幅次数"]);
            // item["跌幅次数"]=parseInt(item["跌幅次数"]);
        });
        let flag: any = {};
        let columns_dashboard_add: any = [];
        let isNo1 = 0;
        results.map((item: any, index: number) => {
            const symbol = item["股票代码"];
            if (!flag[symbol]) {
                isNo1 += 1;
                flag[symbol] = item;
            } else {
                flag[symbol][item["交易日期"]] = item["当日收盘价"];
                flag[symbol]["涨幅次数"] += item["涨幅次数"];
                flag[symbol]["跌幅次数"] += item["跌幅次数"];
                if (isNo1 == 1) {
                    columns_dashboard_add.push({
                        title: item["交易日期"],
                        dataIndex: item["交易日期"],
                        key: item["交易日期"],
                        width: 100,
                    });
                }
            }
        });

        for (var key in flag) {
            let keyItem = flag[key];
            new_results.push(keyItem);
            for (
                let index = 0;
                index < columns_dashboard_default.length;
                index++
            ) {
                let item = columns_dashboard_default[index];
                let title = item["title"];

                if (!filters[title]) {
                    filters[title] = {};
                }
                filters[title][keyItem[title]] = 1;
            }
        }
        console.log("[filters]", filters);
        // console.log("[flag]", flag);
        console.log("[columns_dashboard_default]", columns_dashboard_default);
        // 定义一个 Map 接收每列的长度值
        // let widthMap: any = new Map();
        // //作用是遍历所有数据拿到长度，记下每一列的宽度
        // results.forEach((target: any) => {
        //     for (let key in target) {
        //         if (target.hasOwnProperty(key)) {
        //             let keyWidth = getTextWidth(target[key]);
        //             // 字段有值就放入数组
        //             widthMap.has(key)
        //                 ? widthMap.set(key, widthMap.get(key).concat(keyWidth))
        //                 : widthMap.set(
        //                       key,
        //                       [].concat(keyWidth ? keyWidth : [])
        //                   );
        //         }
        //     }
        // });

        // // 计算平均值,保证列宽尽量保持均衡
        // for (let [mapKey] of widthMap) {
        //     let valueArr = widthMap.get(mapKey);
        //     let len = valueArr.length;
        //     let value = valueArr.reduce(
        //         (acc: any, cur: any) => acc + 1 / cur,
        //         0
        //     );
        //     widthMap.set(mapKey, len / value);
        // }

        // //遍历表头，拿到对应表头的宽度与对应表头下内容比对，取最大值作为列宽，这样可以确保表头不换行。35为表头title左右的padding + border
        // columns.map((item: any) => {
        //     // title，dataIndex为 ant design Table对应参数
        //     let textWidth = getTextWidth(item.title);
        //     if (widthMap.get(item.dataIndex) < textWidth) {
        //         widthMap.set(item.dataIndex, textWidth);
        //     }
        //     return (item.width = Math.ceil(widthMap.get(item.dataIndex)) + 35);
        // });
        // console.log("[columns]", columns);
        // for (let index = 0; index < columns_dashboard_add.length; index++) {
        //     let item: any = columns_dashboard_add[index];

        //     // if (index <= 6) {
        //     //     item["width"] = 140;
        //     // } else {
        //     //     item["width"] = 180;
        //     // }

        //     if (index <= 3) {
        //         item["fixed"] = "left";
        //     }
        // }
        let columns_dashboard_all = columns_dashboard_default.concat(
            columns_dashboard_add
        );

        setColumnsDashboard(columns_dashboard_all);

        // const newColumns = columns_dashboard_all.map((item:any) => ({
        //     ...item,
        // hidden: !checkedList.includes(item.key),
        // }));
        
        // if(isFirst) {
        // new_results = new_results.sort(
        //     (a: any, b: any) =>
        //         parseInt(a["股票代码"]) - parseInt(b["股票代码"])
        // );
        //     isFirst =false
        // }

        first_dataSource_dashboard = new_results;
        setDataSourceDashboard(new_results);
       

        // // console.log("[new_results]", new_results);
        // first_dataSource_dashboard = new_results;
        // setDataSourceDashboard(new_results);
        // let priceRangeOptionsArray: any = [
        //     { value: "<4", label: "<4", title: "股价区间" },
        //     { value: "4-8", label: "4-8", title: "股价区间" },
        //     { value: "8-16", label: "8-16", title: "股价区间" },
        //     { value: "16-32", label: "16-32", title: "股价区间" },
        //     { value: "32-64", label: "32-64", title: "股价区间" },
        //     { value: "64-128", label: "64-128", title: "股价区间" },
        //     { value: "128-256", label: "128-256", title: "股价区间" },
        //     { value: "256-512", label: "256-512", title: "股价区间" },
        //     { value: ">512", label: ">512", title: "股价区间" },
        // ];
        // let _typeoptions: any = [
        //     <Flex>
        //         <Select
        //             mode="multiple"
        //             allowClear
        //             showSearch
        //             placeholder={"股价区间"}
        //             maxTagCount="responsive"
        //             filterOption={(input, option) =>
        //                 ((option?.label ?? "") as string)
        //                     .toLowerCase()
        //                     .includes(input.toLowerCase())
        //             }
        //             style={{ width: 120 }}
        //             onChange={onSelectChange}
        //             defaultValue={changeOptions["股价区间"]||[]}
        //             onDeselect={(value: any) => {
        //                 onDeselect(value,"股价区间");
        //             }}
        //             options={priceRangeOptionsArray}
        //             onClear={() => {
        //                 onClear("股价区间");
        //             }}
        //         />
        //     </Flex>,
        // ];
        // for (var item in filters) {
        //     if (item == "交易日期") {
        //         continue;
        //     }
        //     let _item1 = filters[item];
        //     let optionsArray: any = []; //{ "value": '', "label": '清除',"title": item}
        //     for (var item2 in _item1) {
        //         optionsArray.push({ value: item2, label: item2, title: item });
        //     }
        //     console.log("[filters][optionsArray]", optionsArray);
        //     (function (item) {
        //         _typeoptions.push(
        //             <Flex>
        //                 <Select
        //                     mode="multiple"
        //                     allowClear
        //                     showSearch
        //                     placeholder={item}
        //                     maxTagCount="responsive"
        //                     filterOption={(input, option) =>
        //                         ((option?.label ?? "") as string)
        //                             .toLowerCase()
        //                             .includes(input.toLowerCase())
        //                     }
        //                     style={{ width: 120 }}
        //                     onChange={onSelectChange}
        //                     onClear={() => {
        //                         onClear(item);
        //                     }}
        //                     options={optionsArray}
        //                     onDeselect={(value: any) => {
        //                         onDeselect(value,item);
        //                     }}
        //                     defaultValue={changeOptions[item]||[]}
        //                 />
        //             </Flex>
        //         );
        //     })(item);
        // }

        // setTypeoptions(_typeoptions);
        // // let _series: any[] = [];
        // // let _xAxis: any = [];
        // // let _name = "";
        // // results.map((item: any, index: number) => {
        // //     item["交易日期"] = dayjs(new Date(item["交易日期"])).format(
        // //         "YYYY-MM-DD"
        // //     );

        // // });
        // // xAxis
        handleLoadingChange(false);
    };
    const getVal = async (stockcode: any) => {
        const data = await getStockDataByCode("tradesignalus", {
            stockcode: (stockcode || "").trim(),
            date: "",
        });
        console.log("[--data]", data);
        let results = data.data.data.results;
        results.map((item: any, index: number) => {
            item["交易日期"] = dayjs(new Date(item["交易日期"])).format(
                "YYYY-MM-DD"
            );
        });
        // 定义一个 Map 接收每列的长度值
        // let widthMap: any = new Map();
        // //作用是遍历所有数据拿到长度，记下每一列的宽度
        // results.forEach((target: any) => {
        //     for (let key in target) {
        //         if (target.hasOwnProperty(key)) {
        //             let keyWidth = getTextWidth(target[key]);
        //             // 字段有值就放入数组
        //             widthMap.has(key)
        //                 ? widthMap.set(key, widthMap.get(key).concat(keyWidth))
        //                 : widthMap.set(
        //                       key,
        //                       [].concat(keyWidth ? keyWidth : [])
        //                   );
        //         }
        //     }
        // });

        // // 计算平均值,保证列宽尽量保持均衡
        // for (let [mapKey] of widthMap) {
        //     let valueArr = widthMap.get(mapKey);
        //     let len = valueArr.length;
        //     let value = valueArr.reduce(
        //         (acc: any, cur: any) => acc + 1 / cur,
        //         0
        //     );
        //     widthMap.set(mapKey, len / value);
        // }

        // //遍历表头，拿到对应表头的宽度与对应表头下内容比对，取最大值作为列宽，这样可以确保表头不换行。35为表头title左右的padding + border
        // columns.map((item: any) => {
        //     // title，dataIndex为 ant design Table对应参数
        //     let textWidth = getTextWidth(item.title);
        //     if (widthMap.get(item.dataIndex) < textWidth) {
        //         widthMap.set(item.dataIndex, textWidth);
        //     }
        //     return (item.width = Math.ceil(widthMap.get(item.dataIndex)) + 35);
        // });
        // console.log("[columns]", columns);

        setDataSource(results);
        let _series2: any[] = [];
        let _xAxis2: any = [];
        let _name = "";
        let  applyNewDataOpt = []
        

        results.map((item: any, index: number) => {
            // let _item:any = {}
            // _item["close"] = item["交易日期"];
            // _item["close"] = item["当日收盘价"];
            // _item["close"] = item["当日收盘价"];
            // _item["close"] = item["当日收盘价"];
            // _item["close"] = item["当日收盘价"];
            // _item["close"] = item["当日收盘价"];
            

            // applyNewDataOpt.push(item)


            item["交易日期"] = dayjs(new Date(item["交易日期"])).format(
                "YYYY-MM-DD"
            );
           
            if (!_name) _name = item["股票名称(中文)"];

            if (item["交易信号名称"] == "sell") {
                _series2.push({
                    y: item["当日收盘价"] * 1,
                    marker: {
                        symbol: "url(/die.jpg)",
                    },
                });
            } else if (item["交易信号名称"] == "buy") {
                _series2.push({
                    y: item["当日收盘价"] * 1,
                    marker: {
                        symbol: "url(/zhang.jpg)",
                    },
                });
            } else {
                _series2.push({
                    y: item["当日收盘价"] * 1,
                    marker: {
                       
                    },
                });
            }

            _xAxis2.push(item["交易日期"]);
        });
 
       
        console.log("[_xAxis]", _xAxis2);

        const _reversed_xAxis = _xAxis2.reverse();
        const _reversed_series = _series2.reverse();
        console.log("[_reversed_xAxis]", _reversed_xAxis);
        // setXAxis({
        //     categories: _reversed_xAxis,
        // });
        console.log("[_series]", _reversed_series);
        // setCurrentLineSeries([
        //     {
        //         name: _name,
        //         marker: {
        //             symbol: "square",
        //         },
        //         data: _reversed_series,
        //         //  [
        //         //     43934, {
        //         //         y: 48656,
        //         //         marker: {
        //         //            symbol: 'url(/die.jpg)'
        //         //         }
        //         //      },65165, 81827, 112143, 142383, 171533, 165174,
        //         //     155157, 161454, 154610, 168960,
        //         // ],
        //     },
        // ]);
        const _options  = {
            title: {
                text: _name + "交易信号",
            },
            yAxis: {
                title: {
                    text: "收盘价",
                },
            },
            xAxis: {
                categories: _reversed_xAxis,
            },
            series: [
                {
                    name: _name,
                    marker: {
                        symbol: "square",
                    },
                    data: _reversed_series,
                    //  [
                    //     43934, {
                    //         y: 48656,
                    //         marker: {
                    //            symbol: 'url(/die.jpg)'
                    //         }
                    //      },65165, 81827, 112143, 142383, 171533, 165174,
                    //     155157, 161454, 154610, 168960,
                    // ],
                },
            ],
            chart: {
                type: "line",
                events: { load: () => {} },
            },
        }
        console.log("[_options]", _options);
        setTimeout(() => {
            setOptions2(_options)
        },100)
        
        // xAxis
    };

    useEffect(() => {
        const fn = async () => {
            console.log("[fn]");
            await getValDashboard("");
            // await getVal("");
            // slug = (await params).slug;
            // setCurrentpathname('/indexs/'+slug)
            // const data = await getStockDataByCode("tradesignal", {
            //     stockcode: "",
            //     date:""
            // });
            // console.log("[--data]", data);
            // let results = data.data.data.results;
            // results.map((item: any, index: number) => {
            //     item['交易日期'] = dayjs(new Date(item['交易日期'])).format('YYYY-MM-DD');
            // })
            // setDataSource(results)
            // let results = data.data.data.results;
            // results.map((item: any, index: number) => {
            //     item.colorValue = 300 + index;
            //     item.value = parseFloat(item.value);
            //     item.name =
            //         item.name + "</br>" + item.id + "</br>" + item.value;
            // });
            // console.log("[results]", results);
            // setWeighValue(results);
        };
        fn();
    }, []);
    const onPanelChange = (date: any, dateString: any) => {
        console.log(date, dateString);

        getValDashboard("",dateString);
    };
    const [justify, setJustify] = React.useState<FlexProps["justify"]>(
        justifyOptions[0]
    );
    const [alignItems, setAlignItems] = React.useState<FlexProps["align"]>(
        alignOptions[0]
    );
    const [value, setValue] = useState("");
    const defaultValue = [{ value: "all-all", label: "all-all" }];
    const [options, setOptions] =
        useState<AutoCompleteProps["options"]>(defaultValue);
    const [anotherOptions, setAnotherOptions] = useState<
        AutoCompleteProps["options"]
    >([]);

    const getPanelValue = (searchText: string) => {
        let ret1 = !searchText ? [] : mockVal2(searchText);
        let ret = defaultValue.concat(ret1);
        return ret;
    };

    const onSelect = async (data: string) => {
        console.log("onSelect", data);
        const datats = data.split("-");
        if (datats[0] == "清除") datats[0] = "";
        handleLoadingChange(true);
        await getValDashboard(datats[0]);
        // await getVal(datats[0]);
    };
    const onRowClick = async (record: any) => {
        const symbol = record["股票代码"];
        await getVal(symbol);
        setIsShowStock(!isShowStock);
    };

    const onChange = (data: string) => {
        setValue(data);
    };
    const onClear = function (item: any) {
        console.log("[onClear]", item);
        delete changeOptions[item];
      
    };
    const onDeselect = function (value: any,name: any) {
        console.log("[onDeselect]", value,name);
        if(changeOptions[name].includes(value)) {
            delete changeOptions[name];
            onSelectChange("",[])
        }   
        
    }
    let changeOptions: any = {};

    const onSelectChange = (value: any, option: any) => {
        const title = option[0]?.title;
        // if(value) {
        changeOptions[title] = typeof value == "string" ? [value] : value;
        // }

        for (var i in changeOptions) {
            if (changeOptions[i] == "undefined" || changeOptions[i] == "") {
                delete changeOptions[i];
            }
        }
        console.log("onSelectChange", option, changeOptions);
        if (Object.keys(changeOptions).length == 0) {
            setDataSourceDashboard(first_dataSource_dashboard);
            return;
        }
        var _new_results: any = [];
        first_dataSource_dashboard.map((item: any, index: number) => {
            // if(item[title]==value) {
            //     _new_results.push(item);
            // }
            var flage = 0;

            for (var i in changeOptions) {
                let inItem = item[i];

                if (i == "股价区间") {
                    inItem = item["当日收盘价"];

                    let _price = parseFloat(inItem);

                    if (_price < 4) {
                        inItem = "<4";
                    } else if (_price >= 4 && _price < 8) {
                        inItem = "4-8";
                    } else if (_price >= 8 && _price < 16) {
                        inItem = "8-16";
                    } else if (_price >= 16 && _price < 32) {
                        inItem = "16-32";
                    } else if (_price >= 32 && _price < 64) {
                        inItem = "32-64";
                    } else if (_price >= 64 && _price < 128) {
                        inItem = "64-128";
                    } else if (_price >= 128 && _price < 256) {
                        inItem = "128-256";
                    } else if (_price >= 256 && _price < 512) {
                        inItem = "256-512";
                    } else {
                        inItem = ">512";
                    }
                }

                if (changeOptions[i].includes(inItem + "")) {
                    flage = 1;
                } else {
                    flage = 0;
                    break;
                }
            }
            if (flage == 1) {
                _new_results.push(item);
            }
        });
        setDataSourceDashboard(_new_results);

        // setValue(data);
    };

    const { styles } = useStyle();

    function onExportBasicExcel() {
       
        // 创建工作簿
        const workbook = new (ExcelJs as any).Workbook();
        // 添加sheet
        const worksheet = workbook.addWorksheet('saifchat sheet');
        // 设置 sheet 的默认行高
        worksheet.properties.defaultRowHeight = 20;
        // 设置列
        worksheet.columns = generateHeaders(columns_dashboard);
        // 添加行
        worksheet.addRows(dataSource_dashboard);
        // 导出excel
        saveWorkbook(workbook, 'saifchat.xlsx');
      }
    return (
        <LayoutContainer currentpathname="/tradesignalus">
            {/* {!isShowStock ? ( */}
                <div style={{ display: !isShowStock?'block':'none'}}>
                    <Flex gap="middle" align="start" vertical>
                        <Space style={{margin: 10,float: 'right'}}>
                        <Button type={'primary'} onClick={onExportBasicExcel}>导出excel</Button>
                        </Space>
                        {typeoptions.length ? (
                            <Space wrap>{typeoptions}</Space>
                        ) : null}
                    </Flex>
                    <Table
                        showSorterTooltip={{ target: "sorter-icon" }}
                        loading={loading}
                        className={styles.customTable}
                        dataSource={dataSource_dashboard}
                        columns={columns_dashboard}
                        bordered
                        // pagination={{ pageSize: 20 }}
                        // scroll={columns.length > 3 ? { x: 1500 } : {}}
                        // pagination={{ pageSize: 50 }}

                        pagination={{
                            defaultPageSize: 50,
                            defaultCurrent: 1,
                            total: dataSource_dashboard.length,
                        }}
                        scroll={{ y: 120 * 7 }}
                        onRow={(record) => {
                            return {
                                onClick: (event) => {
                                    console.log("record", record);
                                    onRowClick(record);
                                }, // 点击行
                                onDoubleClick: (event) => {},
                                onContextMenu: (event) => {},
                                onMouseEnter: (event) => {}, // 鼠标移入行
                                onMouseLeave: (event) => {},
                            };
                        }}
                    />
                </div>
             {/* ) : ( */}
                <div  style={{ display: !isShowStock?'none':'block'}}>
                    <div>
                        <div className="right">
                            <Button
                                type="primary"
                                icon={
                                    <CloseOutlined
                                        onPointerEnterCapture={undefined}
                                        onPointerLeaveCapture={undefined}
                                    />
                                }
                                onClick={onClose}
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                    <Table
                        className={styles.customTable}
                        dataSource={dataSource}
                        columns={columns}
                        bordered
                        pagination={{
                            defaultPageSize: 50,
                            defaultCurrent: 1,
                            total: dataSource.length,
                        }}
                        // scroll={columns.length > 3 ? { x: 1500 } : {}}
                        // pagination={{ pageSize: 50 }}

                        // defaultCurrent={50} total={500}

                        scroll={{ y: 55 * 7 }}
                    />

                    <div>
                        <HighchartsReact
                            highcharts={Highcharts}
                            options={options2}
                            // constructorType={"bar"}
                        />
                        {/* <KlinechartsAPP  options={options2}/> */}
                    </div>
                </div>
             {/* )} */}
        </LayoutContainer>
    );
};

const getStockDataByCode = async (type: string, params: Object) => {
    // case "stock": //获取股票
    // const symbol = params.indexcode;
    //     sql = get_stock(symbol);

    const urlStr =
        geturl + "?_t=" + new Date().getTime() + "&type=" + type + "&params=" + JSON.stringify(params);
    console.log("[urlStr]", urlStr);
    const res = await fetch(urlStr,{
        next: { revalidate: 0 }, // 看这个属性，它会选择退出缓存
    });
    const json = await res.json();
    return { data: json };
};

export default APP;



// import { init, dispose } from 'klinecharts'
// const KlinechartsAPP= (options:any) => {
//   useEffect(() => {
//     const chart = init('chart')
          
//     chart?.applyNewData([
//       { close: 4976.16, high: 4977.99, low: 4970.12, open: 4972.89, timestamp: 1587660000000, volume: 204 },
//       { close: 4977.33, high: 4979.94, low: 4971.34, open: 4973.20, timestamp: 1587660060000, volume: 194 },
//       { close: 4977.93, high: 4977.93, low: 4974.20, open: 4976.53, timestamp: 1587660120000, volume: 197 },
//       { close: 4966.77, high: 4968.53, low: 4962.20, open: 4963.88, timestamp: 1587660180000, volume: 28 },
//       { close: 4961.56, high: 4972.61, low: 4961.28, open: 4961.28, timestamp: 1587660240000, volume: 184 },
//       { close: 4964.19, high: 4964.74, low: 4961.42, open: 4961.64, timestamp: 1587660300000, volume: 191 },
//       { close: 4968.93, high: 4972.70, low: 4964.55, open: 4966.96, timestamp: 1587660360000, volume: 105 },
//       { close: 4979.31, high: 4979.61, low: 4973.99, open: 4977.06, timestamp: 1587660420000, volume: 35 },
//       { close: 4977.02, high: 4981.66, low: 4975.14, open: 4981.66, timestamp: 1587660480000, volume: 135 },
//       { close: 4985.09, high: 4988.62, low: 4980.30, open: 4986.72, timestamp: 1587660540000, volume: 76 }
//     ])
          
//     return () => {
//       dispose('chart')
//     }
//   }, [])

//   return <div id="chart" style={{ width: '100%', height: 600 }}/>
// }
