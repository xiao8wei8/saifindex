"use client";




import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Card, 
  Row, 
  Col, 
  Tag, 
  Popconfirm, 
  message,
  Typography,
  Avatar,
  Divider,
  Select,
  Drawer,
  Space,
  Descriptions
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  UserOutlined,
  LockOutlined,
  PhoneOutlined,
  TeamOutlined,
  MenuOutlined,
  CloseOutlined
} from '@ant-design/icons';
import './index.css';

const { Title, Text } = Typography;
const { Option } = Select;

// 定义用户数据类型
interface User {
  id: number;
  username: string;
  password: string;
  phone: string;
  role: '管理员' | '编辑' | '查看者';
  status: 'active' | 'inactive';
  createdAt: string;
}

// 定义表单数据类型
interface FormValues {
  username: string;
  password: string;
  phone: string;
  role: '管理员' | '编辑' | '查看者';
  status: string; // '1' 或 '0'
}

// API 请求函数
  const fetchUsers = async (): Promise<User[]> => {
    try {
      const response = await fetch('/rest2/zhongou', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.success) {
        return data.data.map((user: any) => ({
          ...user,
          // 确保createdAt字段存在
          createdAt: user.createdAt || user.created_at || ''
        }));
      } else {
        message.error('获取用户列表失败: ' + data.error);
        return [];
      }
    } catch (error: any) {
      message.error('网络错误: ' + error.message);
      return [];
    }
  };

  const addUser = async (userData: Omit<User, 'id'>): Promise<boolean> => {
    try {
      const response = await fetch('/rest2/zhongou', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userData,
          created_at: userData.createdAt
        }),
      });
      const data = await response.json();
      if (data.success) {
        message.success('用户添加成功');
        return true;
      } else {
        message.error('添加用户失败: ' + data.error);
        return false;
      }
    } catch (error: any) {
      message.error('网络错误: ' + error.message);
      return false;
    }
  };

  const updateUser = async (userId: number, userData: Partial<User>): Promise<boolean> => {
    try {
      const response = await fetch('/rest2/zhongou', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: userId,
          ...userData,
          created_at: userData.createdAt
        }),
      });
      const data = await response.json();
      if (data.success) {
        message.success('用户信息更新成功');
        return true;
      } else {
        message.error('更新用户失败: ' + data.error);
        return false;
      }
    } catch (error: any) {
      message.error('网络错误: ' + error.message);
      return false;
    }
  };

const deleteUser = async (userId: number): Promise<boolean> => {
  try {
    const response = await fetch(`/rest2/zhongou?id=${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (data.success) {
      message.success('用户删除成功');
      return true;
    } else {
      message.error('删除用户失败: ' + data.error);
      return false;
    }
  } catch (error: any) {
    message.error('网络错误: ' + error.message);
    return false;
  }
};

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [form] = Form.useForm<FormValues>();
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 初始化数据
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      const userList = await fetchUsers();
      setUsers(userList);
      setFilteredUsers(userList);
      setLoading(false);
    };
    
    loadUsers();
  }, []);

  // 处理搜索
  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm)
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  // 显示添加用户模态框
  const showAddModal = () => {
    setCurrentUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // 显示编辑用户模态框
  const showEditModal = (user: User) => {
    setCurrentUser(user);
    form.setFieldsValue({
      username: user.username,
      password: user.password,
      phone: user.phone,
      role: user.role,
      status: user.status === 'active' ? '1' : '0'
    });
    setIsModalVisible(true);
  };

  // 显示用户详情抽屉
  const showUserDetail = (user: User) => {
    setCurrentUser(user);
    setIsDrawerVisible(true);
  };

  // 处理表单提交
  const handleSubmit = () => {
    form.validateFields().then(async (values: FormValues) => {
      setLoading(true);
      
      if (currentUser) {
        // 更新用户
        const userData: Partial<User> = {
          username: values.username,
          phone: values.phone,
          role: values.role,
          status: values.status === '1' ? 'active' : 'inactive'
        };
        
        // 只有当密码字段有值时才更新密码
        if (values.password) {
          userData.password = values.password;
        }
        
        const success = await updateUser(currentUser.id, userData);
        if (success) {
          const userList = await fetchUsers();
          setUsers(userList);
          setFilteredUsers(userList);
        }
      } else {
        // 添加新用户
        const newUser: Omit<User, 'id'> = {
          username: values.username,
          password: values.password,
          phone: values.phone,
          role: values.role,
          status: values.status === '1' ? 'active' : 'inactive',
          createdAt: new Date().toISOString().split('T')[0]
        };
        
        const success = await addUser(newUser);
        if (success) {
          const userList = await fetchUsers();
          setUsers(userList);
          setFilteredUsers(userList);
        }
      }
      
      setLoading(false);
      setIsModalVisible(false);
    });
  };

  // 删除用户
  const handleDelete = async (id: number) => {
    setLoading(true);
    const success = await deleteUser(id);
    if (success) {
      const userList = await fetchUsers();
      setUsers(userList);
      setFilteredUsers(userList);
    }
    setLoading(false);
    setIsDrawerVisible(false);
  };

  // 状态标签渲染
  const renderStatusTag = (status: 'active' | 'inactive') => {
    return status === 'active' ? 
      <Tag color="green">已激活</Tag> : 
      <Tag color="red">未激活</Tag>;
  };

  // 角色标签渲染
  const renderRoleTag = (role: '管理员' | '编辑' | '查看者') => {
    let color;
    switch (role) {
      case '管理员':
        color = 'gold';
        break;
      case '编辑':
        color = 'blue';
        break;
      case '查看者':
        color = 'geekblue';
        break;
      default:
        color = 'default';
    }
    return <Tag color={color}>{role}</Tag>;
  };

  // 表格列定义 - 移动端优化
  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      render: (text: string, record: User) => (
        <div 
          style={{ display: 'flex', alignItems: 'center' }}
          onClick={() => showUserDetail(record)}
        >
          <Avatar 
            style={{ backgroundColor: '#1890ff', marginRight: 8 }} 
            icon={<UserOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />} 
          />
          <div>
            <div style={{ fontWeight: 500 }}>{text}</div>
            {isMobile && (
              <Text type="secondary" style={{ fontSize: 12 }}>{record.phone}</Text>
            )}
          </div>
        </div>
      ),
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone: string) => <Text>{phone}</Text>,
      responsive: ['sm'] as any,
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: '管理员' | '编辑' | '查看者') => renderRoleTag(role),
      responsive: ['md'] as any,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: 'active' | 'inactive') => renderStatusTag(status),
      responsive: ['sm'] as any,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: User) => (
        <Space>
          <Button 
            icon={<EditOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />} 
            onClick={(e) => {
              e.stopPropagation();
              showEditModal(record);
            }}
            size="small"
          />
          <Popconfirm
            title="确定要删除此用户吗?"
            onConfirm={(e) => {
              e?.stopPropagation();
              handleDelete(record.id);
            }}
            onCancel={(e) => e?.stopPropagation()}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              icon={<DeleteOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />} 
              danger 
              size="small"
              onClick={(e) => e.stopPropagation()}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="user-management-container">
      {/* 移动端顶部导航 */}
      {isMobile && (
        <div className="mobile-header">
          <div className="logo">
            <TeamOutlined style={{ color: '#1890ff', fontSize: 20, marginRight: 8 }} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
            <span>用户管理</span>
          </div>
          <Button 
            icon={isDrawerVisible ? <CloseOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /> : <MenuOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
            type="text"
            onClick={() => setIsDrawerVisible(!isDrawerVisible)}
          />
        </div>
      )}

      <div className="content-wrapper">
        {/* 桌面端标题 */}
        {!isMobile && (
          <Title level={4} style={{ marginBottom: 24, color: '#1890ff' }}>
            <TeamOutlined style={{ marginRight: 12 }} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
            用户管理系统
          </Title>
        )}
        
        <Card 
          bordered={!isMobile} 
          className="user-card"
        >
          <Row justify="space-between" style={{ marginBottom: 24 }}>
            <Col xs={24} sm={16} md={12} lg={8}>
              <Input
                placeholder="搜索用户名或手机号..."
                prefix={<SearchOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                allowClear
                size={isMobile ? 'middle' : 'large'}
                className="search-input"
              />
            </Col>
            <Col xs={24} sm={8} style={{ textAlign: isMobile ? 'center' : 'right', marginTop: isMobile ? 16 : 0 }}>
              <Button 
                type="primary" 
                icon={<PlusOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />} 
                onClick={showAddModal}
                size={isMobile ? 'middle' : 'large'}
                className="add-button"
              >
                {isMobile ? '添加用户' : '添加新用户'}
              </Button>
            </Col>
          </Row>
          
          <Table 
            columns={columns} 
            dataSource={filteredUsers} 
            rowKey="id"
            loading={loading}
            pagination={{ 
              pageSize: isMobile ? 5 : 6,
              simple: isMobile,
              showSizeChanger: false,
              showTotal: (total) => `共 ${total} 位用户`,
              position: ['bottomCenter'] as any
            }}
            scroll={{ x: true }}
            bordered={!isMobile}
            onRow={(record) => ({
              onClick: () => isMobile && showUserDetail(record)
            })}
            className="user-table"
          />
        </Card>
        
        {/* 添加/编辑用户模态框 */}
        <Modal
          title={currentUser ? "编辑用户" : "添加用户"}
          open={isModalVisible}
          onOk={handleSubmit}
          onCancel={() => setIsModalVisible(false)}
          confirmLoading={loading}
          width={isMobile ? '90%' : 600}
          bodyStyle={{ padding: isMobile ? '16px' : '24px 16px' }}
          className="user-modal"
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={{ status: '1', role: '查看者' }}
          >
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="username"
                  label="用户名"
                  rules={[
                    { required: true, message: '请输入用户名' },
                    { min: 4, message: '用户名至少4位字符' }
                  ]}
                >
                  <Input 
                    prefix={<UserOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />} 
                    placeholder="请输入用户名" 
                    size={isMobile ? 'middle' : 'large'}
                  />
                </Form.Item>
              </Col>
            </Row>
            
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="phone"
                  label="手机号码"
                  rules={[
                    { required: true, message: '请输入手机号码' },
                    { pattern: /^1[3-9]\d{9}$/, message: '手机号码格式不正确' }
                  ]}
                >
                  <Input 
                    prefix={<PhoneOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />} 
                    placeholder="请输入手机号码" 
                    size={isMobile ? 'middle' : 'large'}
                  />
                </Form.Item>
              </Col>
            </Row>
            
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="password"
                  label="密码"
                  rules={[
                    { required: true, message: '请输入密码' },
                    { min: 6, message: '密码至少6位字符' }
                  ]}
                >
                  <Input.Password 
                    prefix={<LockOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />} 
                    placeholder="请输入密码" 
                    size={isMobile ? 'middle' : 'large'}
                  />
                </Form.Item>
              </Col>
            </Row>
            
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="role"
                  label="角色"
                  rules={[{ required: true, message: '请选择角色' }]}
                >
                  <Select 
                    placeholder="请选择角色" 
                    size={isMobile ? 'middle' : 'large'}
                  >
                    <Option value="管理员">管理员</Option>
                    <Option value="编辑">编辑</Option>
                    <Option value="查看者">查看者</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="status"
                  label="状态"
                  rules={[{ required: true, message: '请选择状态' }]}
                >
                  <Select 
                    placeholder="请选择状态" 
                    size={isMobile ? 'middle' : 'large'}
                  >
                    <Option value="1">已激活</Option>
                    <Option value="0">未激活</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
        
        {/* 移动端用户详情抽屉 */}
        <Drawer
          title="用户详情"
          placement="right"
          onClose={() => setIsDrawerVisible(false)}
          open={isDrawerVisible}
          width={isMobile ? '100%' : 400}
          className="user-drawer"
          extra={
            <Space>
              <Button 
                icon={<EditOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />} 
                onClick={() => {
                  setIsDrawerVisible(false);
                  showEditModal(currentUser!);
                }}
              />
              <Popconfirm
                title="确定要删除此用户吗?"
                onConfirm={() => handleDelete(currentUser!.id)}
                okText="确定"
                cancelText="取消"
              >
                <Button 
                  icon={<DeleteOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />} 
                  danger 
                />
              </Popconfirm>
            </Space>
          }
        >
          {currentUser && (
            <Descriptions column={1} bordered>
              <Descriptions.Item label="用户名">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar 
                    style={{ backgroundColor: '#1890ff', marginRight: 8 }} 
                    icon={<UserOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />} 
                  />
                  <span>{currentUser.username}</span>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="手机号">{currentUser.phone}</Descriptions.Item>
              <Descriptions.Item label="角色">
                {renderRoleTag(currentUser.role)}
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                {renderStatusTag(currentUser.status)}
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {currentUser.createdAt}
              </Descriptions.Item>
            </Descriptions>
          )}
        </Drawer>
      </div>
      
      {!isMobile && (
        <>
          <Divider style={{ margin: '40px 0 24px' }} />
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Text type="secondary">用户管理系统 © 2023 版权所有 | 移动端优化版</Text>
          </div>
        </>
      )}
    </div>
  );
};

export default UserManagement;