"use client"
import LayoutContainer from "../components/LayoutContainer"

const SimpleDemo = () => {
    return (
      <div>SimpleDemo</div>
    )
}
const APP = () => {
    return (
      <LayoutContainer currentpathname='/dashboard'>
        <SimpleDemo/>
      </LayoutContainer>
    )
  }
  export default APP