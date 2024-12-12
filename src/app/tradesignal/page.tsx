"use client";
import { use, useEffect, useState } from "react";
import LayoutContainer from "../components/LayoutContainer";
import axios from "axios";
axios.defaults.timeout = 50000;

// @ts-ignore
import config from "@/libs/config";
import { AutoComplete, AutoCompleteProps, DatePicker, Flex, FlexProps, Input, Table } from "antd";
import React from "react";
import dayjs from "dayjs";
import symbols from "./symbol"
// import { use, useEffect, useState } from "react";
const geturl = config.url;

const boxStyle: React.CSSProperties = {
  width: '100%',
  height: 40,
  borderRadius: 6,
  // border: '1px solid #40a9ff',
};

const justifyOptions = [
  'flex-start',
  'center',
  'flex-end',
  'space-between',
  'space-around',
  'space-evenly',
];
const alignOptions = ['flex-start', 'center', 'flex-end'];

const mockVal = (str: string, repeat = 1) => ({
  value: str.repeat(repeat),
});
const mockVal2 = (str: string, repeat = 1) =>{
  let ret:any = []
  for (let index = 0; index < symbols.length; index++) {
    const symbol = symbols[index];
    if(symbol[0].indexOf(str)!=-1||symbol[1].indexOf(str)!=-1){
      ret = [{value:symbol[0]+"-"+symbol[1]}]
      break
    }
    
  }

  console.log("[ret]",ret)
  return ret
}


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
    
    const getVal = async(stockcode:any)=>{
        const data = await getStockDataByCode("tradesignal", {
          stockcode:(stockcode|| "").trim(),
          date:""
      });
      console.log("[--data]", data);
      let results = data.data.data.results;
      results.map((item: any, index: number) => {
          item['交易日期'] = dayjs(new Date(item['交易日期'])).format('YYYY-MM-DD');
      })
      setDataSource(results)
    }

    useEffect(() => {
        const fn = async () => {
            console.log("[fn]");
            await getVal("");
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
    },[])
    const onPanelChange = (date: any, dateString: any) => {
        console.log(date, dateString);
    }
    const [justify, setJustify] = React.useState<FlexProps['justify']>(justifyOptions[0]);
    const [alignItems, setAlignItems] = React.useState<FlexProps['align']>(alignOptions[0]);
    const [value, setValue] = useState('');
    const [options, setOptions] = useState<AutoCompleteProps['options']>([]);
    const [anotherOptions, setAnotherOptions] = useState<AutoCompleteProps['options']>([]);
  
    const getPanelValue = (searchText: string) =>
      !searchText ? [] : mockVal2(searchText);
  
    const onSelect = async(data: string) => {
      console.log('onSelect', data);
      const datats = data.split("-")
       await getVal(datats[0])
    };
  
    const onChange = (data: string) => {
      setValue(data);
    };
    return (
        <LayoutContainer currentpathname="/tradesignal">
           <Flex gap="middle" align="start" vertical>
          <Flex style={boxStyle} justify={justify} align={alignItems}>
          <AutoComplete
            options={options}
            style={{ width: 200 }}
            onSelect={onSelect}
            onSearch={(text) => setOptions(getPanelValue(text))}
            placeholder="input here"
          />
            {/* <DatePicker onChange={onPanelChange} picker="month" /> */}
            </Flex>
            </Flex>
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



