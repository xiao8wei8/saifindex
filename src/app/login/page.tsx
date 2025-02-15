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
type LoginType = 'phone' | 'account' |'token';
import axios from "axios";
axios.defaults.timeout = 50000;

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
  let curWeixin = ""
  if(typeof window != "undefined") {
    curWeixin = localStorage.getItem("curWeixin")||"";
  }
  
  return (
    <div >
    <ProConfigProvider hashed={false} >
      <div style={{ backgroundColor: token.colorBgContainer }}>
        <LoginForm
          logo="/images/logo-font/logo_star.png"
          title="SAIF AI-BASE"
          subTitle="高金人自己的金融数据智能查询平台"
          onClick={(opt) => {
            console.log('onClick');
            console.log(opt)
            // let curWeixin = localStorage.setItem("curWeixin")||"";
            // router.push('/dashboard')
          }}
          onFinish={async (values) => {
            console.log('Success:', values);
            if(values.token){
              localStorage.setItem("token", values.token);
            }else if(values.username){
              localStorage.setItem("curWeixin", values.username);
            }
            
            router.push('/dingpan');
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
            <Tabs.TabPane key={'account'} tab={'账号密码登录'} />
            <Tabs.TabPane key={'token'} tab={'Token登录'}  />
          </Tabs>
          {loginType === 'token' && (
            <>
              <ProFormText
                name="token"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={'prefixIcon'} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
                }}
                initialValue={''}
                // disabled
                placeholder={'token：获取的token'}
                rules={[
                  // {
                  //   required: true,
                  //   message: '请输入获取的token!',
                  // },
                  {
                    validator: (_, value,callback) => {
                        value = value.trim()
                        if(value=== "") {
                          return Promise.reject('token不正确，请联系管理员绑定1');
                        }
                            const main = async () => {
                                const response:any = await axios.get(
                                    "/rest2/aes?type=validate30&message="+encodeURI(value),
                                    {
                                      
                                    } // Include the config object as the third argument
                                );
                                const val = response.data.validate;
                                console.log("[items]", response.data);
                                if(val) {
                                  callback()
                                  return Promise.resolve();
                                }else{
                                   callback('token不正确，请联系管理员绑定1');
                                }

                                // callback(items)
                                // return Promise.resolve();
                               
                            }
                            main()

                      // if (weixins.indexOf(value) === -1) {
                       
                        // return Promise.reject('token不正确，请联系管理员绑定');
                      // }
                      // return Promise.resolve();
                    },
                  }
                  // {
                  //   pattern:new RegExp(weixins.join("|")),
                  //   message: 'token不正确，请联系管理员绑定',
                  // }
                ]}
              />
              {/* <ProFormText.Password
                style={{ display: 'none' }}
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
              /> */}
            </>
          )}
          {loginType === 'account' && (
            <>
              <ProFormText
                name="username"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={'prefixIcon'} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
                }}
                initialValue={curWeixin}
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
              {/* <ProFormText.Password
                style={{ display: 'none' }}
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
              /> */}
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
              <Checkbox checked disabled style={{display: 'none'}}>  自动登录</Checkbox>
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