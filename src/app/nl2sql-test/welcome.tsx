"use client";
import React, { ReactNode, useCallback, useRef, useState } from "react";
//@ts-ignore
import { Input, Table, Alert, Steps, LoadingOutlined ,Spin} from "antd";

import axios from "axios";
import { format } from 'sql-formatter'
//@ts-ignore
import Highlight from 'react-highlight'
import 'highlight.js/styles/zenburn.css'

import { getDatabase, filterSql, getDatabaseList } from "@/libs/util";
const { Search, TextArea } = Input;
// axios.defaults.withCredentials = true;
axios.defaults.timeout = 50000;
const Home = () => {
    const [dataSource, setDataSource] = useState(Array<any>());
    const [columns, setColumns] = useState(Array<any>());
    const [errormsg, setErrormsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [value, setValue] = useState("");
    const [sqlvalue, setSqlvalue] = useState("");
    const refSearck = useRef<any>(null);
    const [current, setCurrent] = useState(0);
    const step0Tip = " 建立链接...";
    const step1Tip = " 获取数据库表结构...";
    const step2Tip = " 与AI建立链接...";
    const step3Tip = " 生成SQL语句...";
    const step4Tip = " 数据库查询...";

    const [step0value, setStep0value] = useState<ReactNode | string>(step0Tip);
    const [step1value, setStep1value] = useState<ReactNode | string>(step1Tip);
    const [step2value, setStep2value] = useState<ReactNode | string>(step2Tip);
    const [step3value, setStep3value] = useState<ReactNode | string>(step3Tip);
    const [step4value, setStep4value] = useState<ReactNode | string>(step4Tip);
    let timer:any = null
    const clear = () => {
        // setColumns([]);
        // setDataSource([]);
        // setErrormsg("");
        clearTimeout(timer)
        timer = null
        setStep0value(step0Tip)
        setStep1value(step1value)
        setStep2value(step2value)
        setStep3value(step3value)
        setStep4value(step4value)
    };

    const executeResponse: any = {
        success: true,
        errorCode: null,
        errorMessage: null,
        data: [
            {
                sql: null,
                originalSql:
                    "SELECT `stockcode` FROM `stockmarket`.`stock_basic_ash` WHERE `stockname` = '平安银行'",
                description: "Execution successful",
                message: null,
                success: true,
                updateCount: null,
                headerList: [
                    {
                        dataType: "CHAT2DB_ROW_NUMBER",
                        name: "Row Number",
                        primaryKey: null,
                        comment: null,
                        defaultValue: null,
                        autoIncrement: null,
                        nullable: null,
                        columnSize: null,
                        decimalDigits: null,
                    },
                    {
                        dataType: "STRING",
                        name: "stockcode",
                        primaryKey: null,
                        comment: null,
                        defaultValue: null,
                        autoIncrement: null,
                        nullable: null,
                        columnSize: null,
                        decimalDigits: null,
                    },
                ],
                dataList: [["1", "000001.SZ"]],
                sqlType: "SELECT",
                hasNextPage: false,
                pageNo: 1,
                pageSize: 200,
                fuzzyTotal: "1",
                duration: 80,
                canEdit: true,
                tableName: "`stockmarket`.`stock_basic_ash`",
                extra: null,
                dataAccess: false,
                scriptAccess: false,
                noPermissionDetail: null,
            },
        ],
        traceId: null,
        errorDetail: null,
        solutionLink: null,
    };
    const handleSearch = async (message: any, event?: any, op2?: any) => {
        // console.log(id, event, op2, op3);

        setIsLoading(true);
        clear();
        // event.preventDefault();
        // const message = event.target.value;
        // console.log(event.target.value);

        let data = {
            message: message, // "查询平安银行2022年9月1日股价"
            step: 0,
        };
        const config = {
            headers: {
                "Content-Type": "application/json",
                Connection: "keep-alive",
            },
        };
        const setp0 = async () => {
            data.step = 0;
            setStep0value(
                <>
                    <div><Spin  size="small" />{step0Tip}</div>
               
                </>
            );

            const response = await axios.post(
                "/rest2/steps",
                data,
                config // Include the config object as the third argument
            );
            const items = response.data;
            setCurrent(0);
            if (items.success == false) {
                setIsLoading(false);
                // setErrormsg(JSON.stringify(response.data, null, 4));
                // setIsLoading(false);
                // setValue("");
                setStep0value(
                    <>
                        <div>{step0Tip}</div>
                        <Alert
                            type="error"
                            message={JSON.stringify(response.data, null, 4)}
                            banner
                        />
                    </>
                );
                return;
            } else {
              
                setStep0value(
                    <>
                        <div>{step0Tip}</div>
                        <Alert
                            type="info"
                            message={"建立链接成功"}
                            banner
                        />
                    </>
                );
                setp1();
            }
        };

        const setp1 = async () => {
            data.step = 1;
            setCurrent(1);
            setStep1value(
                <>
                    <div><Spin  size="small" />{step1Tip}</div>
               
                </>
            );
            const response = await axios.post(
                "/rest2/steps",
                data,
                config // Include the config object as the third argument
            );
            const items = response.data;
            if (items.success == false) {
                setIsLoading(false);
                // setErrormsg(JSON.stringify(response.data, null, 4));
                // setIsLoading(false);
                // setValue("");
                setStep1value(
                    <>
                        <div>{step1Tip}</div>
                        <Alert
                            type="error"
                            message={JSON.stringify(response.data, null, 4)}
                            banner
                        />
                    </>
                );
                return;
            } else {
                const data2 = items.data;
                const ret2:any =[]
                data2.forEach((item: any) => {
                    ret2.push(item.databaseName+"."+item.tableName);
                })
                setStep1value(
                    <>
                        <div>{step1Tip}</div>
                        <Alert
                            type="info"
                            message={"获取数据库表结构成功"}
                            banner
                        />
                        {ret2.length?<> <div>将会从如下数据表中查询：</div>
                            <div>  <Highlight  language="javascript" style={{
                             display: "block",
                             borderRadius: "5px",
                             padding: '20px',
                             lineHeight: '18px'
                        }}>{JSON.stringify(ret2, null, 4)}</Highlight></div></>:null}
                          
                       
                       
                    </>
                );
             
                setp2();
            }
        };

        const setp2 = async () => {
            data.step = 2;
            setCurrent(2);
            setStep2value(
                <>
                    <div><Spin  size="small" />{step2Tip}</div>
               
                </>
            );
            const response = await axios.post(
                "/rest2/steps",
                data,
                config // Include the config object as the third argument
            );
            const items = response.data;
            if (items.success == false) {
                setIsLoading(false);
                // setErrormsg(JSON.stringify(response.data, null, 4));
                // setIsLoading(false);
                // setValue("");
                setStep2value(
                    <>
                        <div>{step2Tip}</div>
                        <Alert
                            type="error"
                            message={JSON.stringify(response.data, null, 4)}
                            banner
                        />
                    </>
                );
                return;
            } else {
          
                setStep2value(
                    <>
                        <div>{step2Tip}</div>
                       
                        <Alert
                            type="info"
                            message={"与AP建立成功"}
                            banner
                        />
                       
                    </>
                );
                setp3();
            }
        };

        const setp3 = async () => {
            data.step = 3;
            setCurrent(3);
            setStep3value(
                <>
                    <div><Spin  size="small" />{step3Tip}</div>
               
                </>
            );
            const response = await axios.post(
                "/rest2/steps",
                data,
                config // Include the config object as the third argument
            );
            const items = response.data;
            if (items.success == false) {
                setIsLoading(false);
                // setErrormsg(JSON.stringify(response.data, null, 4));
                // setIsLoading(false);
                // setValue("");
                setStep3value(
                    <>
                        <div>{step3Tip}</div>
                        <Alert
                            type="error"
                            message={JSON.stringify(response.data, null, 4)}
                            banner
                        />
                    </>
                );
                return;
            } else {
             

                let sql = filterSql(items);
                setStep3value(
                    <>
                        <div>{step3Tip}</div>
                        <Alert
                            type="info"
                            message={"生成SQL语句成功"}
                            banner
                        />
                        <div>生成SQL语句如下：</div>
                        {/* <div>{sql}</div> */}
                        <div>
                        <Highlight style={{
                             display: "block",
                             borderRadius: "5px",
                             padding: '20px',
                             lineHeight: '18px'
                        }}>{format(sql)}</Highlight>
                        </div>
                       
                    </>
                );
                setp4();
            }
        };

        const setp4 = async () => {
            data.step = 4;
            setCurrent(4);
            setStep4value(
                <>
                    <div><Spin  size="small" />{step4Tip}</div>
               
                </>
            );
            const response = await axios.post(
                "/rest2/steps",
                data,
                config // Include the config object as the third argument
            );
            const items = response.data;
            if (items.success == false) {
                setIsLoading(false);
                // setErrormsg(JSON.stringify(response.data, null, 4));
                // setIsLoading(false);
                // setValue("");
                setStep4value(
                    <>
                        <div>{step4Tip}</div>
                        <Alert
                            type="error"
                            message={JSON.stringify(response.data, null, 4)}
                            banner
                        />
                    </>
                );
                return;
            } else {
                setIsLoading(false);
                // let _sql = items.data[0].originalSql;
                // setSqlvalue(_sql);
                let _dataSource: Array<any> = [];
                let _columns: Array<any> = [];
                const headerList = items.data[0].headerList||[];
                const dataList = items.data[0].dataList||[];

                for (let index = 0; index < headerList.length; index++) {
                    let key = headerList[index].name;
                    let newColumn: any = {};
                    newColumn["title"] = key;
                    newColumn["dataIndex"] = key;
                    newColumn["key"] = key;
                    if(headerList.length>3){
                        if(index==0){
                            newColumn["width"] = 120;
                        }else{
                            newColumn["width"] = 150;
                        }
                      
                        if(index<=2){
                            newColumn["fixed"] = 'left';
                        }
                    }
                   
                  

                  
                    _columns.push(newColumn);
                }
              
                for (let index = 0; index < dataList.length; index++) {
                    let items = dataList[index];
                    let _keys: any = { key: index };
                    items.forEach((item: any, no: any) => {
                        let key: any = headerList[no].name;
                        _keys[key] = item;
                    });

                    // key.key = index
                    _dataSource.push(_keys);
                }
                // setColumns(_columns);
                // setDataSource(_dataSource);
                setStep4value(
                    <>
                        <div>{step4Tip}</div>
                        <Alert
                            type="info"
                            message={"查询成功"}
                            banner
                        />
                        <div>数据如下：</div>
                        <Table dataSource={_dataSource} columns={_columns} scroll={(headerList.length>3?{ x: 1500, y: 300 }:{})}/>
                    </>
                );
            }
        };

        try {
            setp0();
            // const response = await axios.post(
            //     "/api/test",
            //     data,
            //     config // Include the config object as the third argument
            // );

            // console.log(response.data);
            // const items = response.data;
            // if (items.success == false) {
            //     setErrormsg(JSON.stringify(response.data, null, 4));
            //     setIsLoading(false);
            //     // setValue("");
            //     return;
            // }
            // let _sql = items.data[0].originalSql;
            // setSqlvalue(_sql);
            // let _dataSource: Array<any> = [];
            // let _columns: Array<any> = [];
            // //   for (let index = 0; index < items.length; index++) {
            // //     const item = items[index];

            // //     let newDatasource: any = {};
            // //     if (index == 0) {
            // //       for (let key in item) {
            // //         let newColumn: any = {};
            // //         newColumn["title"] = key;
            // //         newColumn["dataIndex"] = key;
            // //         newColumn["key"] = key;
            // //         _columns.push(newColumn);
            // //       }
            // //     }
            // //     for (let key in item) {
            // //       // newColumn[key]= key
            // //       newDatasource[key] = item[key];
            // //     }

            // //     newDatasource["key"] = index;
            // //     _dataSource.push(newDatasource);
            // //   }

            // /**
            //  * executeResponse
            //  *
            //  *
            //  */
            // const headerList = items.data[0].headerList;
            // const dataList = items.data[0].dataList;

            // for (let index = 0; index < headerList.length; index++) {
            //     let key = headerList[index].name;
            //     let newColumn: any = {};
            //     newColumn["title"] = key;
            //     newColumn["dataIndex"] = key;
            //     newColumn["key"] = key;
            //     _columns.push(newColumn);
            // }
            // for (let index = 0; index < dataList.length; index++) {
            //     let items = dataList[index];
            //     let _keys: any = { key: index };
            //     items.forEach((item: any, no: any) => {
            //         let key: any = headerList[no].name;
            //         _keys[key] = item;
            //     });

            //     // key.key = index
            //     _dataSource.push(_keys);
            // }

            // console.log("_columns", _columns);
            // console.log("_dataSource", _dataSource);
            // setIsLoading(false);
            // // setValue("");
            // setColumns(_columns);
            // setDataSource(_dataSource);
        } catch (error: any) {
            // setIsLoading(false);
            // // setValue("");
            // setErrormsg(error.message);
            console.log(error);
        }
    };

 
    const searchChange = ( event: any,) => {
        console.log( event.target.value,);
        const val = event.target.value;
        clearTimeout(timer)
        timer = null
        timer = setTimeout(() => {
            handleSearch(val)
        },2000)
    };
    const handleSearchClick = useCallback(handleSearch, []);
    const handleSearchChange = useCallback(searchChange, []);
    // useCallback(()=>{
    //     setIsLoading(true)
    //     setTimeout(()=>{
    //         setIsLoading(false)
    //     },3000)
    // }, []);

    // const dataSource = [
    //     {
    //         key: "1",
    //         name: "胡彦斌",
    //         age: 32,
    //         address: "西湖区湖底公园1号",
    //     },
    //     {
    //         key: "2",
    //         name: "胡彦祖",
    //         age: 42,
    //         address: "西湖区湖底公园1号",
    //     },
    // ];

    // const columns = [
    //     {
    //         title: "姓名",
    //         dataIndex: "name",
    //         key: "name",
    //     },
    //     {
    //         title: "年龄",
    //         dataIndex: "age",
    //         key: "age",
    //     },
    //     {
    //         title: "住址",
    //         dataIndex: "address",
    //         key: "address",
    //     },
    // ];

    return (
        <div className="App">
            <Search
                placeholder="请输入要查询的自然语言，如：查询平安银行的股票代码"
                enterButton
                loading={isLoading}
                onSearch={handleSearchClick}
                // value={value}
                onChange={handleSearchChange}
            />
            <Steps
                progressDot
                current={current}
                direction="vertical"
                items={[
                    {
                        title: "Step 0",
                        description: <div>{step0value}</div>,
                    },
                    {
                        title: "Step 1",
                        description: <div>{step1value}</div>,
                    },
                    {
                        title: "Step 2",
                        description: <div>{step2value}</div>,
                    },
                    {
                        title: "Step 3",
                        description: <div>{step3value}</div>,
                    },
                    {
                        title: "Step 4",
                        description: <div>{step4value}</div>,
                    },
                ]}
            />
            {/* <Input placeholder="Basic usage" onKeyPress={handleSearch} /> */}
            {columns.length ? (
                <div style={{ margin: "24px 0" }}>
                    <TextArea rows={4} value={sqlvalue} />
                </div>
            ) : null}
            <div style={{ margin: "24px 0" }} />
            {errormsg ? (
                <Alert type="error" message={errormsg} banner />
            ) : columns.length ? (
                <Table dataSource={dataSource} columns={columns} />
            ) : null}

            {/* <Table dataSource={dataSource} columns={columns} />; */}
        </div>
    );
};

export default Home;