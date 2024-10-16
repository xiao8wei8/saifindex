 "use client";
import {
  AlipayCircleOutlined,
  LockOutlined,
  MobileOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
}  from '@ant-design/icons';
import {
  LoginForm,
  ProConfigProvider,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
  setAlpha,
} from '@ant-design/pro-components';
import { Checkbox, Space, Tabs, message, theme } from 'antd';
import type { CSSProperties } from 'react';
import { useState } from 'react';
import { useRouter } from "next/navigation";
import weixins from "../components/weixins";
type LoginType = 'phone' | 'account';

export default () => {
  const { token } = theme.useToken();
  const [loginType, setLoginType] = useState<LoginType>('account');
  const router = useRouter();
  const iconStyles: CSSProperties = {
    marginInlineStart: '16px',
    color: setAlpha(token.colorTextBase, 0.2),
    fontSize: '24px',
    verticalAlign: 'middle',
    cursor: 'pointer',
  };
  
  return (
    <div >
    <ProConfigProvider hashed={false} >
      <div style={{ backgroundColor: token.colorBgContainer }}>
        <LoginForm
          logo="https://gw.alipayobjects.com/zos/antfincdn/upvrAjAPQX/Logo_Tech%252520UI.svg"
          title="SAIF CHAT"
          subTitle="高金人自己的金融数据智能查询平台"
          onClick={(opt) => {
            console.log('onClick');
            console.log(opt)
            // let curWeixin = localStorage.setItem("curWeixin")||"";
            // router.push('/dashboard')
          }}
          onFinish={async (values) => {
            console.log('Success:', values);
            localStorage.setItem("curWeixin", values.username);
            router.push('/dashboard');
            // return true;
          }}
          onFinishFailed={async (errorInfo) => {
            console.log('Failed:', errorInfo);
          }}  
          actions={
            <Space>
              {/* 其他登录方式
              <AlipayCircleOutlined style={iconStyles} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
              <TaobaoCircleOutlined style={iconStyles} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
              <WeiboCircleOutlined style={iconStyles} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /> */}
              <div></div>
            </Space>
          }
        >
          <Tabs
            centered
            activeKey={loginType}
            onChange={(activeKey) => setLoginType(activeKey as LoginType)}
          >
            <Tabs.TabPane key={'account'} tab={'账号密码登录'} disabled/>
            <Tabs.TabPane key={'phone'} tab={'手机号登录'}  disabled/>
          </Tabs>
          {loginType === 'account' && (
            <>
              <ProFormText
                name="username"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={'prefixIcon'} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
                }}
                // disabled
                placeholder={'用户名: 微信号'}
                rules={[
                  {
                    required: true,
                    message: '请输入绑定的微信号!',
                  },
                  {
                    pattern:new RegExp(weixins.join("|")),
                    message: '微信号未绑定，请联系管理员绑定',
                  }
                ]}
              />
              <ProFormText.Password
                name="password"
                disabled
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={'prefixIcon'} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
                  // strengthText:
                  //   'Password should contain numbers, letters and special characters, at least 8 characters long.',
                  // statusRender: (value) => {
                 
                  //   const getStatus = () => {
                  //     if (value && value.length > 12) {
                  //       return 'ok';
                  //     }
                  //     if (value && value.length > 6) {
                  //       return 'pass';
                  //     }
                  //     return 'poor';
                  //   };
                  //   const status = getStatus();
                  //   if (status === 'pass') {
                  //     return (
                  //       <div style={{ color: token.colorWarning }}>
                  //         强度：中
                  //       </div>
                  //     );
                  //   }
                  //   if (status === 'ok') {
                  //     return (
                  //       <div style={{ color: token.colorSuccess }}>
                  //         强度：强
                  //       </div>
                  //     );
                  //   }
                  //   return (
                  //     <div style={{ color: token.colorError }}>强度：弱</div>
                  //   );
                  // },
                }}
                placeholder={'密码: saifchat'}
                rules={[
                  {
                    required: false,
                    message: '请输入密码！',
                  },
                ]}
              />
            </>
          )}
          {loginType === 'phone' && (
            <>
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <MobileOutlined className={'prefixIcon'} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
                }}
                name="mobile"
                placeholder={'手机号'}
                rules={[
                  {
                    required: true,
                    message: '请输入手机号！',
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: '手机号格式错误！',
                  },
                ]}
              />
              <ProFormCaptcha
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={'prefixIcon'} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
                }}
                captchaProps={{
                  size: 'large',
                }}
                placeholder={'请输入验证码'}
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return `${count} ${'获取验证码'}`;
                  }
                  return '获取验证码';
                }}
                name="captcha"
                rules={[
                  {
                    required: true,
                    message: '请输入验证码！',
                  },
                ]}
                onGetCaptcha={async () => {
                  message.success('获取验证码成功！验证码为：1234');
                }}
              />
            </>
          )}
          <div
            style={{
              marginBlockEnd: 24,
            }}
          >
              <Checkbox checked disabled>  自动登录</Checkbox>
            {/* <ProFormCheckbox noStyle name="autoLogin" disabled  checked={'autoLogin'} >
              自动登录
            </ProFormCheckbox> */}
            {/* <a
              style={{
                float: 'right',
              }}
            >
              忘记密码
            </a> */}
          </div>
        </LoginForm>
      </div>
    </ProConfigProvider>
    </div>
  );
};