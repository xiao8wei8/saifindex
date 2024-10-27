"use client";

import { use, useEffect, useReducer, useState } from "react";
import { DragBox } from "./DragBox";
import { DropBox } from "./DropBox";
import Chart from "@/components/Chart";
import React from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
// @ts-ignore
import styles from "./index.module.less";
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
const Container = () => {
    const [state, dispatch] = useReducer(cardReducer, init_state);

    const getSeries = (keys: any) => {
        var ret = [];
        for (let index = 0; index < lineSeries.length; index++) {
            const element = lineSeries[index];
            if (keys.includes(element.name)) {
                ret.push(element);
            }
        }
        return ret;
    };

    const lineSeries = [
        {
            name: "中国",
            data: [
                43934, 48656, 65165, 81827, 112143, 142383, 171533, 165174,
                155157, 161454, 154610, 168960
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
    const [crurrentChatType, setCrurrentChatType] = useState(
        "line"
    )
    useEffect(() => {
        const _series: any[] = getSeries([lineSeries[0].name]);
        console.log("[_series]", _series);
        // return
        handleItemSelection(0, false, false);
        setCurrentLineSeries(_series);
        console.log("[currentLineSeries]", currentLineSeries);
    }, []);

    const clearItemSelection = () => {
        console.log("[clearItemSelection]");
        dispatch({ type: "CLEAR_SELECTION" });
    };
    const end = (_selectedCards: any[], dropResult: { name: any,type:any }) => {
        console.log("[end]");

        console.log("[dragBox]end", dropResult);
        let ret: any[] = [];
        _selectedCards.forEach((item: any) => {
            ret.push(item.name);
        });
        // ret.push("in");
        // ret.push(dropResult.name);
        // alert(JSON.stringify(ret));
        // const _series:any[] = myRandom([...lineSeries],_selectedCards.length)'
        const _series: any[] = getSeries(ret);
        console.log("[_series]", _series,dropResult.type);
        // return
        setCrurrentChatType(dropResult.type);
        setCurrentLineSeries(_series);
    };
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
        type: "bar",
        data: {
            type: "static",
            value: [43, 2, 5, 24, 53, 78, 82, 63, 49, 6],
        },
    };

    return (
        <div>
            <div style={{ overflow: "hidden", clear: "both" }}>
                <DropBox name="折线图" selectedCards={state.selectedCards} type="line" />
                <DropBox name="柱状图" selectedCards={state.selectedCards}  type="bar" />
                <DropBox name="面积图" selectedCards={state.selectedCards} type="area"/>
            </div>
            <div style={{ overflow: "hidden", clear: "both" }}>
                {state.cards.map((card: any, i: any) => {
                    const insertLineOnLeft =
                        state.hoverIndex === i && state.insertIndex === i;
                    const insertLineOnRight =
                        state.hoverIndex === i && state.insertIndex === i + 1;
                    return (
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
                            isSelected={state.selectedCards.includes(card)}
                            end={end}
                        />
                    );
                })}
            </div>

            <div>
                {currentLineSeries.length > 0 && (
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={{
                            
                            series: currentLineSeries,
                            chart: { type:crurrentChatType, events: { load: () => {} } },
                        }}
                        // constructorType={"bar"}
                    />
                )}
            </div>
        </div>
    );
};
export default Container;
