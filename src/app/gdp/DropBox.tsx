import type { CSSProperties, FC } from 'react'
import { useDrop } from 'react-dnd'



const style: CSSProperties = {
  height: '12rem',
  width: '12rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  color: 'white',
  padding: '1rem',
  textAlign: 'center',
  fontSize: '1rem',
  lineHeight: 'normal',
  float: 'left',
}

export interface DustbinProps {
  allowedDropEffect: string
}

function selectBackgroundColor(isActive: boolean) {
  if (isActive) {
    return 'darkgreen'
  } else {
    return '#222'
  }
}

export const DropBox:any= ({ name,selectedCards }:any) => {
  // const [{ isOver }, drop] = useDrop(
  //   () => ({
  //     accept: "DragBox",
  //     drop: () => (() => {
  //       console.log("[//drop]",selectedCards)
  //     }),
  //     collect: (monitor: any) => ({
  //       isOver: monitor.isOver()
  //     }),
  //   })
  // )
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept:  "DragBox",
    drop: () => ({ name:name }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }))

  const isActive = isOver
  const backgroundColor = selectBackgroundColor(isActive)
  return (
    <div ref={drop as any} style={{ ...style, backgroundColor }}>
      {name} 
      {/* {`Works with ${allowedDropEffect} drop effect`}
      <br />
      <br />
      {isActive ? 'Release to drop' : 'Drag a box here'} */}
    </div>
  )
}
