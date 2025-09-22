"use client";

import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Card, Row, Col, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './index.css';

const { Title, Text } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // 处理登录提交
  const handleLogin = async (values: any) => {
    setLoading(true);
    console.log('登录信息:', values);
    
    try {
      // 通过API调用验证登录 - 使用rest2/zhongou下的API
      const response = await fetch('/rest2/zhongou?action=login&username=' + encodeURIComponent(values.username) + '&password=' + encodeURIComponent(values.password), {
        method: 'GET'
      });
      
      const result = await response.json();
      
      if (!result.success) {
        message.error(result.error || '登录失败');
        setLoading(false);
        return;
      }
      
      // 登录成功，存储用户信息
      const userInfo = result.data;
      
      // 如果勾选了记住我，设置更长的过期时间
      if (values.remember) {
        // 记住我：存储用户信息到localStorage
        localStorage.setItem('currentUser', JSON.stringify(userInfo));
      } else {
        // 不记住我：存储用户信息到sessionStorage
        sessionStorage.setItem('currentUser', JSON.stringify(userInfo));
      }
      
      message.success('登录成功！');
      // 登录成功后跳转到/zhongou/input
      window.location.href = '/zhongou/input';
      
    } catch (error: any) {
      console.error('登录失败:', error);
      message.error(`登录失败: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background"></div>
      
      <Card className="login-card">
        <div className="login-header">
          <Title level={2} className="logo-text">系统登录</Title>
          <Text type="secondary">请输入您的账号和密码</Text>
        </div>
          
        <Form
          form={form}
          onFinish={handleLogin}
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 4, message: '用户名至少4位字符' }
            ]}
          >
            <Input 
              size="large" 
              placeholder="用户名" 
              prefix={<UserOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />} 
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6位字符' }
            ]}
          >
            <Input.Password 
              size="large" 
              placeholder="密码" 
              prefix={<LockOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />} 
            />
          </Form.Item>
          
          <Form.Item
            name="remember"
            valuePropName="checked"
            initialValue={false}
          >
            <Row justify="space-between">
              <Col>
                <Checkbox>记住我</Checkbox>
              </Col>
              <Col>
                {/* 移除忘记密码链接 */}
              </Col>
            </Row>
          </Form.Item>
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large" 
              block
              loading={loading}
              className="login-button"
            >
              登录
            </Button>
          </Form.Item>
        </Form>
        
        {/* 移除登录页脚和注册链接 */}
      </Card>
      
      <div className="copyright">
        <Text type="secondary">© 2023 企业管理系统 版权所有</Text>
      </div>
    </div>
  );
};

export default LoginPage;


