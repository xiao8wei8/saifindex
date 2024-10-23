"use client";
import { useState } from "react";
import { Container } from "@/components/Container";
import "../../node_modules/video-react/dist/video-react.css";
// @ts-ignore
import { Player } from "video-react";
interface VideoProps {
    videoId: string;
}

export function Video({ videoId }: Readonly<VideoProps>) {
    const [playVideo, setPlayVideo] = useState(true);

    if (!videoId) return null;

    return (
        <Container>
            <Player>
                <source src="https://www.bbhub.io/marketing/sites/6/China_BPS_Website_Sizzle_438976.mp4" />
            </Player>
            {/* <video
                        playsInline={false}
                        autoPlay={true}
                        muted={false}
                        loop={false}
                        preload="auto"
                        poster="https://assets.bbhub.io/marketing/sites/6/2018/09/Core-Megasite-Frame-1-170327_1.jpg"
                        className="video 
                   hide-on-mobile"
                    >
                        <source
                            data-src="https://www.bbhub.io/marketing/sites/6/China_BPS_Website_Sizzle_438976.mp4"
                            src="https://www.bbhub.io/marketing/sites/6/China_BPS_Website_Sizzle_438976.mp4"
                            type="video/mp4"
                        />
                    </video> */}
        </Container>
    );
}
