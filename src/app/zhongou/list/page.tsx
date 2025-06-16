"use client";


import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  Card, 
  Row, 
  Col, 
  Tag, 
  Popconfirm, 
  message,
  Typography,
  Avatar,
  Divider,
  Space,
  Descriptions,
  Tabs,
  Collapse,
  InputNumber
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  UserOutlined,
  HeartOutlined,
  HistoryOutlined,
  DashboardOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { Panel } = Collapse;
const { TabPane } = Tabs;
const { MonthPicker } = DatePicker;

// 定义健康信息数据类型
interface HealthInfo {
  id: number;
  name: string;
  gender: 'male' | 'female';
  birthDate: string;
  phone: string;
  idNumber: string;
  address: string;
  bloodType: string;
  rhBloodType: string;
  height: number;
  weight: number;
  temperature: number;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  heartRate: number;
  pulseOxygen: number;
  psScore?: number;
  exerciseScore?: number;
  currentDiseases?: string;
  currentMedications?: string;
  healthSupplements?: string;
  dailyHealthCare?: string[];
  pastDiseases?: string;
  surgeryHistory?: string;
  allergyHistory?: string;
  familyDiseases?: string[];
  hospitalizationHistory?: string;
  createdAt: string;
  updatedAt: string;
}

// 表单数据类型
interface HealthFormValues {
  name: string;
  gender: 'male' | 'female';
  birthDate: string;
  phone: string;
  idNumber: string;
  address: string;
  bloodType: string;
  rhBloodType: string;
  height: number;
  weight: number;
  temperature: number;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  heartRate: number;
  pulseOxygen: number;
  psScore?: number;
  exerciseScore?: number;
  currentDiseases?: string;
  currentMedications?: string;
  healthSupplements?: string;
  dailyHealthCare?: string[];
  pastDiseases?: string;
  surgeryHistory?: string;
  allergyHistory?: string;
  familyDiseases?: string[];
  hospitalizationHistory?: string;
}

// 模拟健康信息数据
const initialHealthData: HealthInfo[] = [
  {
    id: 1,
    name: '张明',
    gender: 'male',
    birthDate: '1985-05-15',
    phone: '13800138000',
    idNumber: '110105198505150012',
    address: '北京市朝阳区建国路88号',
    bloodType: 'A',
    rhBloodType: 'positive',
    height: 175,
    weight: 70,
    temperature: 36.5,
    bloodPressure: {
      systolic: 120,
      diastolic: 80
    },
    heartRate: 75,
    pulseOxygen: 98,
    psScore: 1,
    exerciseScore: 8,
    currentDiseases: '高血压, 轻度脂肪肝',
    currentMedications: '阿司匹林, 每日1次每次100mg, 已用2年, 无不良反应',
    healthSupplements: '维生素C, 每日1粒, 已用6个月',
    dailyHealthCare: ['快步走', '游泳'],
    pastDiseases: '阑尾炎(2010年)',
    surgeryHistory: '阑尾切除术(2010年)',
    allergyHistory: '青霉素',
    familyDiseases: ['高血压', '心脏病'],
    hospitalizationHistory: '2010年阑尾炎手术住院',
    createdAt: '2023-01-10',
    updatedAt: '2023-06-15'
  },
  {
    id: 2,
    name: '李华',
    gender: 'female',
    birthDate: '1990-08-20',
    phone: '13900139000',
    idNumber: '110105199008200023',
    address: '北京市海淀区中关村大街1号',
    bloodType: 'B',
    rhBloodType: 'positive',
    height: 165,
    weight: 55,
    temperature: 36.7,
    bloodPressure: {
      systolic: 110,
      diastolic: 70
    },
    heartRate: 72,
    pulseOxygen: 99,
    psScore: 0,
    exerciseScore: 9,
    currentDiseases: '无',
    currentMedications: '无',
    healthSupplements: '钙片, 每日1粒, 已用3个月',
    dailyHealthCare: ['瑜伽', '跑步'],
    pastDiseases: '无',
    surgeryHistory: '无',
    allergyHistory: '无',
    familyDiseases: ['糖尿病'],
    hospitalizationHistory: '无',
    createdAt: '2023-02-15',
    updatedAt: '2023-05-20'
  },
  {
    id: 3,
    name: '王芳',
    gender: 'female',
    birthDate: '1978-03-10',
    phone: '13700137000',
    idNumber: '110105197803100034',
    address: '北京市西城区西长安街1号',
    bloodType: 'O',
    rhBloodType: 'negative',
    height: 160,
    weight: 60,
    temperature: 36.8,
    bloodPressure: {
      systolic: 130,
      diastolic: 85
    },
    heartRate: 78,
    pulseOxygen: 97,
    psScore: 2,
    exerciseScore: 6,
    currentDiseases: '糖尿病, 高血脂',
    currentMedications: '二甲双胍, 每日2次每次500mg, 已用1年, 偶有胃肠道不适',
    healthSupplements: '鱼油, 每日1粒, 已用1年',
    dailyHealthCare: ['太极'],
    pastDiseases: '胆囊炎(2015年)',
    surgeryHistory: '胆囊切除术(2015年)',
    allergyHistory: '磺胺类药物',
    familyDiseases: ['高血压', '糖尿病'],
    hospitalizationHistory: '2015年胆囊炎手术住院',
    createdAt: '2023-03-05',
    updatedAt: '2023-06-10'
  }
];

const HealthInfoList: React.FC = () => {
  const [healthData, setHealthData] = useState<HealthInfo[]>([]);
  const [filteredData, setFilteredData] = useState<HealthInfo[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentRecord, setCurrentRecord] = useState<HealthInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('basic');
  const [form] = Form.useForm<HealthFormValues>();
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
    setLoading(true);
    // 模拟API请求
    setTimeout(() => {
      setHealthData(initialHealthData);
      setFilteredData(initialHealthData);
      setLoading(false);
    }, 800);
  }, []);

  // 处理搜索
  useEffect(() => {
    if (searchTerm) {
      const filtered = healthData.filter(record => 
        record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.phone.includes(searchTerm) ||
        record.idNumber.includes(searchTerm)
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(healthData);
    }
  }, [searchTerm, healthData]);

  // 显示添加模态框
  const showAddModal = () => {
    setCurrentRecord(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // 显示编辑模态框
  const showEditModal = (record: HealthInfo) => {
    setCurrentRecord(record);
    form.setFieldsValue({
      ...record,
      birthDate: record.birthDate,
      bloodPressure: record.bloodPressure
    });
    setIsModalVisible(true);
  };

  // 处理表单提交
  const handleSubmit = () => {
    form.validateFields().then((values: HealthFormValues) => {
      setLoading(true);
      
      // 模拟API请求
      setTimeout(() => {
        if (currentRecord) {
          // 更新记录
          const updatedData = healthData.map(record => 
            record.id === currentRecord.id ? 
            { 
              ...record, 
              ...values,
              updatedAt: new Date().toISOString().split('T')[0]
            } : 
            record
          );
          setHealthData(updatedData);
          message.success('健康信息更新成功');
        } else {
          // 添加新记录
          const newRecord: HealthInfo = {
            id: healthData.length + 1,
            ...values,
            createdAt: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0]
          };
          setHealthData([...healthData, newRecord]);
          message.success('健康信息添加成功');
        }
        
        setLoading(false);
        setIsModalVisible(false);
      }, 600);
    });
  };

  // 删除记录
  const handleDelete = (id: number) => {
    setLoading(true);
    // 模拟API请求
    setTimeout(() => {
      const updatedData = healthData.filter(record => record.id !== id);
      setHealthData(updatedData);
      setLoading(false);
      message.success('健康信息删除成功');
    }, 600);
  };

  // 渲染基本信息卡片
  const renderBasicInfoCard = (record: HealthInfo) => (
    <Card 
      title="基本信息" 
      bordered={false} 
      style={{ marginBottom: 16 }}
      size="small"
    >
      <Descriptions column={1} size="small">
        <Descriptions.Item label="姓名">{record.name}</Descriptions.Item>
        <Descriptions.Item label="性别">
          {record.gender === 'male' ? '男' : '女'}
        </Descriptions.Item>
        <Descriptions.Item label="出生日期">{record.birthDate}</Descriptions.Item>
        <Descriptions.Item label="电话">{record.phone}</Descriptions.Item>
        <Descriptions.Item label="血型">
          {record.bloodType}型 {record.rhBloodType === 'positive' ? 'Rh阳性' : 'Rh阴性'}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );

  // 渲染健康指标卡片
  const renderHealthMetricsCard = (record: HealthInfo) => (
    <Card 
      title="健康指标" 
      bordered={false} 
      style={{ marginBottom: 16 }}
      size="small"
    >
      <Descriptions column={2} size="small">
        <Descriptions.Item label="身高">{record.height} cm</Descriptions.Item>
        <Descriptions.Item label="体重">{record.weight} kg</Descriptions.Item>
        <Descriptions.Item label="体温">{record.temperature} °C</Descriptions.Item>
        <Descriptions.Item label="血压">
          {record.bloodPressure.systolic}/{record.bloodPressure.diastolic} mmHg
        </Descriptions.Item>
        <Descriptions.Item label="心率">{record.heartRate} 次/分钟</Descriptions.Item>
        <Descriptions.Item label="脉氧">{record.pulseOxygen} %</Descriptions.Item>
      </Descriptions>
    </Card>
  );

  // 渲染健康状态卡片
  const renderHealthStatusCard = (record: HealthInfo) => (
    <Card 
      title="健康状态" 
      bordered={false} 
      style={{ marginBottom: 16 }}
      size="small"
    >
      <Descriptions column={1} size="small">
        <Descriptions.Item label="cancer-PS评分">
          {record.psScore !== undefined ? `${record.psScore}分` : '未记录'}
        </Descriptions.Item>
        <Descriptions.Item label="运动能力评分">
          {record.exerciseScore !== undefined ? `${record.exerciseScore}分` : '未记录'}
        </Descriptions.Item>
        <Descriptions.Item label="现有疾病">
          {record.currentDiseases || '无'}
        </Descriptions.Item>
        <Descriptions.Item label="现服用药物">
          {record.currentMedications || '无'}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );

  // 表格列定义
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: HealthInfo) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            style={{ backgroundColor: '#1890ff', marginRight: 8 }} 
            icon={<UserOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />} 
          />
          <div>
            <div style={{ fontWeight: 500 }}>{text}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.gender === 'male' ? '男' : '女'} | {record.phone}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: '基本信息',
      key: 'basic',
      responsive: ['md'] as any,
      render: (_: any, record: HealthInfo) => (
        <div>
          <Text>血型: {record.bloodType}型 {record.rhBloodType === 'positive' ? 'Rh+' : 'Rh-'}</Text>
          <br />
          <Text>年龄: {new Date().getFullYear() - new Date(record.birthDate).getFullYear()}岁</Text>
        </div>
      ),
    },
    {
      title: '健康指标',
      key: 'metrics',
      responsive: ['lg'] as any,
      render: (_: any, record: HealthInfo) => (
        <div>
          <Text>血压: {record.bloodPressure.systolic}/{record.bloodPressure.diastolic}</Text>
          <br />
          <Text>BMI: {(record.weight / ((record.height / 100) ** 2)).toFixed(1)}</Text>
        </div>
      ),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      responsive: ['xl'] as any,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: HealthInfo) => (
        <Space>
          <Button 
            icon={<EditOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />} 
            onClick={() => showEditModal(record)}
            size="small"
          />
          <Popconfirm
            title="确定要删除此记录吗?"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              icon={<DeleteOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />} 
              danger 
              size="small"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: isMobile ? 12 : 24, maxWidth: 1400, margin: '0 auto' }}>
      <Card 
        bordered={false} 
        style={{ 
          borderRadius: 12, 
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          background: 'linear-gradient(135deg, #fafafa 0%, #f0f2f5 100%)'
        }}
      >
        <Title level={4} style={{ marginBottom: 24, color: '#1890ff' }}>
          <HeartOutlined style={{ marginRight: 12 }} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
          个人健康信息管理
        </Title>
        
        <Row justify="space-between" style={{ marginBottom: 24 }}>
          <Col xs={24} sm={16} md={12} lg={8}>
            <Input
              placeholder="搜索姓名、电话或身份证号..."
              prefix={<SearchOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
              size={isMobile ? 'middle' : 'large'}
            />
          </Col>
          <Col xs={24} sm={8} style={{ textAlign: isMobile ? 'center' : 'right', marginTop: isMobile ? 16 : 0 }}>
            <Button 
              type="primary" 
              icon={<PlusOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />} 
              onClick={showAddModal}
              size={isMobile ? 'middle' : 'large'}
              style={{ 
                width: isMobile ? '100%' : 'auto',
                background: 'linear-gradient(45deg, #1890ff, #40a9ff)', 
                border: 'none' 
              }}
            >
              {isMobile ? '添加记录' : '添加健康信息'}
            </Button>
          </Col>
        </Row>
        
        {isMobile ? (
          <Collapse accordion>
            {filteredData.map(record => (
              <Panel 
                key={record.id}
                header={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar 
                      style={{ backgroundColor: '#1890ff', marginRight: 8 }} 
                      icon={<UserOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />} 
                    />
                    <div>
                      <div style={{ fontWeight: 500 }}>{record.name}</div>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {record.gender === 'male' ? '男' : '女'} | {record.phone}
                      </Text>
                    </div>
                  </div>
                }
                extra={
                  <Space>
                    <Button 
                      icon={<EditOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />} 
                      onClick={(e) => {
                        e.stopPropagation();
                        showEditModal(record);
                      }}
                      size="small"
                      type="text"
                    />
                    <Popconfirm
                      title="确定要删除此记录吗?"
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
                        type="text"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Popconfirm>
                  </Space>
                }
              >
                {renderBasicInfoCard(record)}
                {renderHealthMetricsCard(record)}
                {renderHealthStatusCard(record)}
              </Panel>
            ))}
          </Collapse>
        ) : (
          <Table 
            columns={columns} 
            dataSource={filteredData} 
            rowKey="id"
            loading={loading}
            pagination={{ 
              pageSize: 6,
              showSizeChanger: false,
              showTotal: (total) => `共 ${total} 条记录`,
              position: ['bottomCenter'] as any
            }}
            scroll={{ x: true }}
            bordered
            expandable={{
              expandedRowRender: (record) => (
                <div style={{ margin: 0 }}>
                  <Tabs defaultActiveKey="basic" onChange={setActiveTab}>
                    <TabPane tab="基本信息" key="basic">
                      {renderBasicInfoCard(record)}
                    </TabPane>
                    <TabPane tab="健康指标" key="metrics">
                      {renderHealthMetricsCard(record)}
                    </TabPane>
                    <TabPane tab="健康状态" key="status">
                      {renderHealthStatusCard(record)}
                    </TabPane>
                  </Tabs>
                </div>
              ),
              rowExpandable: () => true
            }}
          />
        )}
      </Card>
      
      {/* 添加/编辑健康信息模态框 */}
      <Modal
        title={currentRecord ? "编辑健康信息" : "添加健康信息"}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={loading}
        width={isMobile ? '90%' : 800}
        bodyStyle={{ padding: isMobile ? '16px' : '24px' }}
        destroyOnClose
      >
        <Tabs defaultActiveKey="basic" onChange={setActiveTab}>
          <TabPane tab="个人信息" key="basic">
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="name"
                  label="姓名"
                  rules={[{ required: true, message: '请输入姓名' }]}
                >
                  <Input placeholder="请输入姓名" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="gender"
                  label="性别"
                  rules={[{ required: true, message: '请选择性别' }]}
                >
                  <Select placeholder="请选择性别">
                    <Option value="male">男</Option>
                    <Option value="female">女</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="birthDate"
                  label="出生年月"
                  rules={[{ required: true, message: '请选择出生年月' }]}
                >
                  <MonthPicker placeholder="选择年月" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="phone"
                  label="电话"
                  rules={[
                    { required: true, message: '请输入电话号码' },
                    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }
                  ]}
                >
                  <Input placeholder="请输入手机号" />
                </Form.Item>
              </Col>
            </Row>
            
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="idNumber"
                  label="身份证号"
                  rules={[
                    { required: true, message: '请输入身份证号' },
                    { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '身份证格式不正确' }
                  ]}
                >
                  <Input placeholder="请输入身份证号" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="address"
                  label="住址"
                >
                  <Input placeholder="请输入住址" />
                </Form.Item>
              </Col>
            </Row>
            
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="bloodType"
                  label="血型"
                >
                  <Select placeholder="请选择血型">
                    <Option value="A">A型</Option>
                    <Option value="B">B型</Option>
                    <Option value="O">O型</Option>
                    <Option value="AB">AB型</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="rhBloodType"
                  label="Rh血型"
                >
                  <Select placeholder="请选择Rh血型">
                    <Option value="positive">Rh阳性</Option>
                    <Option value="negative">Rh阴性</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </TabPane>
          
          <TabPane tab="健康指标" key="metrics">
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name={['bloodPressure', 'systolic']}
                  label="收缩压(高压)"
                  rules={[{ pattern: /^\d{2,3}$/, message: '请输入正确值' }]}
                >
                  <Input placeholder="收缩压" suffix="mmHg" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name={['bloodPressure', 'diastolic']}
                  label="舒张压(低压)"
                  rules={[{ pattern: /^\d{2,3}$/, message: '请输入正确值' }]}
                >
                  <Input placeholder="舒张压" suffix="mmHg" />
                </Form.Item>
              </Col>
            </Row>
            
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item
                  name="height"
                  label="身高"
                >
                  <Input placeholder="身高" suffix="cm" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name="weight"
                  label="体重"
                >
                  <Input placeholder="体重" suffix="kg" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name="temperature"
                  label="体温"
                >
                  <Input placeholder="体温" suffix="°C" />
                </Form.Item>
              </Col>
            </Row>
            
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="heartRate"
                  label="心率"
                >
                  <Input placeholder="心率" suffix="次/分钟" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="pulseOxygen"
                  label="脉氧"
                >
                  <Input placeholder="脉氧" suffix="%" />
                </Form.Item>
              </Col>
            </Row>
          </TabPane>
          
          <TabPane tab="健康状态" key="status">
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="psScore"
                  label="cancer-PS评分"
                >
                  <Select placeholder="请选择PS评分">
                    {[0, 1, 2, 3, 4, 5].map(score => (
                      <Option key={score} value={score}>{score}分</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="exerciseScore"
                  label="运动能力评分"
                >
                  <InputNumber 
                    min={0} 
                    max={10} 
                    style={{ width: '100%' }} 
                    placeholder="0-10分" 
                  />
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item
              name="currentDiseases"
              label="现有疾病"
            >
              <Input.TextArea 
                placeholder="请输入当前患有的疾病" 
                rows={3} 
              />
            </Form.Item>
            
            <Form.Item
              name="currentMedications"
              label="现服用药物"
            >
              <Input.TextArea 
                placeholder="格式：药物名称，用法用量，使用时长，不良反应" 
                rows={3} 
              />
            </Form.Item>
            
            <Form.Item
              name="healthSupplements"
              label="保健品使用"
            >
              <Input.TextArea 
                placeholder="格式：保健品名称，用法用量，使用时长" 
                rows={3} 
              />
            </Form.Item>
          </TabPane>
        </Tabs>
      </Modal>
      
      <Divider style={{ margin: '40px 0 24px' }} />
      
      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <Text type="secondary">个人健康信息管理系统 © 2023 版权所有</Text>
      </div>
    </div>
  );
};

export default HealthInfoList;