"use client";
import React, { useCallback, useRef, useState } from "react";
//@ts-ignore
import { Input, Table, Alert } from "antd";
import axios from "axios";

const { Search,TextArea } = Input;
axios.defaults.withCredentials = true;
axios.defaults.timeout = 50000;
const Home = () => {
    const [dataSource, setDataSource] = useState(Array<any>());
    const [columns, setColumns] = useState(Array<any>());
    const [errormsg, setErrormsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [value, setValue] = useState("");
    const [sqlvalue, setSqlvalue] = useState("");
    const refSearck = useRef<any>(null);

    const clear = () => {
        setColumns([]);
        setDataSource([]);
        setErrormsg("");
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
    const handleSearch = async (message: any, event: any, op2: any) => {
        // console.log(id, event, op2, op3);

        setIsLoading(true);
        clear();
        event.preventDefault();
        // const message = event.target.value;
        console.log(event.target.value);

        let data = JSON.stringify({
            message: message, // "查询平安银行2022年9月1日股价"
        });
        const config = {
            headers: { "Content-Type": "application/json" },
        };

        try {
            const response = await axios.post(
                "/api/test",
                data,
                config // Include the config object as the third argument
            );

            console.log(response.data);
            const items = response.data;
            if (items.success==false) {
                setErrormsg(JSON.stringify(response.data, null, 4));
                setIsLoading(false);
                // setValue("");
                return;
            }
            let _sql = items.data[0].originalSql;
            setSqlvalue(_sql);
            let _dataSource: Array<any> = [];
            let _columns: Array<any> = [];
            //   for (let index = 0; index < items.length; index++) {
            //     const item = items[index];

            //     let newDatasource: any = {};
            //     if (index == 0) {
            //       for (let key in item) {
            //         let newColumn: any = {};
            //         newColumn["title"] = key;
            //         newColumn["dataIndex"] = key;
            //         newColumn["key"] = key;
            //         _columns.push(newColumn);
            //       }
            //     }
            //     for (let key in item) {
            //       // newColumn[key]= key
            //       newDatasource[key] = item[key];
            //     }

            //     newDatasource["key"] = index;
            //     _dataSource.push(newDatasource);
            //   }

            /**
             * executeResponse
             *
             *
             */
            const headerList = items.data[0].headerList;
            const dataList = items.data[0].dataList;

            for (let index = 0; index < headerList.length; index++) {
                let key = headerList[index].name;
                let newColumn: any = {};
                newColumn["title"] = key;
                newColumn["dataIndex"] = key;
                newColumn["key"] = key;
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

            console.log("_columns", _columns);
            console.log("_dataSource", _dataSource);
            setIsLoading(false);
            // setValue("");
            setColumns(_columns);
            setDataSource(_dataSource);
        } catch (error: any) {
            setIsLoading(false);
            // setValue("");
            setErrormsg(error.message);
            console.log(error);
        }
    };

    const handleSearchClick = useCallback(handleSearch, []);

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
                placeholder="请输入自然语言查询内容"
                enterButton
                loading={isLoading}
                onSearch={handleSearchClick}
                // value={value}
                // onChange={(e: any) => setValue(e.target.value)}
            />

            {/* <Input placeholder="Basic usage" onKeyPress={handleSearch} /> */}
            {columns.length? <div style={{ margin: "24px 0" }} ><TextArea rows={4} value={sqlvalue} /></div>: null}
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
