"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
//@ts-ignore
import { Input, Table, Alert } from "antd";
import axios from "axios";

const { Search, TextArea } = Input;
axios.defaults.withCredentials = true;
axios.defaults.timeout = 50000;

import io from "socket.io-client";
const socket = io("http://localhost:3000");

const App = () => {
    let socketid: any = "";
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        // client-side
        socket.on("connect", () => {
            console.log(socket.id); // x8WIv7-mJelg7on_ALbx
            socketid = socket.id;
        });

        socket.on("disconnect", () => {
            console.log(socket.id); // undefined
        });
        socket.on("message2", (data) => {
            console.log("Recieved from SERVER ::", data);
            // Execute any command
        });
    }, [socket]);

    const handleSearch = async (message: any, event: any, op2: any) => {
        // console.log(id, event, op2, op3);

        // setIsLoading(true);
        // clear();
        // event.preventDefault();
        // // const message = event.target.value;
        // console.log(event.target.value);

        let data = JSON.stringify({
            message: message, // "查询平安银行2022年9月1日股价"
            socketid: socketid,
        });
        const config = {
            headers: { "Content-Type": "application/json" },
        };

        try {
            const response = await axios.post(
                "/api/socket",
                data,
                config // Include the config object as the third argument
            );

            console.log(response.data);
            // const items = response.data;
            // if (items.success==false) {
            //     // setErrormsg(JSON.stringify(response.data, null, 4));
            //     setIsLoading(false);
            //     // setValue("");
            //     return;
            // }
            // let _sql = items.data[0].originalSql;
            // // setSqlvalue(_sql);
            // let _dataSource: Array<any> = [];
            // let _columns: Array<any> = [];
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
            // setValue("");
            // setColumns(_columns);
            // setDataSource(_dataSource);
        } catch (error: any) {
            // setIsLoading(false);
            // // setValue("");
            // setErrormsg(error.message);
            console.log(error);
        }
    };

    const handleSearchClick = useCallback(handleSearch, []);

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
        </div>
    );
};

export default App;
