"use client";
import { use, useEffect, useState } from "react";
import LayoutContainer from "../components/LayoutContainer";
import axios from "axios";
axios.defaults.timeout = 50000;

// @ts-ignore
import config from "@/libs/config";
import { DatePicker, Input, Table } from "antd";
// import { use, useEffect, useState } from "react";
const geturl = config.url;


const APP = () => {
    // const dataSource:any = [
       
    //   ];
      const [dataSource, setDataSource] = useState([]);
      
      let columns = [
        {
          title: '交易信号名称',
          dataIndex: '交易信号名称',
          key: '交易信号名称',
        },
        {
            title: '交易日期',
            dataIndex: '交易日期',
            key: '交易日期',
          },
          {
            title: '周期累积收益',
            dataIndex: '周期累积收益',
            key: '周期累积收益',
          },
          {
            title: '周期累积收益率',
            dataIndex: '周期累积收益率',
            key: '周期累积收益率',
          },
          {
            title: '周期累积涨幅',
            dataIndex: '周期累积涨幅',
            key: '周期累积涨幅',
          },
          {
            title: '当日收益',
            dataIndex: '当日收益',
            key: '当日收益',
          },
          {
            title: '当日收益率',
            dataIndex: '当日收益率',
            key: '当日收益率',
          },
          {
            title: '当日收盘价',
            dataIndex: '当日收盘价',
            key: '当日收盘价',
          },
          {
            title: '当日涨幅',
            dataIndex: '当日涨幅',
            key: '当日涨幅',
          },
          {
            title: '当日涨跌额',
            dataIndex: '当日涨跌额',
            key: '当日涨跌额',
          },
          {
            title: '当日自由流通股换手率',
            dataIndex: '当日自由流通股换手率',
            key: '当日自由流通股换手率',
          },
          {
            title: '溢价率%',
            dataIndex: '溢价率%',
            key: '溢价率%',
          },
          {
            title: '累积自由流通股换手率',
            dataIndex: '累积自由流通股换手率',
            key: '累积自由流通股换手率',
          },
          {
            title: '股票代码',
            dataIndex: '股票代码',
            key: '股票代码',
          },
          {
            title: '股票名称(中文)',
            dataIndex: '股票名称(中文)',
            key: '股票名称(中文)',
          },
          {
            title: '风险指数',
            dataIndex: '风险指数',
            key: '风险指数',
          },
       
      ];
      columns = columns.map((item) => {
        return {
          ...item,
          minWidth:"200px"
        };
      });
      console.log("[columns]",columns)

    useEffect(() => {
        const fn = async () => {
            console.log("[fn]");

            // slug = (await params).slug;
            // setCurrentpathname('/indexs/'+slug)
            const data = await getStockDataByCode("tradesignal", {
                stockcode: "",
                date:""
            });
            console.log("[--data]", data);
            setDataSource(data.data.data.results)
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
    },[])
    const onPanelChange = (date: any, dateString: any) => {
        console.log(date, dateString);
    }
    return (
        <LayoutContainer currentpathname="/tradesignal">
            <Input type="text" />
            <DatePicker onChange={onPanelChange} picker="month" />
            <Table dataSource={dataSource} columns={columns} />;
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



