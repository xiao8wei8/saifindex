"use client";
import React, { useEffect, useState } from "react";
import { Button, Input, Table } from "antd";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
axios.defaults.withCredentials = true;
axios.defaults.timeout = 50000;
const Home = () => {
    const handleSearch = async () => {
    
        

    let data = JSON.stringify({
        "input": "查询平安银行2022年9月1日股价",
        "tableSize": "10",
        "dataSourceCollectionId": 2839
      });
      const config = {
        headers: {'Content-Type': 'application/json' },
        
      };
    
      try {
        const response = await axios.post(
         '/api/mapping_a',
         data,
          config // Include the config object as the third argument
        );
    
        console.log(response.data);
   
      } catch (error:any) {
      
        console.log(error);
      }
         
    };
    useEffect(() => {
        handleSearch();
    }, []);

    const [value, setValue] = useState("");
    const dataSource = [
        {
            key: "1",
            name: "胡彦斌",
            age: 32,
            address: "西湖区湖底公园1号",
        },
        {
            key: "2",
            name: "胡彦祖",
            age: 42,
            address: "西湖区湖底公园1号",
        },
    ];

    const columns = [
        {
            title: "姓名",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "年龄",
            dataIndex: "age",
            key: "age",
        },
        {
            title: "住址",
            dataIndex: "address",
            key: "address",
        },
    ];
    return (
        <div className="App">
            <Input placeholder="Basic usage" />
            <div style={{ margin: "24px 0" }} />
            <TextArea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Controlled autosize"
                autoSize={{ minRows: 3, maxRows: 5 }}
            />
            <div style={{ margin: "24px 0" }} />
            <Table dataSource={dataSource} columns={columns} />;
        </div>
    );
};

export default Home;
