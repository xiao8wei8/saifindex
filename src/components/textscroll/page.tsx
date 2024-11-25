"use client"
import {use, useEffect, useState}from "react";
import "./styles.css";
import "./TextScroll/index.css";
import TextScroll from "./TextScroll";
import axios from "axios";
import Image from 'next/image'

/**
 * 升级版：
 * https://codesandbox.io/s/react-wenzipaomadeng-pro-onv5v
 * 使用 window.requestAnimationFrame 来实现，性能更好
 */
export default function App() {
  if(typeof window == "undefined") {
    return null
  }
  const [isShow, setIsShow] = useState(false);
  const curWeixin = localStorage.getItem("curWeixin")||""
  useEffect(() => {
    if(!curWeixin) {
      setIsShow(false)
    }else{
      setIsShow(true)
    }
  },[curWeixin])
    const [content, setContent] = useState([""]);
    const callData = ()=>{
        axios.get("https://vip.stock.finance.sina.com.cn/quotes_service/api/json_v2.php/Market_Center.getHQNodeDataSimple?page=1&num=40&sort=symbol&asc=1&node=hs_s&_s_r_a=init").then((res) => {
            const list= res.data
            console.log(list)
            // setContent(list);
            setContent(list.map((item:any) => {
                const rate = (item.settlement*1-item.open)%100
                return (
                    <div className="index-item">
                        <span className="name">{item.name}</span>
                        <span className="price">{item.settlement}</span>
                        {
                          rate<=0? <span className="rate green">{rate.toFixed(2)+"%"}</span>: <span className="rate red">+{rate.toFixed(2)+"%"}</span>
                        }

                    
                    </div>
                )
            }))
            // setTimeout(callData, 5000);
        })
    }
    useEffect(() => {
        callData()
    },[])
  return (
   
    <div className="header-index-container">
    <div className="header-index">
      <div className="header-index-items">
      {isShow?<TextScroll content= {content}/>:null}  
      </div>
     
    </div>
    <div className="header-ad">
    <Image
      src="/images/ad-5.gif"
      width={600}
      height={58}
      alt="Picture of the author"
    />
     <Image
         src="/images/ad-4.gif"
      width={600}
      height={58}
      alt="Picture of the author"
    />
    <Image
      src="/images/ad-3.jpg"
      width={600}
      height={58}
      alt="Picture of the author"
    />
     <Image
         src="/images/ad-2.png"
      width={600}
      height={58}
      alt="Picture of the author"
    />
    </div></div>
    
  );
}
