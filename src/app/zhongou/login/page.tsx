"use client";



import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Card, Row, Col, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './index.css';

const { Title, Text, Link } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // 处理登录提交
  const handleLogin = (values: any) => {
    setLoading(true);
    console.log('登录信息:', values);
    
    // 模拟登录过程
    setTimeout(() => {
      setLoading(false);
      message.success('登录成功！');
    }, 1500);
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
          
          <Form.Item>
            <Row justify="space-between">
              <Col>
                <Checkbox>记住我</Checkbox>
              </Col>
              <Col>
                <Link href="#" style={{ fontSize: 14 }}>忘记密码?</Link>
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
        
        <div className="login-footer">
          <Text type="secondary">
            还没有账号? <Link href="#" strong>立即注册</Link>
          </Text>
        </div>
      </Card>
      
      <div className="copyright">
        <Text type="secondary">© 2023 企业管理系统 版权所有</Text>
      </div>
    </div>
  );
};

export default LoginPage;


