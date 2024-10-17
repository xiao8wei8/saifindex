"use client"
import { useEffect, useState, type CSSProperties, type FC } from 'react'
import type { DragSourceMonitor } from 'react-dnd'
import { useDrag } from 'react-dnd'

import ItemTypes from './ItemTypes'
import "./index.css"

const style: CSSProperties = {
  border: '1px dashed gray',
  backgroundColor: 'white',
  padding: '0.5rem 1rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  float: 'left',
}

export interface BoxProps {
  name: string
}

interface DropResult {
  allowedDropEffect: string
  dropEffect: string
  name: string
}

export const Box: FC<BoxProps> = ({ name }) => {
  let styleClasses: Array<string> = [];
  const [isSelected, setIsSelected] = useState(false);
  // if (.isSelected) {
  //   styleClasses.push("card-wrapper-selected");
  // }
  const onClick = (e: any) => {
    console.log(e);
    setIsSelected(!isSelected)
  };
  // useEffect(() => {
  //   if (isSelected) {
  //     styleClasses.push("card-wrapper-selected");
  //   }else{
  //     styleClasses=[];
  //   }
  // },[isSelected])
  const [{ opacity }, drag] = useDrag(
    () => ({
      type: ItemTypes.BOX,
      item: { name },
      end(item, monitor) {
        const dropResult = monitor.getDropResult() as DropResult
        if (item && dropResult) {
          let alertMessage =`根据 ${item.name} 生成 ${dropResult.name}!`
          // const isDropAllowed =
          //   dropResult.allowedDropEffect === 'any' ||
          //   dropResult.allowedDropEffect === dropResult.dropEffect

          // if (isDropAllowed) {
          //   const isCopyAction = dropResult.dropEffect === 'copy'
          //   const actionName = isCopyAction ? 'copied' : 'moved'
          //   alertMessage = `You ${actionName} ${item.name} into ${dropResult.name}!`
          // } else {
          //   alertMessage = `You cannot ${dropResult.dropEffect} an item into the ${dropResult.name}`
          // }
          alert(alertMessage)
        }
      },
      start() {
        
      },
      collect: (monitor: DragSourceMonitor) => {
        console.log("collect", monitor)
        return ({
          opacity: monitor.isDragging() ? 0.4 : 1,
        })
      },
    }),
    [name],
  )

  return (
    //@ts-ignore
    <div ref={drag} style={{ ...style, opacity }}  onMouseDown={onClick}  className={isSelected||opacity==0.4 ? "card-wrapper-selected" : ""}>
      {name}
    </div>
  )
}
