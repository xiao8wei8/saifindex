
"use client"

import Container from './Container'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import LayoutContainer from '../components/LayoutContainer'

const SimpleDemo =  () =>{
    return (
        <div className="App">
            <DndProvider backend={HTML5Backend}>
                <Container />
            </DndProvider>
        </div>
    )
}


const APP = () => {
    return (
        <LayoutContainer currentpathname="/gdp">
            <SimpleDemo />
        </LayoutContainer>
    );
  };
  export default APP;
  