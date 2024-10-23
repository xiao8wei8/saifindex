"use client"
import { useEffect, useRef, useState, type CSSProperties, type FC } from 'react'
import type { DragSourceMonitor } from 'react-dnd'
import { useDrag } from 'react-dnd'
import "./index.css"

const style: CSSProperties = {
  border: '1px solid black',
  backgroundColor: 'white',
  padding: '0.5rem 1rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  float: 'left',
}

// export interface BoxProps {
//   name: string
// }

// interface DropResult {
//   allowedDropEffect: string
//   dropEffect: string
//   name: string
// }
let _selectedCards:any = []

export const DragBox: any= (props: any) => {
  const {selectedCards} = props
  _selectedCards = selectedCards
  console.log("[//selectedCards]",selectedCards)
  const ref = useRef(null);
  // let styleClasses: Array<string> = [];
  // const [isSelected, setIsSelected] = useState(false);
  // if (.isSelected) {
  //   styleClasses.push("card-wrapper-selected");
  // }
  const [{ isDragging }, drag]:any = useDrag(
    () => ({
      type: "DragBox",
      // item: { name: props.name },
      item: () => {
        const { id, order, url } = props;
        const draggedCard = { id, order, url };
        let cards;
        if (_selectedCards.find((card: { id: any }) => card.id === props.id)) {
          cards = _selectedCards;
        } else {
          // props.clearItemSelection();
          cards = [draggedCard];
        }
        const otherCards = cards.concat();
        otherCards.splice(
          cards.findIndex((c: { id: any }) => c.id === props.id),
          1
        );
        const cardsDragStack = [draggedCard, ...otherCards];
        const cardsIDs = cards.map((c: { id: any }) => c.id);

        // console.log("[//item]",selectedCards)
        return { cards, cardsDragStack, draggedCard, cardsIDs };
      },
      end(item, monitor) {
    
       const dropResult = monitor.getDropResult()
       console.log("[dragBox]end",dropResult)
        props.clearItemSelection();
      },
      isDragging: (monitor:any) => {
        console.log("[//_selectedCards]",monitor.getItem().cardsIDs)
        return monitor.getItem().cardsIDs.includes(props.id);
        return false
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging()
      })
    })
  );
  drag(ref);

  const onClick = (e: { metaKey: any; shiftKey: any }) => {
    props.onSelectionChange(props.index, e.metaKey, e.shiftKey);
  };
  // useEffect(() => {
  //   if (isSelected) {
  //     styleClasses.push("card-wrapper-selected");
  //   }else{
  //     styleClasses=[];
  //   }
  // },[isSelected])
  // const [{ opacity }, drag] = useDrag(
  //   () => ({
  //     type: "DragBox",
  //     item: { name },
  //     end(item, monitor) {
  //       const dropResult = monitor.getDropResult() as any
  //       if (item && dropResult) {
  //         let alertMessage =`根据 ${item.name} 生成 ${dropResult.name}!`
  //         // const isDropAllowed =
  //         //   dropResult.allowedDropEffect === 'any' ||
  //         //   dropResult.allowedDropEffect === dropResult.dropEffect

  //         // if (isDropAllowed) {
  //         //   const isCopyAction = dropResult.dropEffect === 'copy'
  //         //   const actionName = isCopyAction ? 'copied' : 'moved'
  //         //   alertMessage = `You ${actionName} ${item.name} into ${dropResult.name}!`
  //         // } else {
  //         //   alertMessage = `You cannot ${dropResult.dropEffect} an item into the ${dropResult.name}`
  //         // }
  //         alert(alertMessage)
  //       }
  //     },
  //     start(e:any) {
  //       onClick(e);
  //     },
  //     collect: (monitor: DragSourceMonitor) => {
  //       console.log("collect", monitor)
  //       return ({
  //         opacity: monitor.isDragging() ? 0.4 : 1,
  //       })
  //     },
  //   }),
  //   [name],
  // )
  const { name } = props;
  const opacity = isDragging ? 0.4 : 1;
  const styleClasses = [];
  if (props.isSelected) {
    styleClasses.push("card-wrapper-selected");
  }
  return (
    //@ts-ignore\
    // <div className={"card-wrapper " + styleClasses.join(" ")}>

 
    <div ref={ref} style={{ ...style, opacity }}  onClick={onClick}  className={"card-wrapper " + styleClasses.join(" ")}>
      {name}
    </div>
   
    // </div>
  )
}
