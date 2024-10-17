import React from "react";
//@ts-ignore
import { AntdRegistry } from "@ant-design/nextjs-registry";
// import Icon from "@ant-design/icons";
import Layout, { Content, Footer } from "antd/lib/layout/layout";
import "./layout.css";

const RootLayout = ({ children }: React.PropsWithChildren) => (
    <html lang="en">
        <body>
            <AntdRegistry>
                {/* <Layout style={{minHeight: "100vh"}}> */}
                {/* <Content style={{ margin: "24px 16px 0" }}>
                        <div
                            style={{
                                padding: 24,
                                minHeight: 520,
                            }}
                        > */}
                {children}
                {/* </div>
                    </Content> */}

                {/* </Layout> */}
            </AntdRegistry>
            {/* <Footer
                style={{
                    textAlign: "center",
                    // position: "fixed",
                    // bottom: "0",
                    // width: "100%",
                    // minWidth: "430px",
                    // height: "66px",
                    zIndex: 999,
                    margin: "8px",
                }}
                className="footer"
                id="footer"
            >
                <div>
                    SAIF AI-BASE ©{new Date().getFullYear()} Created by SAIF
                    24Gr.技术小组
                </div>
                <div style={{ marginTop: "10px" }}>
                    © 备案号：
                    <a href="https://beian.miit.gov.cn/" target="_blank">
                        沪ICP备2024095623号-1
                    </a>
                </div>
            </Footer> */}
            <div
              
                className="footer"
                id="footer"
            >
                <div>
                    SAIF AI-BASE ©{new Date().getFullYear()} Created by SAIF
                    24Gr.技术小组
                </div>
                <div style={{ marginTop: "10px" }}>
                    © 备案号：
                    <a href="https://beian.miit.gov.cn/" target="_blank">
                        沪ICP备2024095623号-1
                    </a>
                </div>
            </div>
        </body>
    </html>
);

export default RootLayout;
