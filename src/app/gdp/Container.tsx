"use client";

import { useReducer } from "react";
import { DragBox } from "./DragBox";
import { DropBox } from "./DropBox";
import Chart from "@/components/Chart";
import styles from './index.module.less';
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
    const clearItemSelection = () => {
        console.log("[clearItemSelection]");
        dispatch({ type: "CLEAR_SELECTION" });
    };

    const handleItemSelection = (index: number, cmdKey: any, shiftKey: any) => {
        let newSelectedCards: any[];

        const cards = state.cards;
        const card = index < 0 ? "" : cards[index];
        const newLastSelectedIndex = index;
        // 没有多选
        if (!cmdKey && !shiftKey) {
            newSelectedCards = [card];
        } else if (shiftKey) {
            // 多选，[index, lastSelectedIndex]
            if (state.lastSelectedIndex >= index) {
                newSelectedCards = [].concat.apply(
                    state.selectedCards,
                    cards.slice(index, state.lastSelectedIndex)
                );
            } else {
                // 多选，[lastSelectedIndex,index]
                newSelectedCards = [].concat.apply(
                    state.selectedCards,
                    cards.slice(state.lastSelectedIndex + 1, index + 1)
                );
            }
        } else if (cmdKey) {
            const foundIndex = state.selectedCards.findIndex(
                (f: any) => f === card
            );
            // If found remove it to unselect it.
            if (foundIndex >= 0) {
                newSelectedCards = [
                    ...state.selectedCards.slice(0, foundIndex),
                    ...state.selectedCards.slice(foundIndex + 1),
                ];
            } else {
                newSelectedCards = [...state.selectedCards, card];
            }
        }
        const finalList = cards
            ? cards.filter((f: any) => newSelectedCards.find((a) => a === f))
            : [];

        console.log("[dispatch]", finalList);
        dispatch({
            type: "UPDATE_SELECTION",
            newSelectedCards: finalList,
            newLastSelectedIndex: newLastSelectedIndex,
        });
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
                <DropBox name="折线图" selectedCards={state.selectedCards} />
                <DropBox name="柱状图" selectedCards={state.selectedCards} />
                <DropBox name="曲线图" selectedCards={state.selectedCards} />
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
                        />
                    );
                })}
            </div>
            <div key={1} style={{ width: v.w, height: v.h }}  className={styles.card}>
                <Chart data={v.data} type={v.type} id={v.id} />
            </div>
            <div>hhh</div>
        </div>
    );
};
export default Container;
