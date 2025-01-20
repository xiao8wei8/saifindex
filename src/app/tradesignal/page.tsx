"use client";
import { use, useEffect, useState } from "react";
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
    Table,
} from "antd";
import React from "react";
import dayjs from "dayjs";
import symbols from "./symbol";
import { createStyles } from "antd-style";
import { set } from "react-hook-form";
import { text } from "stream/consumers";
import { CloseOutlined } from "@ant-design/icons";
// import { use, useEffect, useState } from "react";

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
            ret = [{ value: symbol[0].trim()     + "-" + symbol[1].trim() }];
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
        },
        {
            title: "股票名称(中文)",
            dataIndex: "股票名称(中文)",
            key: "股票名称(中文)",
            width: getWidth("股票名称(中文)"),
            fixed: "left",
        },
        {
            title: "交易信号名称",
            dataIndex: "交易信号名称",
            key: "交易信号名称",
            width: getWidth("交易信号名称"),
        },
        {
            title: "当日收盘价",
            dataIndex: "当日收盘价",
            key: "当日收盘价",
            width: getWidth("当日收盘价"),
        },
        {
            title: "所在城市",
            dataIndex: "所在城市",
            key: "所在城市",
            width: getWidth("所在城市"),
        },

        {
            title: "所属行业",
            dataIndex: "所属行业",
            key: "所属行业",
            width: getWidth("所属行业"),
        },
        {
            title: "当日涨跌幅",
            dataIndex: "当日涨跌幅",
            key: "当日涨跌幅",
            width: getWidth("当日涨跌幅"),
        },

        {
            title: "总市值 （亿）",
            dataIndex: "总市值 （亿）",
            key: "总市值 （亿）",
            width: getWidth("总市值 （亿）"),
        },

        {
            title: "流通市值（亿）",
            dataIndex: "流通市值（亿）",
            key: "流通市值（亿）",
            width: getWidth("流通市值（亿）"),
        },

        {
            title: "非流通市值（亿）",
            dataIndex: "非流通市值（亿）",
            key: "非流通市值（亿）",
            width: getWidth("非流通市值（亿）"),
        },

        {
            title: "涨幅次数",
            dataIndex: "涨幅次数",
            key: "涨幅次数",
            width: getWidth("涨幅次数"),
        },
        {
            title: "跌幅次数",
            dataIndex: "跌幅次数",
            key: "跌幅次数",
            width: getWidth("跌幅次数"),
        },
    ];
    const [dataSource, setDataSource] = useState([]);
    const [dataSource_dashboard, setDataSourceDashboard] = useState([]);
    const [columns_dashboard, setColumnsDashboard] = useState(
        columns_dashboard_default
    );

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

    let columns = [
        {
            title: "交易日期",
            dataIndex: "交易日期",
            key: "交易日期",
            width: getWidth("交易日期", 20),
        },
        {
            title: "股票代码",
            dataIndex: "股票代码",
            key: "股票代码",
            width: getWidth("股票代码"),
        },
        {
            title: "股票名称(中文)",
            dataIndex: "股票名称(中文)",
            key: "股票名称(中文)",
            width: getWidth("股票名称(中文)"),
        },
        {
            title: "交易信号名称",
            dataIndex: "交易信号名称",
            key: "交易信号名称",
            width: getWidth("交易信号名称"),
        },
        {
            title: "当日收盘价",
            dataIndex: "当日收盘价",
            key: "当日收盘价",
            width: getWidth("当日收盘价"),
        },
        {
            title: "当日收益",
            dataIndex: "当日收益",
            key: "当日收益",
            width: getWidth("当日收益"),
        },

        {
            title: "周期累积收益",
            dataIndex: "周期累积收益",
            key: "周期累积收益",
            width: getWidth("周期累积收益"),
        },
        {
            title: "当日收益率",
            dataIndex: "当日收益率",
            key: "当日收益率",
            width: getWidth("当日收益率"),
        },

        {
            title: "周期累积收益率",
            dataIndex: "周期累积收益率",
            key: "周期累积收益率",
            width: getWidth("周期累积收益率"),
        },

        {
            title: "周期累积涨幅",
            dataIndex: "周期累积涨幅",
            key: "周期累积涨幅",
            width: getWidth("周期累积涨幅"),
        },

        {
            title: "溢价率%",
            dataIndex: "溢价率%",
            key: "溢价率%",
            width: getWidth("溢价率%"),
        },

        {
            title: "风险指数%",
            dataIndex: "风险指数%",
            key: "风险指数%",
            width: getWidth("风险指数%"),
        },
        {
            title: "累积自由流通股换手率",
            dataIndex: "累积自由流通股换手率",
            key: "累积自由流通股换手率",
            width: getWidth("累积自由流通股换手率"),
        },

        // {
        //     title: "当日涨幅",
        //     dataIndex: "当日涨幅",
        //     key: "当日涨幅",
        // },
        // {
        //     title: "当日涨跌额",
        //     dataIndex: "当日涨跌额",
        //     key: "当日涨跌额",
        // },
        {
            title: "当日自由流通股换手率",
            dataIndex: "当日自由流通股换手率",
            key: "当日自由流通股换手率",
            width: getWidth("当日自由流通股换手率"),
        },
    ];

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

    const getValDashboard = async (stockcode: any) => {
        const data = await getStockDataByCode("tradesignaldashboard", {
            stockcode: (stockcode || "").trim(),
            date: "",
        });
        console.log("[--data]", data);
        let results = data.data.data.results;
        let new_results: any = [];
        results.map((item: any, index: number) => {
            item["交易日期"] = dayjs(new Date(item["交易日期"])).format(
                "YYYY-MM-DD"
            );
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
            new_results.push(flag[key]);
        }
        console.log("[flag]", flag);
        console.log("[results]", results);
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
        setColumnsDashboard(
            columns_dashboard_default.concat(columns_dashboard_add)
        );
        new_results = new_results.sort((a: any, b: any) => parseInt(a["股票代码"]) - parseInt(b["股票代码"]));
        setDataSourceDashboard(new_results);
        // let _series: any[] = [];
        // let _xAxis: any = [];
        // let _name = "";
        // results.map((item: any, index: number) => {
        //     item["交易日期"] = dayjs(new Date(item["交易日期"])).format(
        //         "YYYY-MM-DD"
        //     );

        // });
        // xAxis
        handleLoadingChange(false);
    };
    const getVal = async (stockcode: any) => {
        const data = await getStockDataByCode("tradesignal", {
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
        let _series: any[] = [];
        let _xAxis: any = [];
        let _name = "";
        results.map((item: any, index: number) => {
            item["交易日期"] = dayjs(new Date(item["交易日期"])).format(
                "YYYY-MM-DD"
            );

            if (!_name) _name = item["股票名称(中文)"];

            if (item["交易信号名称"] == "sell") {
                _series.push({
                    y: item["当日收盘价"] * 1,
                    marker: {
                        symbol: "url(/die.jpg)",
                    },
                });
            } else if (item["交易信号名称"] == "buy") {
                _series.push({
                    y: item["当日收盘价"] * 1,
                    marker: {
                        symbol: "url(/zhang.jpg)",
                    },
                });
            } else {
                _series.push(item["当日收盘价"] * 1);
            }

            _xAxis.push(item["交易日期"]);
        });
        console.log("[_xAxis]", _xAxis);

        const _reversed_xAxis = _xAxis.reverse();
        const _reversed_series = _series.reverse();

        setXAxis({
            categories: _reversed_xAxis,
        });
        console.log("[_series]", _reversed_series);
        setCurrentLineSeries([
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
        ]);
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
    };
    const [justify, setJustify] = React.useState<FlexProps["justify"]>(
        justifyOptions[0]
    );
    const [alignItems, setAlignItems] = React.useState<FlexProps["align"]>(
        alignOptions[0]
    );
    const [value, setValue] = useState("");
    const defaultValue =  [{ value: "all-all", label: "all-all" }];
    const [options, setOptions] = useState<AutoCompleteProps["options"]>(defaultValue);
    const [anotherOptions, setAnotherOptions] = useState<
        AutoCompleteProps["options"]
    >([]);

    const getPanelValue = (searchText: string) =>{
        let ret1 =  !searchText ? [] : mockVal2(searchText);
        let ret = defaultValue.concat(ret1);
        return ret
    }
        

    const onSelect = async (data: string) => {
        console.log("onSelect", data);
        const datats = data.split("-");
        if (datats[0] == "all") datats[0] = "";
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
    const { styles } = useStyle();
    return (
        <LayoutContainer currentpathname="/tradesignal">
            {!isShowStock ? (
                <div>
                  
                    <Flex gap="middle" align="start" vertical>
                        <Flex
                            style={boxStyle}
                            justify={justify}
                            align={alignItems}
                        >
                            <AutoComplete
                                options={options}
                                style={{ width: 200 }}
                                onSelect={onSelect}
                                onSearch={(text) =>
                                    setOptions(getPanelValue(text))
                                }
                                placeholder="输入股票代码或者名称"
                                onClear={() => {
                                    console.log("onMouseEnter");
                                }}
                            />
                            {/* <DatePicker onChange={onPanelChange} picker="month" /> */}
                        </Flex>
                    </Flex>
                    <Table
                        loading={loading}
                        className={styles.customTable}
                        dataSource={dataSource_dashboard}
                        columns={columns_dashboard}
                        bordered
                        // pagination={{ pageSize: 20 }}
                        // scroll={columns.length > 3 ? { x: 1500 } : {}}
                        // pagination={{ pageSize: 50 }}
                        pagination={{  defaultPageSize:50,
                            defaultCurrent:1,total:dataSource_dashboard.length }}
                        scroll={{ y: 55 * 7 }}
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
            ) : (
                <div>
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
                        pagination={{  defaultPageSize:50,
                        defaultCurrent:1,total:dataSource.length }}
                        // scroll={columns.length > 3 ? { x: 1500 } : {}}
                        // pagination={{ pageSize: 50 }}

                        // defaultCurrent={50} total={500}

                        scroll={{ y: 55 * 7 }}
                    />

                    <div>
                        <HighchartsReact
                            highcharts={Highcharts}
                            options={{
                                title: {
                                    text: "交易信号",
                                },
                                yAxis: {
                                    title: {
                                        text: "收盘价",
                                    },
                                },
                                xAxis: xAxis,
                                series: currentLineSeries,
                                chart: {
                                    type: "line",
                                    events: { load: () => {} },
                                },
                            }}
                            // constructorType={"bar"}
                        />
                    </div>
                </div>
            )}
        </LayoutContainer>
    );
};

const getStockDataByCode = async (type: string, params: Object) => {
    // case "stock": //获取股票
    // const symbol = params.indexcode;
    //     sql = get_stock(symbol);

    const urlStr =
        geturl + "?type=" + type + "&params=" + JSON.stringify(params);
    console.log("[urlStr]", urlStr);
    const res = await fetch(urlStr);
    const json = await res.json();
    return { data: json };
};

export default APP;
