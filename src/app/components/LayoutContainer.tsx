'use client';
import {
    CrownFilled,
    GithubFilled,
    InfoCircleFilled,
    QuestionCircleFilled,
} from "@ant-design/icons";
import { PageContainer, ProCard, ProLayout } from "@ant-design/pro-components";
import { createContext, use, useContext, useEffect, useState } from "react";
import defaultProps from "./_defaultProps";
const defaultpathname = "/admin/excle";
import { useRouter } from "next/navigation";
import weixins from "./weixins";
import "./index.css";
import { NextPageContext } from "next";
import {TDataContext} from "./DataProvider";

const Page =   ({
    children,
    currentpathname
}: {
    children: React.ReactNode;
    currentpathname?: string;

}) => {
    const initData:any = useContext(TDataContext);
    const results = initData?.data?.data?.results||[]
    // const revenue = await fetchRevenue();
    console.log("[initData]",results);
    let routes:any = [
        
    ]
    results.forEach((item:any) => {
        routes.push({
            path: "/indexs/"+item.indexcode,
            name: item.t,
            icon: (
                <CrownFilled
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                />
            ),
            component: "./Welcome",
        });
    });
    console.log("[routes]",routes);
    let newPros:any = defaultProps
    newPros.route.routes[3]['routes'] = routes;

    // {
    //     path: "/hs300",
    //     name: "沪深300",
    //     icon: (
    //         <CrownFilled
    //             onPointerEnterCapture={undefined}
    //             onPointerLeaveCapture={undefined}
    //         />
    //     ),
    //     component: "./Welcome",
    // },
    // defaultProps
    const router = useRouter();
    const [pathname, setPathname] = useState(
        currentpathname || defaultpathname
    );
    let curWeixin = "";
    if (typeof localStorage !== "undefined") {
        curWeixin = localStorage.getItem("curWeixin") || "";
    }

    useEffect(() => {
        let curWeixin = localStorage.getItem("curWeixin") || "";
        if (!weixins.includes(curWeixin)) {
            router.push("/login");
        }
    }, []);
    return !curWeixin ? null : (
        <div
            id="test-pro-layout"
            style={{
                height: "100vh",
            }}
        >
            <ProLayout
                siderWidth={216}
                bgLayoutImgList={
                    [
                        // {
                        //     src: "https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png",
                        //     left: 85,
                        //     bottom: 100,
                        //     height: "303px",
                        // },
                        // {
                        //     src: "https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png",
                        //     bottom: -68,
                        //     right: -45,
                        //     height: "303px",
                        // },
                        // {
                        //     src: "https://img.alicdn.com/imgextra/i3/O1CN018NxReL1shX85Yz6Cx_!!6000000005798-2-tps-884-496.png",
                        //     bottom: 0,
                        //     left: 0,
                        //     width: "331px",
                        // },
                    ]
                }
                {...newPros}
                title="SAIF AI-BASE"
                logo="/images/logo-font/logo_star.png"
                location={{
                    pathname,
                }}
                avatarProps={{
                    src: "https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg",
                    title: localStorage.getItem("curWeixin") || "SCer",
                    size: "small",
                }}
                // actionsRender={(props) => {
                //     if (props.isMobile) return [];
                //     return [
                //         <InfoCircleFilled
                //             key="InfoCircleFilled"
                //             onPointerEnterCapture={undefined}
                //             onPointerLeaveCapture={undefined}
                //         />,
                //         <QuestionCircleFilled
                //             key="QuestionCircleFilled"
                //             onPointerEnterCapture={undefined}
                //             onPointerLeaveCapture={undefined}
                //         />,
                //         <GithubFilled
                //             key="GithubFilled"
                //             onPointerEnterCapture={undefined}
                //             onPointerLeaveCapture={undefined}
                //         />,
                //     ];
                // }}
                menuFooterRender={(props) => {
                    if (props?.collapsed) return undefined;
                    return (
                        <div
                            style={{
                                textAlign: "center",
                                paddingBlockStart: 12,
                            }}
                        >
                            {" "}
                            <div> SAIF AI-BASE ©{new Date().getFullYear()}</div>
                            <div> Created by SAIF 24Gr.技术小组</div>
                        </div>
                    );
                }}
                menuItemRender={(item, dom) => (
                    <div
                        onClick={() => {
                            console.log(item.path);

                            const _pathname = item.path || defaultpathname;
                            if (_pathname.includes("http")) {
                                window.open(_pathname);
                                return;
                            }

                            setPathname(_pathname);
                            router.push(_pathname);
                        }}
                    >
                        {dom}
                    </div>
                )}
            >
                <PageContainer>
                    <ProCard
                        style={{
                            height: "100vh",
                            minHeight: 800,
                        }}
                    >
                        {children}
                        <div />
                    </ProCard>
                </PageContainer>
            </ProLayout>
        </div>
    );
};
Page.getInitialProps = async (ctx: NextPageContext) => {
   console.log("[revenue]",2);
    // const res = await fetch('https://api.github.com/repos/vercel/next.js')
    // const json = await res.json()
    return { stars: 1 }
  }
export default Page;
