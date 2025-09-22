'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Table, Button, Modal, Form, Input, Select, 
  Popconfirm, Tag, Row, Col, Divider,
  Upload, message, Card, Tabs, Collapse, 
  InputNumber, Checkbox, Slider, Space
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, 
  SearchOutlined, UserOutlined, HeartOutlined, 
  FileTextOutlined, HistoryOutlined, DashboardOutlined, 
  UploadOutlined, ArrowRightOutlined, MinusCircleOutlined
} from '@ant-design/icons';
import dayjs, { type Dayjs } from 'dayjs';
import type { UploadFile } from 'antd';
import type { UploadProps, UploadChangeParam } from 'antd/es/upload';

const { TabPane } = Tabs;
const { Option } = Select;
const { Panel } = Collapse;
const { TextArea } = Input;

// 定义接口
interface BloodPressure {
  systolic: string;
  diastolic: string;
}

interface Medication {
  drugName: string;
  dosage: string;
}

interface HealthInfo {
  id: string;
  name: string;
  gender: string;
  birthDate: string;
  phone: string;
  idNumber: string;
  medicareNumber?: string;
  address?: string;
  maritalStatus?: string;
  livingStatus?: string;
  childrenStatus?: string;
  bloodType?: string;
  rhBloodType?: string;
  height?: number;
  weight?: number;
  temperature?: number;
  bloodPressure?: BloodPressure;
  heartRate?: number;
  pulseOxygen?: number;
  psScore?: number;
  exerciseScore?: number;
  currentDiseases?: string;
  currentMedications?: string;
  healthSupplements?: string;
  dailyHealthCare?: string[];
  dailyMedications?: Medication[];
  adverseReactions?: string;
  pastDiseases?: string;
  surgeryHistory?: string;
  allergyHistory?: string;
  familyDiseases?: string[];
  otherFamilyDisease?: string;
  hospitalizationHistory?: string;
  lucaReportDescription?: string;
  medicalRecords?: UploadFile[];
  lucaReports?: UploadFile[];
  submitTime: string;
  updatedAt?: string;
}

interface HealthFormValues extends Omit<HealthInfo, 'id' | 'submitTime' | 'updatedAt' | 'birthDate'> {
  birthDate: Dayjs | null;
}

const HealthInfoList: React.FC = () => {
  const router = useRouter();
  const [healthData, setHealthData] = useState<HealthInfo[]>([]);
  const [filteredData, setFilteredData] = useState<HealthInfo[]>([]);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<HealthInfo | null>(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [form] = Form.useForm<HealthFormValues>();
  const formRef = React.useRef<any>(form);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showOtherFamilyDisease, setShowOtherFamilyDisease] = useState<boolean>(false);
  const [medicalRecords, setMedicalRecords] = useState<UploadFile[]>([]);
  const [lucaReports, setLucaReports] = useState<UploadFile[]>([]);
  
  // 每次form更新时也更新ref
  useEffect(() => {
    if (form) {
      formRef.current = form;
    }
  }, [form]);

  // 创建特定字段的上传配置
  const createUploadProps = (fieldName: string) => ({
    beforeUpload: (file: File) => {
      const isImage = file.type.startsWith('image/') || file.type === 'image/jpg';
      if (!isImage) {
        message.error('请上传图片文件！');
      }
      console.log('文件上传前验证:', { fileName: file.name, fileType: file.type, isImage });
      
      // 阻止默认上传行为
      return false;
    },
    maxCount: 5,
    multiple: true,
    accept: 'image/*',
    listType: 'picture-card' as const,
    showUploadList: {
      showPreviewIcon: true,
      showRemoveIcon: true
    },
    // 自定义预览方法，确保使用base64数据进行预览
    previewFile: async (file: File | Blob) => {
      const base64String = await getBase64(file);
      return base64String;
    },
    // 使用顶层定义的处理函数，传入字段名
    onChange: (info: UploadChangeParam<UploadFile<any>>) => handleUploadChange(fieldName, info),
    // 自定义请求处理，阻止自动上传，让表单统一提交
    customRequest: (options: any) => {
      // 模拟上传完成
      setTimeout(() => {
        if (options.onSuccess) {
          options.onSuccess({
            status: 'success'
          });
        }
      }, 0);
    }
  });

  // 响应式布局处理
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 获取当前用户信息
  useEffect(() => {
    const getUserInfo = () => {
      try {
        const user = localStorage.getItem('currentUser');
        if (user) {
          setCurrentUser(JSON.parse(user));
        }
      } catch (error) {
        console.error('解析用户信息失败:', error);
      }
    };

    getUserInfo();
  }, []);

  // 从API获取健康信息数据
  const fetchHealthData = async () => {
    try {
      setLoading(true);
      // 在实际环境中，这里应该调用真实的API
      // const response = await fetch('/rest2/zhongou', {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   }
      // });
      
      // 模拟API响应
      const mockData: HealthInfo[] = [];
      
      setHealthData(mockData);
      setFilteredData(mockData);
      
      // 实际环境中取消下面的注释并注释掉模拟数据
      /*
      const result = await response.json();
      
      if (result.success && result.data) {
        const data = Array.isArray(result.data) ? result.data : [];
        setHealthData(data);
        setFilteredData(data);
      } else {
        console.error('获取数据失败:', result);
        message.error(result.message || '获取健康信息失败');
      }
      */
    } catch (error) {
      console.error('请求异常:', error);
      message.error('获取健康信息失败');
    } finally {
      setLoading(false);
    }
  };

  // 组件加载时获取数据
  useEffect(() => {
    fetchHealthData();
    // 模拟登录用户信息
    setCurrentUser({
      username: 'admin',
      role: '系统管理员'
    });
  }, []);

  // 搜索功能
  const handleSearch = (value: string) => {
    setSearchText(value);
    const filtered = healthData.filter(item => 
      item.name.toLowerCase().includes(value.toLowerCase()) ||
      item.phone.includes(value) ||
      item.idNumber.includes(value)
    );
    setFilteredData(filtered);
  };

  // 显示添加/编辑模态框
  const showModal = (record?: HealthInfo) => {
    if (record) {
      // 编辑模式，跳转到编辑页面
      router.replace(`/zhongou/input?id=${record.id}`);
    } else {
      // 添加模式，显示模态框
      setCurrentRecord(null);
      setActiveTab('basic');
      setMedicalRecords([]);
      setLucaReports([]);
      
      // 重置表单
      form.resetFields();
      setIsModalVisible(true);
    }
  };

  // 添加一个用于测试表单字段值的函数，便于调试
  const debugFormValues = () => {
    if (formRef.current) {
      const medicalRecordsValue = formRef.current.getFieldValue('medicalRecords');
      const lucaReportsValue = formRef.current.getFieldValue('lucaReports');
      
      console.log('调试表单字段值:', {
        medicalRecords: {
          exists: !!medicalRecordsValue,
          count: medicalRecordsValue ? medicalRecordsValue.length : 0,
          data: medicalRecordsValue ? JSON.stringify(medicalRecordsValue) : 'null'
        },
        lucaReports: {
          exists: !!lucaReportsValue,
          count: lucaReportsValue ? lucaReportsValue.length : 0,
          data: lucaReportsValue ? JSON.stringify(lucaReportsValue) : 'null'
        }
      });
    } else {
      console.warn('formRef.current为空，无法获取表单字段值');
    }
  };

  // 处理上传变化
  const handleUploadChange = (fieldName: string, info: UploadChangeParam<UploadFile<any>>) => {
    const { fileList } = info;
    // 更新表单字段值
    form.setFieldsValue({
      [fieldName]: fileList
    });
    
    console.log(`字段${fieldName}的文件上传变化:`, {
      action: info.file.status,
      fileListCount: fileList.length,
      fileNames: fileList.map((file: UploadFile<any>) => file.name).join(', ')
    });
    
    // 更新对应的文件列表状态
    if (fieldName === 'medicalRecords') {
      setMedicalRecords(fileList);
    } else if (fieldName === 'lucaReports') {
      setLucaReports(fileList);
    }
  };

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const formData = await form.validateFields();
      setLoading(true);
      
      // 处理表单数据，特别是日期格式
      const requestBody = {
        ...formData,
        // 转换日期格式
        birthDate: formData.birthDate ? formData.birthDate.format('YYYY-MM') : '',
        // 添加提交时间
        submitTime: new Date().toISOString(),
        // 确保身高字段有值
        height: formData.height || 170,
        // 确保血压字段有值
        bloodPressure: formData.bloodPressure || { systolic: '', diastolic: '' },
        // 添加ID字段
        id: currentRecord?.id || undefined
      };

      // 记录图片数据状态
      console.log('表单提交前的文件状态:', {
        medicalRecords: {
          exists: !!formData.medicalRecords,
          count: formData.medicalRecords ? formData.medicalRecords.length : 0,
          data: formData.medicalRecords ? JSON.stringify(formData.medicalRecords) : 'null'
        },
        lucaReports: {
          exists: !!formData.lucaReports,
          count: formData.lucaReports ? formData.lucaReports.length : 0,
          data: formData.lucaReports ? JSON.stringify(formData.lucaReports) : 'null'
        }
      });

      // 在实际环境中，这里应该调用真实的API
      /*
      const response = await fetch('https://localhost:8008/api/zhongou/health-info', {
        method: currentRecord ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      */

      // 模拟API响应
      const result = {
        success: true,
        message: currentRecord ? '健康信息更新成功！' : '健康信息添加成功！'
      };

      if (result.success) {
        message.success(result.message);
        setIsModalVisible(false);
        // 重新获取数据
        fetchHealthData();
      } else {
        message.error(result.message || (currentRecord ? '更新失败' : '添加失败'));
      }

      // 实际环境中取消下面的注释并注释掉模拟数据
      /*
      const result = await response.json();

      if (result.success) {
        message.success(result.message || (currentRecord ? '健康信息更新成功！' : '健康信息添加成功！'));
        setIsModalVisible(false);
        // 重新获取数据
        fetchHealthData();
      } else {
        message.error(result.message || (currentRecord ? '更新失败' : '添加失败'));
      }
      */
    } catch (error) {
      console.error('表单提交失败:', error);
      message.error('操作失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 删除健康记录
  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      
      // 模拟API响应
      const result = {
        success: true,
        message: '健康信息删除成功！'
      };

      if (result.success) {
        message.success(result.message);
        // 重新获取数据
        fetchHealthData();
      } else {
        message.error(result.message || '删除失败');
      }
      
      // 实际环境中取消下面的注释并注释掉模拟数据
      /*
      const response = await fetch('https://localhost:8008/api/zhongou/health-info', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      });

      const result = await response.json();

      if (result.success) {
        message.success(result.message || '健康信息删除成功！');
        // 重新获取数据
        fetchHealthData();
      } else {
        message.error(result.message || '删除失败');
      }
      */
    } catch (error) {
      console.error('删除失败:', error);
      message.error('删除失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 住院病历上传配置
  const medicalRecordsUploadProps = createUploadProps('medicalRecords');
  
  // Luca报告上传配置
  const lucaReportsUploadProps = createUploadProps('lucaReports');
  
  // 获取base64
const getBase64 = (file: File | Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

  // 渲染基本信息卡片
  const renderBasicInfoCard = (record: HealthInfo) => (
    <Card title="个人信息" className="info-card">
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <p><strong>姓名：</strong>{record.name}</p>
          <p><strong>性别：</strong>{record.gender === 'male' ? '男' : '女'}</p>
          <p><strong>出生年月：</strong>{record.birthDate}</p>
          <p><strong>电话：</strong>{record.phone}</p>
        </Col>
        <Col xs={24} md={12}>
          <p><strong>身份证号：</strong>{record.idNumber}</p>
          <p><strong>住址：</strong>{record.address || '未填写'}</p>
          <p><strong>血型：</strong>{record.bloodType || '未填写'}</p>
          <p><strong>Rh血型：</strong>{record.rhBloodType || '未填写'}</p>
        </Col>
      </Row>
    </Card>
  );

  // 渲染健康指标卡片
  const renderHealthMetricsCard = (record: HealthInfo) => (
    <Card title="健康指标" className="info-card">
      <Row gutter={16}>
        <Col xs={24} md={8}>
          <p><strong>身高：</strong>{record.height || 0} cm</p>
          <p><strong>体重：</strong>{record.weight || 0} kg</p>
          <p><strong>体温：</strong>{record.temperature || 0} °C</p>
        </Col>
        <Col xs={24} md={8}>
          <p><strong>血压：</strong>{record.bloodPressure?.systolic || 0}/{record.bloodPressure?.diastolic || 0} mmHg</p>
          <p><strong>心率：</strong>{record.heartRate || 0} 次/分钟</p>
          <p><strong>脉氧：</strong>{record.pulseOxygen || 0} %</p>
        </Col>
        <Col xs={24} md={8}>
          <p><strong>PS评分：</strong>{record.psScore} 分</p>
          <p><strong>运动能力：</strong>{record.exerciseScore} 分</p>
          <p><strong>提交时间：</strong>{dayjs(record.submitTime).format('YYYY-MM-DD HH:mm')}</p>
        </Col>
      </Row>
    </Card>
  );

  // 渲染健康状态卡片
  const renderHealthStatusCard = (record: HealthInfo) => (
    <Card title="健康状态" className="info-card">
      <Row gutter={16}>
        <Col span={24}>
          <p><strong>现有疾病：</strong>{record.currentDiseases || '无'}</p>
          <p><strong>现服用药物：</strong>{record.currentMedications || '无'}</p>
          <p><strong>保健品使用：</strong>{record.healthSupplements || '无'}</p>
          <p><strong>日常保健方式：</strong>{record.dailyHealthCare?.join(', ') || '无'}</p>
        </Col>
      </Row>
      <Divider style={{ margin: '16px 0' }} />
      <Row gutter={16}>
        <Col span={24}>
          <p><strong>既往疾病史：</strong>{record.pastDiseases || '无'}</p>
          <p><strong>手术史：</strong>{record.surgeryHistory || '无'}</p>
          <p><strong>过敏史：</strong>{record.allergyHistory || '无'}</p>
          <p><strong>家族病史：</strong>{record.familyDiseases?.join(', ') || '无'}{record.otherFamilyDisease ? `, ${record.otherFamilyDisease}` : ''}</p>
          <p><strong>近3年住院史：</strong>{record.hospitalizationHistory || '无'}</p>
        </Col>
      </Row>
      {record.lucaReportDescription && (
        <>
          <Divider style={{ margin: '16px 0' }} />
          <Row gutter={16}>
            <Col span={24}>
              <p><strong>Luca报告说明：</strong>{record.lucaReportDescription}</p>
            </Col>
          </Row>
        </>
      )}
      
      {/* 显示上传的图片 */}
      {(record.medicalRecords && record.medicalRecords.length > 0) && (
        <>
          <Divider style={{ margin: '16px 0' }} />
          <Row gutter={16}>
            <Col span={24}>
              <p><strong>住院病历图片：</strong></p>
              <Space wrap>
                {record.medicalRecords.map((file: any, index: number) => (
                  <img
                    key={file.uid || index}
                    src={file.url || file.thumbUrl}
                    alt={`Medical Record ${index + 1}`}
                    style={{ width: 100, height: 100, objectFit: 'cover', margin: '0 8px 8px 0' }}
                  />
                ))}
              </Space>
            </Col>
          </Row>
        </>
      )}
      
      {(record.lucaReports && record.lucaReports.length > 0) && (
        <>
          <Divider style={{ margin: '16px 0' }} />
          <Row gutter={16}>
            <Col span={24}>
              <p><strong>Luca报告图片：</strong></p>
              <Space wrap>
                {record.lucaReports.map((file: any, index: number) => (
                  <img
                    key={file.uid || index}
                    src={file.url || file.thumbUrl}
                    alt={`Luca Report ${index + 1}`}
                    style={{ width: 100, height: 100, objectFit: 'cover', margin: '0 8px 8px 0' }}
                  />
                ))}
              </Space>
            </Col>
          </Row>
        </>
      )}
    </Card>
  );

  // 表格列定义
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>
    },
    {
      title: '基本信息',
      key: 'basicInfo',
      render: (_: any, record: HealthInfo) => (
        <div>
          <p>性别：{record.gender === 'male' ? '男' : '女'}</p>
          <p>电话：{record.phone}</p>
          <p>身份证：{record.idNumber}</p>
        </div>
      )
    },
    {
      title: '健康指标',
      key: 'healthMetrics',
      render: (_: any, record: HealthInfo) => (
        <div>
          <p>血压：{record.bloodPressure?.systolic || 0}/{record.bloodPressure?.diastolic || 0} mmHg</p>
          <p>心率：{record.heartRate || 0} 次/分钟</p>
          <p>PS评分：{record.psScore} 分</p>
        </div>
      )
    },
    {
      title: '更新时间',
      dataIndex: 'submitTime',
      key: 'submitTime',
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm')
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: HealthInfo) => (
        <>
          <Button 
            icon={<EditOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />} 
            size="small"
            type="primary"
            onClick={() => showModal(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这条健康信息吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              icon={<DeleteOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />} 
              danger 
              size="small"
              style={{ marginLeft: 8 }}
            >
              删除
            </Button>
          </Popconfirm>
        </>
      )
    }
  ];

  // 日常保健方式选项
  const dailyHealthCareOptions = [
    '定期体检', '有氧运动', '力量训练', '平衡训练',
    '健康饮食', '充足睡眠', '戒烟限酒', '减轻压力'
  ];

  // 家族病史选项
  const familyDiseaseOptions = [
    '高血压', '糖尿病', '冠心病', '脑卒中',
    '恶性肿瘤', '精神疾病', '遗传性疾病', '其他'
  ];

  return (
    <div style={{
      padding: isMobile ? 12 : isTablet ? 16 : 24,
      maxWidth: 1400,
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh'
    }}>
      {/* 页面标题和操作区域 */}
      <div style={{ textAlign: 'center', marginBottom: isMobile ? 16 : 24 }}>
        <h1 style={{ color: '#1890ff', fontWeight: 500, fontSize: isTablet ? '1.5rem' : '1.8rem' }}>个人健康信息管理</h1>
        
        {/* 显示当前登录用户信息 */}
        {currentUser && (
          <div style={{ marginTop: 12, color: '#52c41a' }}>
            <p>管理员：{currentUser.username}（{currentUser.role}）</p>
          </div>
        )}
      </div>

      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ minWidth: isMobile ? '100%' : '250px' }}>
            <Input
              placeholder="搜索姓名、电话或身份证号"
              prefix={<SearchOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
            onClick={() => showModal()}
            style={{ width: isMobile ? '100%' : 'auto' }}
          >
            添加健康信息
          </Button>
        </div>

        {/* 数据展示区域 */}
        {isMobile ? (
          <Collapse defaultActiveKey={[]} style={{ marginTop: 16 }}>
            {filteredData.map((record) => (
              <Panel 
                header={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <span>{record.name} - {record.phone}</span>
                    <>
                      <Button 
                        icon={<EditOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />} 
                        size="small"
                        type="text"
                        onClick={() => showModal(record)}
                      />
                      <Popconfirm
                        title="确定要删除这条健康信息吗？"
                        onConfirm={() => handleDelete(record.id)}
                        okText="确定"
                        cancelText="取消"
                      >
                        <Button 
                          icon={<DeleteOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />} 
                          danger 
                          size="small"
                          type="text"
                          onClick={(e) => e.stopPropagation()}
                          style={{ marginLeft: 8 }}
                        />
                      </Popconfirm>
                    </>
                  </div>
                }
                key={record.id}
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
              pageSize: isTablet ? 4 : 6,
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
        width={isMobile ? '90%' : 900}
        bodyStyle={{ padding: isMobile ? '16px' : '24px' }}
        destroyOnClose
      >
        <Tabs defaultActiveKey="basic" onChange={setActiveTab}>
          <TabPane tab={<span><UserOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /> 个人信息</span>} key="basic">
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
                  <Input placeholder="选择年月" style={{ width: '100%' }} />
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
          
          <TabPane tab={<span><DashboardOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /> 健康指标</span>} key="metrics">
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
                  <InputNumber
                    min={0}
                    max={250}
                    placeholder="身高"
                    addonAfter="cm"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name="weight"
                  label="体重"
                >
                  <InputNumber
                    min={0}
                    max={200}
                    placeholder="体重"
                    addonAfter="kg"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name="temperature"
                  label="体温"
                >
                  <div>
                    <Slider
                      min={35}
                      max={42}
                      step={0.1}
                      value={form.getFieldValue('temperature') || 36.5}
                      onChange={(value) => form.setFieldValue('temperature', value)}
                      tooltip={{ formatter: (value) => `${value}°C` }}
                    />
                    <InputNumber
                      min={35}
                      max={42}
                      step={0.1}
                      value={form.getFieldValue('temperature') || 36.5}
                      onChange={(value) => form.setFieldValue('temperature', value)}
                      style={{ width: 100, marginTop: 16 }}
                      addonAfter="°C"
                    />
                  </div>
                </Form.Item>
              </Col>
            </Row>
            
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="heartRate"
                  label="心率"
                >
                  <InputNumber
                    min={0}
                    max={200}
                    placeholder="心率"
                    addonAfter="次/分钟"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="pulseOxygen"
                  label="脉氧"
                >
                  <InputNumber
                    min={0}
                    max={100}
                    placeholder="脉氧"
                    addonAfter="%"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </TabPane>
          
          <TabPane tab={<span><HistoryOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /> 既往史</span>} key="history">
            <Form.Item
              name="pastDiseases"
              label="既往疾病史"
            >
              <TextArea 
                placeholder="请输入既往患过的疾病"
                rows={3}
              />
            </Form.Item>
            
            <Form.Item
              name="surgeryHistory"
              label="手术史"
            >
              <TextArea 
                placeholder="请输入手术史"
                rows={3}
              />
            </Form.Item>
            
            <Form.Item
              name="allergyHistory"
              label="过敏史"
            >
              <div>
                <Checkbox.Group
                  value={form.getFieldValue('allergyHistory')?.split(',') || []}
                  onChange={(values) => form.setFieldValue('allergyHistory', values.join(','))}
                  style={{ width: '100%', marginBottom: '16px' }}
                >
                  <Row gutter={16}>
                    {['青霉素', '头孢菌素', '磺胺类药物', '红霉素', '链霉素', '阿司匹林', '海鲜', '花粉', '尘螨', '坚果', '其他'].map((item) => (
                      <Col xs={12} sm={8} md={6} key={item}>
                        <Checkbox value={item}>{item}</Checkbox>
                      </Col>
                    ))}
                  </Row>
                </Checkbox.Group>
                <TextArea 
                  placeholder="请补充其他过敏药物或物质"
                  rows={2}
                />
              </div>
            </Form.Item>
            
            <Form.Item
              label="住院病历"
            >
              <Upload {...medicalRecordsUploadProps}>
                <Button 
                  icon={<UploadOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                  size={isTablet ? 'large' : 'middle'}
                >上传图片</Button>
                <div style={{ color: '#999', fontSize: isTablet ? 14 : 12, marginTop: 8 }}>
                  支持上传多张图片（最多5张）
                </div>
              </Upload>
            </Form.Item>
          </TabPane>
          
          <TabPane tab={<span><HeartOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /> 健康状态</span>} key="status">
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
                  <div>
                    <Slider
                      min={0}
                      max={10}
                      value={form.getFieldValue('exerciseScore') || 5}
                      onChange={(value) => form.setFieldValue('exerciseScore', value)}
                      marks={{
                        0: '0',
                        2.5: '弱',
                        5: '中等',
                        7.5: '强',
                        10: '10'
                      }}
                    />
                  </div>
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item
              name="currentDiseases"
              label="现有疾病"
            >
              <TextArea 
                placeholder="请输入当前患有的疾病"
                rows={3}
              />
            </Form.Item>
            
            <Form.Item
              name="currentMedications"
              label="现服用药物"
            >
              <TextArea 
                placeholder="格式：药物名称，用法用量，使用时长，不良反应"
                rows={3}
              />
            </Form.Item>
            
            <Form.Item
              name="healthSupplements"
              label="保健品使用"
            >
              <TextArea 
                placeholder="格式：保健品名称，用法用量，使用时长"
                rows={3}
              />
            </Form.Item>
            
            <Form.Item
              name="dailyHealthCare"
              label="日常保健方式"
            >
              <Checkbox.Group
                value={form.getFieldValue('dailyHealthCare') || []}
                style={{ width: '100%' }}
              >
                <Row gutter={16}>
                  {dailyHealthCareOptions.map((item) => (
                    <Col xs={12} sm={8} md={6} key={item}>
                      <Checkbox value={item}>{item}</Checkbox>
                    </Col>
                  ))}
                </Row>
              </Checkbox.Group>
            </Form.Item>
            
            <Form.Item
              label="家族病史"
            >
              <Checkbox.Group
                value={form.getFieldValue('familyDiseases') || []}
                onChange={(values) => form.setFieldValue('familyDiseases', values)}
                style={{ width: '100%' }}
              >
                <Row gutter={16}>
                  {familyDiseaseOptions.map((item) => (
                    <Col xs={12} sm={8} md={6} key={item}>
                      <Checkbox value={item}>{item}</Checkbox>
                    </Col>
                  ))}
                </Row>
              </Checkbox.Group>
              {form.getFieldValue('familyDiseases')?.includes('其他') && (
                <Form.Item
                  name="otherFamilyDisease"
                  style={{ marginTop: 16 }}
                >
                  <Input placeholder="请说明其他家族病史" />
                </Form.Item>
              )}
            </Form.Item>
            
            <Form.Item
              name="hospitalizationHistory"
              label="近3年住院史"
            >
              <TextArea 
                placeholder="请输入近3年住院史"
                rows={3}
              />
            </Form.Item>
          </TabPane>
          
          <TabPane tab={<span><FileTextOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /> Luca报告</span>} key="luca">
            <Form.Item
              name="lucaReportDescription"
              label="Luca报告说明"
            >
              <TextArea 
                placeholder="请输入Luca报告说明"
                rows={4}
              />
            </Form.Item>
            
            <Form.Item
              label="Luca报告图片"
            >
              <Upload {...lucaReportsUploadProps}>
                  <Button 
                    icon={<UploadOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                    size={isTablet ? 'large' : 'middle'}
                  >上传图片</Button>
                  <div style={{ color: '#999', fontSize: isTablet ? 14 : 12, marginTop: 8 }}>
                    支持上传多张图片（最多5张）
                  </div>
                </Upload>
            </Form.Item>
          </TabPane>
        </Tabs>
      </Modal>

      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>个人健康信息管理系统 © 2023 版权所有</span>
      </div>
    </div>
  );
};

export default HealthInfoList;