"use client";
import React, { useRef, useEffect, useState } from "react";
import "./index.css";
// @ts-ignore
import styled from "styled-components";

interface TextScrollProps {
    /**
     * 内容
     */
    content: string[];
    /**
     * 持续时间/s
     */
    duration: number;
}

function TextScroll(props: TextScrollProps) {
    const { content, duration } = props;

    const defaultState = {
        contentWidth: 0,
        left: 0,
        duration: 15, //duration||
    };

    const [state, setState] = useState(defaultState);

    let ref = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const { offsetWidth, parentElement } =
            ref.current as HTMLParagraphElement;

        setState({
            ...state,
            contentWidth: offsetWidth,
            left: parentElement!.offsetWidth,
        });
    }, []);

    const { contentWidth, left, duration: timing } = state;

    const animationName = `marquee_${contentWidth}`;
    // animation: ${animationName} ${timing}s linear infinite both;
    // const Text = styled.p`
    //     position: relative;
    //     left: ${left}px;

    //     animation: index-move 60s linear 0s infinite;
    //     animation-play-state: running;
    //     animation-fill-mode: forwards;
    //     display: flex;
    //     @keyframes index-move {
    //         0% {
    //             transform: translate(0, 0);
    //         }

    //         100% {
    //             transform: translate(-50%, 0);
    //         }
    //     }
    //     @keyframes ${animationName} {
    //         0% {
    //             transform: translateX(0px);
    //         }

    //         100% {
    //             transform: translateX(-${contentWidth + left}px);
    //         }
    //     }
    // `;

    return (
        <div className="header-index">
            <div className="marquee_box">
                <div
                    ref={ref}
                    style={{
                    
                        position: "relative",
                        left: `${left}px`,
                
                        animation: `index-move 60s linear 0s infinite`,
                        "animationPlayState": "running",
                        "animationFillMode": "forwards",
                        display: "flex"
                       
                    }}
                >
                    {content}
                </div>

                {/* <Text ref={ref}>{content}</Text> */}
            </div>
        </div>
    );
}
TextScroll.defaultProps = {
    content: "",
    duration: 3,
};

export default React.memo(TextScroll);
