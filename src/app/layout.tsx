import React from 'react';
//@ts-ignore
import { AntdRegistry } from '@ant-design/nextjs-registry';

const RootLayout = ({ children }: React.PropsWithChildren) => (
  <html lang="en">
    <body>
      <AntdRegistry>{children}</AntdRegistry>

      <a href="https://beian.miit.gov.cn/" target="_blank">沪ICP备2024095623号-1</a>
    </body>
    
 
  </html>
);

export default RootLayout;