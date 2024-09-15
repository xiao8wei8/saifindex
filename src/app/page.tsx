"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
//@ts-ignore
import { Button, Input, Table, Alert } from "antd";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";

const { Search } = Input;
axios.defaults.withCredentials = true;
axios.defaults.timeout = 50000;
const Home = () => {
  const [dataSource, setDataSource] = useState(Array<any>());
  const [columns, setColumns] = useState(Array<any>());
  const [errormsg, setErrormsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState("");
  

  const refSearck = useRef<any>(null);

  const clear = () => {
    setColumns([]);
    setDataSource([]);
    setErrormsg("");
  };
  const handleSearch = async (id: any, event: any, op2: any, op3: any) => {
    console.log(id, event, op2, op3);

    setIsLoading(true);
    clear();
    event.preventDefault();
    const input = event.target.value;
    console.log(event.target.value);

    let data = JSON.stringify({
      input: input, // "查询平安银行2022年9月1日股价"
    });
    const config = {
      headers: { "Content-Type": "application/json" },
    };

    try {
      const response = await axios.post(
        "/api/mapping_a",
        data,
        config // Include the config object as the third argument
      );

      console.log(response.data);
      const items = response.data;
      if (!items.length) {
        setErrormsg(JSON.stringify(response.data,null,4));
        setIsLoading(false);
        setValue("");
        return;
      }
      let _dataSource: Array<any> = [];
      let _columns: Array<any> = [];
      for (let index = 0; index < items.length; index++) {
        const item = items[index];

        let newDatasource: any = {};
        if (index == 0) {
          for (let key in item) {
            let newColumn: any = {};
            newColumn["title"] = key;
            newColumn["dataIndex"] = key;
            newColumn["key"] = key;
            _columns.push(newColumn);
          }
        }
        for (let key in item) {
          // newColumn[key]= key
          newDatasource[key] = item[key];
        }

        newDatasource["key"] = index;
        _dataSource.push(newDatasource);
      }
      console.log("_columns", _columns);
      console.log("_dataSource", _dataSource);
      setIsLoading(false);
      setValue("");
      setColumns(_columns);
      setDataSource(_dataSource);
    } catch (error: any) {
      setIsLoading(false);
      setValue("");
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
        placeholder="input search loading with enterButton"
        enterButton
        loading={isLoading}
        onSearch={handleSearchClick}
        value={value}
        onChange={(e:any) => setValue(e.target.value)}
      />

      {/* <Input placeholder="Basic usage" onKeyPress={handleSearch} /> */}
      <div style={{ margin: "24px 0" }} />
      {errormsg ? (
        <Alert type="error" message={errormsg} banner />
      ) : dataSource.length ? (
        <Table dataSource={dataSource} columns={columns} />
      ) : null}

      {/* <Table dataSource={dataSource} columns={columns} />; */}
    </div>
  );
};

export default Home;
