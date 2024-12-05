"use client";

import {
    Col,
    Input,
    List,
    Row,
    Space,
    Tabs,
    Typography,
    DatePicker,
    Select,
    Card,
    Slider,
    AutoComplete,
    AutoCompleteProps,
    Spin,
    Skeleton,
    Divider,
} from "antd";
import { useContext, useEffect, useReducer, useRef, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
const { RangePicker } = DatePicker;
type TargetKey = React.MouseEvent | React.KeyboardEvent | string;
import { DragBox } from "./DragBox";
import { DropBox } from "./DropBox";
import Chart from "@/components/Chart";
import React from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import InfiniteScroll from "react-infinite-scroll-component";
// @ts-ignore
import styles from "./index.module.less";
// import LayoutContainer from "../components/LayoutContainer";
import { SearchOutlined } from "@ant-design/icons";
import  Dayjs  from 'dayjs';

const mockVal = (str: string, repeat = 1) => ({
    value: str.repeat(repeat),
});

let init_cards = [
    {
        id: 1,
        order: 0,
        name: "中国",
    },
    {
        id: 2,
        order: 1,
        name: "美国",
    },
    {
        id: 3,
        order: 2,
        name: "日本",
    },
    {
        id: 4,
        order: 3,
        name: "德国",
    },
    {
        id: 5,
        order: 4,
        name: "英国",
    },
];
let init_drop_cards = [
    {
        id: 1,
        order: 0,
        name: "折线图",
    },
    {
        id: 2,
        order: 1,
        name: "美国",
    },
    {
        id: 3,
        order: 2,
        name: "日本",
    },
    {
        id: 4,
        order: 3,
        name: "德国",
    },
    {
        id: 5,
        order: 4,
        name: "英国",
    },
];
const init_state = {
    cards: init_cards,
    selectedCards: [],
    lastSelectedIndex: -1,
    dragIndex: -1,
    hoverIndex: -1,
    insertIndex: -1,
    isDragging: false,
};
const cardReducer = (state: any, action: any) => {
    console.log("------------------", action.type);
    switch (action.type) {
        case "CLEAR_SELECTION":
            return {
                ...state,
                selectedCards: init_state.selectedCards,
                lastSelectedIndex: init_state.lastSelectedIndex,
            };
        case "UPDATE_SELECTION":
            return {
                ...state,
                selectedCards: action.newSelectedCards,
                lastSelectedIndex: action.newLastSelectedIndex,
            };
        // case "REARRANGE_CARDS":
        //   return { ...state, cards: action.newCards };
        // case "SET_INSERTINDEX":
        //   return {
        //     ...state,
        //     dragIndex: action.dragIndex,
        //     hoverIndex: action.hoverIndex,
        //     insertIndex: action.insertIndex
        //   };
        default:
            throw new Error();
    }
};
let countrys: any[] = []
// let stype = 'line'
let dates: any[] = ['2000','2023']
let crurrentChatType = 'line'
const App = ({ countryname }: any) => {
    let _countryname: any = [];
    // {
    //     id: 5,
    //     order: 4,
    //     name: "英国",
    // },
    countryname.map((item: any, index: any) => {
        _countryname.push({
            id: index,
            order: index,
            name: item.countryname_cn,
        });
    });
    init_state.cards = _countryname;
    const [state, dispatch] = useReducer(cardReducer, init_state);
    // const [dates,setDates] = useState<any>([]);
    // const [countrys, setCountrys] = useState<any>([]);
    // const [stype, setStype] = useState('line');

    

    // useEffect(() => {
    //     console.log("[dates,countrys]")
    // },[dates,countrys])
 
    const getSeries = async(ops:any) => {
        // var ret = [];
        // for (let index = 0; index < lineSeries.length; index++) {
        //     const element = lineSeries[index];
        //     if (keys.includes(element.name)) {
        //         ret.push(element);
        //     }
        // }
        // return ret;

        let data = await getSeriesByCountry(ops)
        console.log("[getSeries]", data)
        const results = data?.data?.data?.results;


    // {
    //     name: "中国",
    //     data: [
    //         43934, 48656, 65165, 81827, 112143, 142383, 171533, 165174,
    //         155157, 161454, 154610, 168960,
    //     ],
    // },
        let ret = []
        let maps:any = {}
      
        let slugs = slug.split(".")
        let total=slugs[1].replace("df_global","")//'total_gov_debt' 
        results.map((item: any, index: number) => {
            const itemt = item;
            const countryname_cn = item.countryname_cn;

            const total_gov_debt = parseFloat(item[total]||0);
            if(maps[countryname_cn]){
                maps[countryname_cn].push(total_gov_debt)
            }else{
                maps[countryname_cn] = [total_gov_debt]
            }

        })

        for(let key in maps){
            const data = maps[key]
            ret.push({
                name: key,
                data,
            })
        }
        console.log("[getSeries]", ret)
        return ret||[]

    };

    const lineSeries = [
        {
            name: "中国",
            data: [
                43934, 48656, 65165, 81827, 112143, 142383, 171533, 165174,
                155157, 161454, 154610, 168960,
            ],
        },
        {
            name: "美国",
            data: [
                24916, 37941, 29742, 29851, 32490, 30282, 38121, 36885, 33726,
                34243, 31050, 33099, 33473,
            ],
        },
        {
            name: "日本",
            data: [
                11744, 30000, 16005, 19771, 20185, 24377, 32147, 30912, 29243,
                29213, 25663, 28978, 30618,
            ],
        },
        {
            name: "德国",
            data: [
                11744, 30000, 16005, 19771, 20185, 24377, 32147, 30912, 11164,
                11218, 10077, 12530, 16585,
            ],
        },
        {
            name: "英国",
            data: [
                21908, 5548, 8105, 11248, 8989, 11816, 18274, 17300, 13053,
                11906, 10073, 11471, 11648,
            ],
        },
    ];
    const [currentLineSeries, setCurrentLineSeries] = useState([] as any);
    // const [crurrentChatType, setCrurrentChatType] = useState("line");
    useEffect(() => {

        // const fn = async () => {
        //     console.log("[fn]");
        //     // slug = (await params).slug;
        //     // const data = await getInitialProps("weight", {
        //     //     indexcode: slug,
        //     // });
        //     // console.log("[data]", data);
        //     // let results = data.data.data.results;
        //     // results.map((item: any, index: number) => {
        //     //     item.colorValue = 300 + index;
        //     //     item.value = parseFloat(item.value);
        //     //     item.name =
        //     //         item.name + "</br>" + item.id + "</br>" + item.value;
        //     // });
        //     // console.log("[results]", results);
        //     // setWeighValue(results);

        //     const _series: any[] =await getSeries({
        //         date:[],
        //         country:[]
        //     });
        //     console.log("[_series]", _series);
        //     // return
        //     handleItemSelection(0, false, false);
        //     setCurrentLineSeries(_series);
        // };
        // fn();
        updateSeries();
        handleItemSelection(0, false, false);

       
        console.log("[currentLineSeries]", currentLineSeries);
    }, []);

    const clearItemSelection = () => {
        console.log("[clearItemSelection]");
        dispatch({ type: "CLEAR_SELECTION" });
    };
    const end = (
        _selectedCards: any[],
        dropResult: { name: any; type: any }
    ) => {
        console.log("[end]");

        console.log("[dragBox]end", dropResult);
        let ret: any[] = [];
        _selectedCards.forEach((item: any) => {
            ret.push(item.name);
        });
        countrys = ret;
        // ret.push("in");
        // ret.push(dropResult.name);
        // alert(JSON.stringify(ret));
        // const _series:any[] = myRandom([...lineSeries],_selectedCards.length)'
        
        // setCrurrentChatType(stype);
        crurrentChatType = dropResult.type
        updateSeries();
    };
    const updateSeries = async() => {
        console.log("[updateSeries]",dates);
        let _dates:any = []
        dates.forEach((item: any) => {
            _dates.push(parseInt(item))
        })
        const _series: any = await getSeries({
            dates:_dates,
            countrys:countrys,
            table:slug
        });
        console.log("[_series]", _series, crurrentChatType);
        // return
        
        setCurrentLineSeries(_series);
    };
    useEffect(() => {
        add();
    }, [currentLineSeries]);
    const handleItemSelection = (index: number, cmdKey: any, shiftKey: any) => {
        let newSelectedCards: any[];

        const cards = state.cards;
        const card = index < 0 ? "" : cards[index];
        let newLastSelectedIndex = index;

        //

        const foundIndex = state.selectedCards.findIndex(
            (f: any) => f === card
        );
        console.log("[foundIndex]", foundIndex, state.selectedCards);
        if (foundIndex > -1) {
            console.log("[foundIndex]foundIndex>-1");
            state.selectedCards.splice(foundIndex, 1);
            newSelectedCards = [...state.selectedCards];
        } else {
            console.log("[foundIndex]foundIndex<=-1");
            newSelectedCards = [...state.selectedCards, card];
        }
        const finalList = cards
            ? cards.filter((f: any) => newSelectedCards.find((a) => a === f))
            : [];
        if (finalList.length === 0) {
            newLastSelectedIndex = -1;
        }
        console.log("[dispatch]", finalList);
        dispatch({
            type: "UPDATE_SELECTION",
            newSelectedCards: finalList,
            newLastSelectedIndex: newLastSelectedIndex,
        });
        //

        // 没有多选
        // if (!cmdKey && !shiftKey) {
        //     newSelectedCards = [card];
        // } else if (shiftKey) {
        //     // 多选，[index, lastSelectedIndex]
        //     if (state.lastSelectedIndex >= index) {
        //         newSelectedCards = [].concat.apply(
        //             state.selectedCards,
        //             cards.slice(index, state.lastSelectedIndex)
        //         );
        //     } else {
        //         // 多选，[lastSelectedIndex,index]
        //         newSelectedCards = [].concat.apply(
        //             state.selectedCards,
        //             cards.slice(state.lastSelectedIndex + 1, index + 1)
        //         );
        //     }
        // } else if (cmdKey) {
        //     const foundIndex = state.selectedCards.findIndex(
        //         (f: any) => f === card
        //     );
        //     // If found remove it to unselect it.
        //     if (foundIndex >= 0) {
        //         newSelectedCards = [
        //             ...state.selectedCards.slice(0, foundIndex),
        //             ...state.selectedCards.slice(foundIndex + 1),
        //         ];
        //     } else {
        //         newSelectedCards = [...state.selectedCards, card];
        //     }
        // }
        // const finalList = cards
        //     ? cards.filter((f: any) => newSelectedCards.find((a) => a === f))
        //     : [];

        // console.log("[dispatch]", finalList);
        // dispatch({
        //     type: "UPDATE_SELECTION",
        //     newSelectedCards: finalList,
        //     newLastSelectedIndex: newLastSelectedIndex,
        // });
    };
    const v = {
        id: "1",
        w: "calc(30% - 16px)",
        h: 320,
        type: "column",
        data: {
            type: "static",
            value: [43, 2, 5, 24, 53, 78, 82, 63, 49, 6],
        },
    };
    const gridStyle: React.CSSProperties = {
        width: "25%",
        minWidth: 200,
        minHeight: 200,
        textAlign: "center",
        padding: 2,
    };
    const initialItems = [
        {
            label: "图标选择",
            children: (
                <Card title="将左边内容拖拽到图标上即可">
                    <Card.Grid style={gridStyle}>
                        <DropBox
                            name="折线图"
                            selectedCards={state.selectedCards}
                            type="line"
                        />
                    </Card.Grid>
                    <Card.Grid style={gridStyle}>
                        <DropBox
                            name="柱状图"
                            selectedCards={state.selectedCards}
                            type="column"
                        />{" "}
                    </Card.Grid>
                    {/* <Card.Grid style={gridStyle}>
                        <DropBox
                            name="线图"
                            selectedCards={state.selectedCards}
                            type="bar"
                        />{" "}
                    </Card.Grid> */}
                    {/* <Card.Grid style={gridStyle}>
                        <DropBox
                            name="表格"
                            selectedCards={state.selectedCards}
                            type="table"
                        />{" "}
                    </Card.Grid> */}
                    <Card.Grid style={gridStyle}>
                        <DropBox
                            name="面积图"
                            selectedCards={state.selectedCards}
                            type="area"
                        />
                    </Card.Grid>
                </Card>
            ),
            key: "1",
            closable: false,
        },
        // { label: "Tab 2", children: "Content of Tab 2", key: "2" },
    ];
    const [activeKey, setActiveKey] = useState(initialItems[0].key);
    const [items, setItems] = useState(initialItems);
    const newTabIndex = useRef(0);

    const onChange = (newActiveKey: string) => {
        setActiveKey(newActiveKey);
    };

    const add = () => {
        if (currentLineSeries.length === 0) return;
        const newActiveKey = `newTab${newTabIndex.current++}`;
        const newPanes = [...items];
        console.log("[add]", currentLineSeries.length,dates[0],currentLineSeries,crurrentChatType);
        const _newPanes = {

            title: {
                text: 'U.S Solar Employment Growth',
                align: 'left'
            },
        
            subtitle: {
                text: 'By Job Category. Source: <a href="https://irecusa.org/programs/solar-jobs-census/" target="_blank">IREC</a>.',
                align: 'left'
            },
        
            yAxis: {
                title: {
                    text: 'Number of Employees'
                }
            },
        
            xAxis: {
                accessibility: {
                    rangeDescription: 'Range: 2010 to 2022'
                }
            },
        
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },
        
            plotOptions: {
                series: {
                    label: {
                        connectorAllowed: false
                    },
                    pointStart: parseInt(dates[0])
                }
            },
        
            series:[
                {
                    "name": "阿富汗",
                    "data": [
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                },
                {
                    "name": "非洲西部及中部",
                    "data": [
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                }
            ],
            chart: {
                        type: crurrentChatType,
                        events: { load: () => {} },
                    },
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    }
                }]
            }
        }
        newPanes.push({
            label: "New-" + crurrentChatType,
            closable: true,
            children: (
                <div>
                    {currentLineSeries.length > 0 && (
                        <div>
                            <HighchartsReact
                                highcharts={Highcharts}
                                options={  
                                    {
                                        plotOptions: {
                                            series: {
                                                label: {
                                                    connectorAllowed: false
                                                },
                                                pointStart: parseInt(dates[0]),
                                            }
                                        },
                                        series: currentLineSeries,
                                        chart: {
                                            type: crurrentChatType,
                                            events: { load: () => {} },
                                        },
                                    }}
                              
                                // constructorType={"bar"}
                            />
                            {/* <Slider range defaultValue={[20, 50]} /> */}
                        </div>
                    )}
                </div>
            ) as any,
            key: newActiveKey,
        });

        
        setItems(newPanes);
        setActiveKey(newActiveKey);
    };

    const remove = (targetKey: TargetKey) => {
        let newActiveKey = activeKey;
        let lastIndex = -1;
        items.forEach((item, i) => {
            if (item.key === targetKey) {
                lastIndex = i - 1;
            }
        });
        const newPanes = items.filter((item) => item.key !== targetKey);
        if (newPanes.length && newActiveKey === targetKey) {
            if (lastIndex >= 0) {
                newActiveKey = newPanes[lastIndex].key;
            } else {
                newActiveKey = newPanes[0].key;
            }
        }
        setItems(newPanes);
        setActiveKey(newActiveKey);
    };

    const onEdit = (
        targetKey: React.MouseEvent | React.KeyboardEvent | string,
        action: "add" | "remove"
    ) => {
        if (action === "add") {
            add();
        } else {
            remove(targetKey);
        }
    };

    const data = [
        "Racing car sprays burning fuel into crowd.",
        "Japanese princess to wed commoner.",
        "Australian walks 100km after outback crash.",
        "Man charged over missing wedding girl.",
        "Los Angeles battles huge wildfires.",
    ];
    if (typeof window == "undefined") {
        return null;
    }
    const handleChange = (value: string) => {
        console.log(`selected ${value}`);
    };
    const [value, setValue] = useState("");
    const [options, setOptions] = useState<AutoCompleteProps["options"]>([]);
    const [anotherOptions, setAnotherOptions] = useState<
        AutoCompleteProps["options"]
    >([]);

    const getPanelValue = (searchText: string) =>
        !searchText
            ? []
            : [
                  mockVal(searchText),
                  mockVal(searchText, 2),
                  mockVal(searchText, 3),
              ];

    const onSelect = (data: string) => {
        console.log("onSelect", data);
    };

    // const onChange = (data: string) => {
    //   setValue(data);
    // };
    const loadMoreData = () => {};
    const onChangePicker = (date: any, dateString: any) => {
        console.log('[onChangePicker]',date, dateString);
        dates=dateString
        // updateSeries();
        // getSeries({
        //     date:dateString,
        //     country:[]
        // });
    }
    return (
        <Row>
            <Col span={18} push={6}>
            <div style={{ paddingLeft: "8px" }}>

            
                {/* <Space direction={"vertical"} align={"center"} style={{ width: "100%" }}> */}
                <RangePicker picker="year" defaultValue={[Dayjs(dates[0]), Dayjs(dates[1])]} onChange={onChangePicker} />
                <Tabs
                    type="editable-card"
                    onChange={onChange}
                    activeKey={activeKey}
                    onEdit={onEdit}
                    items={items}
                    style={{ width: "100%" }}
                />
                {/* </Space> */}
                </div>
            </Col>
            <Col span={6} pull={18}>
                {/* <Space direction={"vertical"} align={"center"}> */}
                {/* <Space> */}
                {/* 类型选择{" "} */}
                {/* <Select
                            defaultValue="GDP"
                            style={{ width: 200 }}
                            onChange={handleChange}
                            options={[
                                {
                                    label: <span>manager</span>,
                                    title: "manager",
                                    options: [
                                        {
                                            label: <span>GDP</span>,
                                            value: "GDP",
                                        },
                                        {
                                            label: <span>Inflation</span>,
                                            value: "Inflation",
                                        },
                                    ],
                                },
                            ]}
                        />{" "} */}
                {/* <AutoComplete
                    options={options}
                    style={{ width: "100%" }}
                    onSelect={onSelect}
                    onSearch={(text) => setOptions(getPanelValue(text))}
                    placeholder="input here"
                /> */}
                {/* <Input placeholder="查询GDP或者Inflation"   prefix={<SearchOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}/> */}
                {/* </Space> */}
                {/* <InfiniteScroll
                    dataLength={data.length}
                    next={loadMoreData}
                    hasMore={data.length < 50}
                    loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
                    endMessage={
                        <Divider plain>It is all, nothing more 🤐</Divider>
                    }
                    scrollableTarget="scrollableDiv"
                > */}
                    <List
                        bordered
                        dataSource={state.cards}
                        // itemLayout="vertical"
                        // size="large"
                        // pagination={{
                        //     onChange: (page) => {
                        //         console.log(page);
                        //     },
                        //     pageSize: 15,
                        // }}
                        style={{ maxHeight: "488px", overflow: "auto" ,width:'250px'}}
                        renderItem={(card: any, i: any) => {
                            const insertLineOnLeft =
                                state.hoverIndex === i &&
                                state.insertIndex === i;
                            const insertLineOnRight =
                                state.hoverIndex === i &&
                                state.insertIndex === i + 1;
                            return (
                                <List.Item>
                                    <DragBox
                                        key={"card-" + card.id}
                                        id={card.id}
                                        index={i}
                                        order={card.order}
                                        name={card.name}
                                        selectedCards={state.selectedCards}
                                        // rearrangeCards={rearrangeCards}
                                        // setInsertIndex={setInsertIndex}
                                        onSelectionChange={handleItemSelection}
                                        clearItemSelection={clearItemSelection}
                                        isSelected={state.selectedCards.includes(
                                            card
                                        )}
                                        end={end}
                                    />
                                </List.Item>
                            );

                            // <List.Item>
                            //     <Typography.Text mark>[ITEM]</Typography.Text>{" "}
                            //     {item}
                            // </List.Item>
                        }}
                    />
                {/* </InfiniteScroll> */}
                {/* </Space> */}
            </Col>
        </Row>
    );
};
const SimpleDemo = ({ countryname }: any) => {
    if (typeof window == "undefined") {
        return null;
    }
    if (countryname.length == 0) {
        return (
            <div>
                <Spin />
            </div>
        );
    }

    return (
        <div className="App">
            <DndProvider backend={HTML5Backend}>
                <App countryname={countryname} />
            </DndProvider>
        </div>
    );
};

// @ts-ignore
import config from "@/libs/config";
import { TDataContext } from "@/app/components/DataProvider";
import LayoutContainer from "@/app/components/LayoutContainer";
import { table } from "console";
// import { use, useEffect, useState } from "react";
const geturl = config.url;
let slug = "";

// import {TDataContext} from ".";
export default function Page({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    // {id:"688981",name:"中芯国际",value:4.807,colorValue:300},
    // {id:"688599",name:"天合光能",value:3.252,colorValue:299},
    // const dd = [
    //     {
    //         name: "旗滨集团",
    //         id: "601636.SH",
    //         value: 29.967,
    //         colorValue: 300,
    //     },

    // ];
    // const [weighValue, setWeighValue] = useState([]);
    const initData: any = useContext(TDataContext);
    const [countryname, setCountryname] = useState([]);
    useEffect(() => {
        console.log("[params]", geturl);

        const fn = async () => {
            slug = (await params).slug;
            console.log("[catalogues-slug]", slug);
            console.log("[catalogues-initData]", initData);
            const countryname = initData?.countryname?.data?.results || [];
            const _defaultCountry = ["瑞士",
                "日本",
                "美国",
                "加拿大",
                "澳大利亚",
                "瑞典",
                "德国",
                "英国",
                "新西兰",
                "丹麦",
                "挪威",
                "法国",
                "荷兰",
                "新加坡",
                "意大利",
                "中国",
                "阿联酋",
                "韩国",
                "西班牙",
                "芬兰"]
            let _countryname:any = []
            _defaultCountry.map((item: any, index: number) => {
                _countryname.push({
                    countryname_cn:item
                })
            })
            countryname.map((item: any, index: number) => {
                if (_defaultCountry.includes(item.countryname_cn)) {
                    
                }else{
                    _countryname.push(item)
                }
            })

            console.log("[catalogues-countryname]", _countryname);
            setCountryname(_countryname);
            const data = await getInitialProps("cataloguelist", {
                indexcode: slug,
            });
            console.log("[[catalogues-data]]", data);
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

    if (typeof window == "undefined") {
        return <div>hello 1</div>;
    } else {
        return (
            <LayoutContainer currentpathname="/gdp">
                <SimpleDemo countryname={countryname} />
            </LayoutContainer>
        );
    }
    // return (
    //     <div>
    //         {/* <div>{slug}</div> */}
    //         <div>{JSON.stringify(value)}</div>
    //     </div>
    // );
}

const getInitialProps = async (type: string, params: Object) => {
    const urlStr =
        geturl + "?type=" + type + "&params=" + JSON.stringify(params);
    console.log("[urlStr]", urlStr);
    const res = await fetch(urlStr);
    const json = await res.json();
    return { data: json };
};

const getSeriesByCountry = async (params: any) => {
    // case "stock": //获取股票
    // const symbol = params.indexcode;
    //     sql = get_stock(symbol);

    const urlStr =
        geturl + "?type=cataloguelist&params=" + JSON.stringify(params);
    console.log("[urlStr]", urlStr);
    const res = await fetch(urlStr);
    const json = await res.json();
    return { data: json };
};
