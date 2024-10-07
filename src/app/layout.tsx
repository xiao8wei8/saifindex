import React from "react";
//@ts-ignore
import { AntdRegistry } from "@ant-design/nextjs-registry";
import Icon from "@ant-design/icons";
import Layout, { Content, Footer } from "antd/lib/layout/layout";

const RootLayout = ({ children }: React.PropsWithChildren) => (
    <html lang="en">
        <body>
        
            <AntdRegistry>
                <Layout>
                    {children}

                    <Footer
                        style={{
                            textAlign: "center",
                            position: "fixed",
                            bottom: "0",
                            width: "100%",
                            minWidth:"430px"
                        }}
                    >
                        <div>
                          
                            SAIF Chat ©{new Date().getFullYear()} Created by
                            SAIF 24Gr.技术小组
                        </div>
                        <div style={{ marginTop: "10px" }}>
                          
                            © 备案号：
                            <a
                                href="https://beian.miit.gov.cn/"
                                target="_blank"
                            >
                                沪ICP备2024095623号-1
                            </a>
                        </div>
                    </Footer>
                </Layout>
            </AntdRegistry>
        </body>
    </html>
);

export default RootLayout;
