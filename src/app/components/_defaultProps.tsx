import {
    ChromeFilled,
    CrownFilled,
    DashboardOutlined,
    SmileFilled,
    StockOutlined,
    TabletFilled,
} from "@ant-design/icons";

export default {
    route: {
        path: "/",
        routes: [
    
          {
            path: "/chat",
            name: "SAIF Chat Bot",
            icon: (
                <CrownFilled
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                />
            ),
            component: "./Welcome",
        },
            {
                path: "/dashboard",
                name: "综合看板",
                icon: (
                    <DashboardOutlined
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                    />
                ),
                component: "./Welcome",
                routes: [
                    {
                        path: "/shishi",
                        name: "实时详情",
                        icon: "https://gw.alipayobjects.com/zos/antfincdn/upvrAjAPQX/Logo_Tech%252520UI.svg",
                        component: "./Welcome",
                    },
                    {
                        path: "/hot",
                        name: "热点综合",
                        icon: "https://gw.alipayobjects.com/zos/antfincdn/upvrAjAPQX/Logo_Tech%252520UI.svg",
                        component: "./Welcome",
                    },
                    {
                        path: "/finance",
                        name: "热点财经",
                        icon: "https://gw.alipayobjects.com/zos/antfincdn/upvrAjAPQX/Logo_Tech%252520UI.svg",
                        component: "./Welcome",
                    },
                    {
                        path: "/politic",
                        name: "热点时政",
                        icon: "https://gw.alipayobjects.com/zos/antfincdn/upvrAjAPQX/Logo_Tech%252520UI.svg",
                        component: "./Welcome",
                    },
                 
                   
                ],
            },
            {
                path: "/dataquery",
                name: "数据查询",
                icon: (
                    <StockOutlined
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                    />
                ),
                access: "canAdmin",
                component: "./Admin",
                routes: [
                    {
                        path: "/nl2sql",
                        name: "自然语言转SQL",
                        icon: "https://gw.alipayobjects.com/zos/antfincdn/upvrAjAPQX/Logo_Tech%252520UI.svg",
                        component: "./Welcome",
                    },
                 
                   
                ],
            },
            {
                path: "/stockindex",
                name: "指数",
                icon: (
                    <StockOutlined
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                    />
                ),
                access: "canAdmin",
                component: "./Admin",
                routes: [
                    {
                        path: "/hs300",
                        name: "沪深300",
                        icon: (
                            <CrownFilled
                                onPointerEnterCapture={undefined}
                                onPointerLeaveCapture={undefined}
                            />
                        ),
                        component: "./Welcome",
                    },
                    {
                        path: "/a50",
                        name: "中证A50",
                        icon: (
                            <CrownFilled
                                onPointerEnterCapture={undefined}
                                onPointerLeaveCapture={undefined}
                            />
                        ),
                        component: "./Welcome",
                    },
                ],
            },
            {
                path: "/gdp",
                name: "宏观经济数据",
                icon: (
                    <StockOutlined
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                    />
                ),
            },
        //     {
        //       path: "/queryCEIC",
        //       name: "宏观经济数据",
        //       icon: (
        //           <StockOutlined
        //               onPointerEnterCapture={undefined}
        //               onPointerLeaveCapture={undefined}
        //           />
        //       ),
        //       access: "canAdmin",
        //       component: "./Admin",
        //       routes: [
        //           {
        //               path: "/gdp",
        //               name: "GDP",
        //               icon: (
        //                   <CrownFilled
        //                       onPointerEnterCapture={undefined}
        //                       onPointerLeaveCapture={undefined}
        //                   />
        //               ),
        //               component: "./Welcome",
        //           },
        //           {
        //             path: "/inflation",
        //             name: "Inflation",
        //             icon: (
        //                 <CrownFilled
        //                     onPointerEnterCapture={undefined}
        //                     onPointerLeaveCapture={undefined}
        //                 />
        //             ),
        //             component: "./Welcome",
        //         },
        //       ],
        //   }
        ],
    },
    location: {
        pathname: "/dashboard",
    },
    appList: [
        // {
        //   icon: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
        //   title: 'Ant Design',
        //   desc: '杭州市较知名的 UI 设计语言',
        //   url: 'https://ant.design',
        // },
        // {
        //   icon: 'https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png',
        //   title: 'AntV',
        //   desc: '蚂蚁集团全新一代数据可视化解决方案',
        //   url: 'https://antv.vision/',
        //   target: '_blank',
        // }
    ],
};
