"use client";
"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Form,
  Input,
  Select,
  Radio,
  DatePicker,
  Checkbox,
  Card,
  Row,
  Col,
  Button,
  Slider,
  InputNumber,
  Upload,
  message,
  Divider,
  Collapse,
  Tabs
} from 'antd';
import { PlusOutlined,
  MinusCircleOutlined,
  UploadOutlined,
  UserOutlined,
  HeartOutlined,
  HistoryOutlined,
  DashboardOutlined,
  FileTextOutlined
} from '@ant-design/icons'

import dayjs, { type Dayjs } from 'dayjs';
import './antd-custom.css'; // 自定义样式
import type { UploadChangeParam, UploadFile } from 'antd/es/upload';



const { Option } = Select;
const { TextArea } = Input;
const { MonthPicker } = DatePicker;
const { Panel } = Collapse;
const { TabPane } = Tabs;

// 定义用户类型接口
export interface User {
  id: string | number;
  username: string;
  role: string;
  phone?: string;
}

// 定义血压类型接口
interface BloodPressure {
  systolic: string;
  diastolic: string;
}

// 定义药物类型接口
interface Medication {
  drugName: string;
  dosage: string;
}

// 定义表单数据类型接口
interface HealthFormData {
  name: string;
  gender: string;
  birthDate: Dayjs | null; // 使用Dayjs类型替代any
  phone: string;
  idNumber: string;
  medicareNumber?: string;
  address?: string;
  maritalStatus?: string;
  livingStatus?: string;
  childrenStatus?: string;
  bloodType?: string;
  rhBloodType?: string;
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
  medicalRecords?: UploadFile[]; // 使用UploadFile类型替代any[]
  height?: number;
  weight?: number;
  temperature?: number;
  bloodPressure?: BloodPressure;
  heartRate?: number;
  pulseOxygen?: number;
  lucaReports?: UploadFile[]; // 使用UploadFile类型替代any[]
  lucaReportDescription?: string;
  // 提交时间字段
  submitTime?: string;
}

// 获取默认出生日期（当前日期的前20年）
const getDefaultBirthDate = () => {
  const now = new Date();
  const defaultYear = now.getFullYear() - 20;
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${defaultYear}-${month}`;
};

const HealthForm = () => {
  // 使用useRouter进行路由跳转
  const router = useRouter();
  // 确保客户端环境
  const [isClient, setIsClient] = useState<boolean>(false);
  
  useEffect(() => {
    // 确保在客户端环境中设置标记
    setIsClient(true);
  }, []);
  
  const [form] = Form.useForm();
  // 使用useRef保存form实例，确保在闭包中正确引用
  const formRef = React.useRef<any>(form);
  // 提交状态
  const [submitting, setSubmitting] = useState<boolean>(false);
  // 响应式布局状态
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isTablet, setIsTablet] = useState<boolean>(false);
  
  // 家庭疾病其他选项显示状态
  const [showOtherFamilyDisease, setShowOtherFamilyDisease] = useState<boolean>(false);
  
  // 当前激活的标签页
  const [activeTab, setActiveTab] = useState<string>('personal');
  
  // 当前用户信息
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // 每次form更新时也更新ref
  useEffect(() => {
    if (form) {
      formRef.current = form;
      console.log('formRef已更新为当前form实例:', {
        formInstanceId: formRef.current ? '已绑定' : '未绑定',
        hasSetFieldsValue: typeof formRef.current?.setFieldsValue === 'function',
        hasGetFieldValue: typeof formRef.current?.getFieldValue === 'function'
      });
    }
  }, [form]);
  
  // 初始化响应式布局
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };
    
    // 初始化
    handleResize();
    
    // 监听窗口大小变化
    window.addEventListener('resize', handleResize);
    
    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // 初始化用户信息
  useEffect(() => {
    try {
      const userInfo = localStorage.getItem('currentUser');
      if (userInfo) {
        setCurrentUser(JSON.parse(userInfo));
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
    }
  }, []);
  
  // 健康保险选项
  const healthCareOptions = ['基本医疗保险', '商业健康保险', '无保险'];
  
  // 家族疾病选项
  const familyDiseases = ['高血压', '糖尿病', '冠心病', '脑卒中', '肿瘤', '其他'] as const;
  
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
  
  // 创建特定字段的上传配置
  const createUploadProps = (fieldName: string) => ({
    beforeUpload: (file: File) => {
      const isImage = file.type.startsWith('image/');
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
    listType: 'picture-card' as const, // 设置为图片卡片样式，显示预览，使用const断言确保类型正确性
    showUploadList: {
      showPreviewIcon: true,
      showRemoveIcon: true
    },
    // 自定义预览方法，确保使用base64数据进行预览
    previewFile: async (file: UploadFile<any>) => {
      if (file.originFileObj) {
        const base64String = await getBase64(file.originFileObj);
        return base64String;
      }
      return file.url || file.preview;
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
  
  // 获取文件的base64编码
  const getBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
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
      fileNames: fileList.map(file => file.name).join(', ')
    });
  };
  
  // 住院病历上传配置
  const medicalRecordsUploadProps = createUploadProps('medicalRecords');
  
  // Luca报告上传配置
    const lucaReportsUploadProps = createUploadProps('lucaReports');
    
    // 表单提交处理
    const onFinish = async (values: any) => {
      try {
        // 设置提交状态为true
        setSubmitting(true);
        
        // 处理表单数据，特别是日期格式
        const formData = {
          ...values,
          // 转换日期格式
          birthDate: values.birthDate ? values.birthDate.format('YYYY-MM') : '',
          // 添加提交时间
          submitTime: new Date().toISOString(),
          // 确保身高字段有值
          height: values.height || 170
        };
        
        // 记录图片数据状态
        console.log('表单提交前的文件状态:', {
          medicalRecords: {
            exists: !!values.medicalRecords,
            count: values.medicalRecords ? values.medicalRecords.length : 0,
            data: values.medicalRecords ? JSON.stringify(values.medicalRecords) : 'null'
          },
          lucaReports: {
            exists: !!values.lucaReports,
            count: values.lucaReports ? values.lucaReports.length : 0,
            data: values.lucaReports ? JSON.stringify(values.lucaReports) : 'null'
          }
        });
        
        // 构建请求体，包含操作类型和表单数据
        const requestBody = {
          action: 'submitHealthInfo',
          formData
        };
        
        // 发送POST请求到API
        const response = await fetch('/rest2/zhongou', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });
        
        const result = await response.json();
        
        // 处理响应结果
        if (result.success) {
          message.success('健康信息提交成功！');
          
          // 打印调试信息
          console.log('表单提交成功，正在跳转...');
          debugFormValues();
          
          // 延迟1秒后跳转，确保用户能看到成功提示
          setTimeout(() => {
            // 获取当前用户信息
            const currentUser = localStorage.getItem('currentUser');
            
            // 构建查询参数
            let queryParams = '';
            if (currentUser) {
              try {
                const userInfo = JSON.parse(currentUser);
                queryParams = `?userId=${userInfo.id}&username=${userInfo.username}&role=${userInfo.role}&phone=${userInfo.phone}`;
              } catch (error) {
                console.error('解析用户信息失败:', error);
              }
            }
            
            // 确保在客户端环境中进行路由跳转
            if (isClient) {
              router.replace(`/zhongou/list${queryParams}`);
            }
          }, 1000);
        } else {
          message.error(result.message || '提交失败，请重试');
          console.error('提交失败:', result);
        }
      } catch (error) {
        console.error('提交过程发生错误:', error);
        message.error('提交失败，请检查网络连接后重试');
      } finally {
        // 无论成功失败，都要将提交状态设为false
        setSubmitting(false);
      }
    };
    
    // 个人信息部分
  const renderPersonalInfo = () => (
    <Card 
      title={<><UserOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /> 个人信息</>} 
      className="form-section-card"
      bordered={false}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8} lg={8} xl={6}>
          <Form.Item
            label="姓名"
            name="name"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input 
              placeholder="请输入姓名" 
              style={{ 
                height: isTablet ? 40 : 32,
                fontSize: isTablet ? 16 : 14
              }}
            />
          </Form.Item>
        </Col>
        
        <Col xs={24} md={8} lg={8} xl={6}>
          <Form.Item
            label="性别"
            name="gender"
            rules={[{ required: true, message: '请选择性别' }]}
          >
            <Select 
              placeholder="请选择性别" 
              style={{ 
                width: '100%',
                height: isTablet ? 40 : 32,
                fontSize: isTablet ? 16 : 14
              }}
            >
              <Option value="male">男</Option>
              <Option value="female">女</Option>
            </Select>
          </Form.Item>
        </Col>
        
        <Col xs={24} md={8} lg={8} xl={6}>
          <Form.Item
            label="出生年月"
            name="birthDate"
            rules={[{ required: true, message: '请选择出生年月' }]}
          >
            <MonthPicker 
              placeholder="选择年月" 
              style={{ 
                width: '100%',
                height: isTablet ? 40 : 32,
                fontSize: isTablet ? 16 : 14
              }} 
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8} lg={8} xl={6}>
          <Form.Item
            label="电话"
            name="phone"
            rules={[
              { required: true, message: '请输入电话号码' },
              { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }
            ]}
          >
            <Input 
              placeholder="请输入手机号" 
              style={{ 
                height: isTablet ? 40 : 32,
                fontSize: isTablet ? 16 : 14
              }}
            />
          </Form.Item>
        </Col>
        
        <Col xs={24} md={8} lg={8} xl={6}>
          <Form.Item
            label="身份证号"
            name="idNumber"
            rules={[
              { required: true, message: '请输入身份证号' },
              { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '身份证格式不正确' }
            ]}
          >
            <Input 
              placeholder="请输入身份证号" 
              style={{ 
                height: isTablet ? 40 : 32,
                fontSize: isTablet ? 16 : 14
              }}
            />
          </Form.Item>
        </Col>
        
        <Col xs={24} md={8} lg={8} xl={6}>
          <Form.Item
            label="医保号"
            name="medicareNumber"
          >
            <Input 
              placeholder="请输入医保号" 
              style={{ 
                height: isTablet ? 40 : 32,
                fontSize: isTablet ? 16 : 14
              }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Form.Item
            label="住址"
            name="address"
          >
            <Input 
              placeholder="请输入详细住址" 
              style={{ 
                height: isTablet ? 40 : 32,
                fontSize: isTablet ? 16 : 14
              }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8} lg={8} xl={6}>
          <Form.Item
            label="婚姻情况"
            name="maritalStatus"
          >
            <Select 
              placeholder="请选择婚姻状况" 
              style={{ 
                width: '100%',
                height: isTablet ? 40 : 32,
                fontSize: isTablet ? 16 : 14
              }}
            >
              <Option value="married">已婚</Option>
              <Option value="unmarried">未婚</Option>
              <Option value="widowed">丧偶</Option>
              <Option value="divorced">离异</Option>
            </Select>
          </Form.Item>
        </Col>
        
        <Col xs={24} md={8} lg={8} xl={6}>
          <Form.Item
            label="居住情况"
            name="livingStatus"
          >
            <Select 
              placeholder="请选择居住情况" 
              style={{ 
                width: '100%',
                height: isTablet ? 40 : 32,
                fontSize: isTablet ? 16 : 14
              }}
            >
              <Option value="withFamily">和家人同住</Option>
              <Option value="alone">独居</Option>
            </Select>
          </Form.Item>
        </Col>
        
        <Col xs={24} md={8} lg={8} xl={6}>
          <Form.Item
            label="子女情况"
            name="childrenStatus"
          >
            <Select 
              placeholder="请选择子女情况" 
              style={{ 
                width: '100%',
                height: isTablet ? 40 : 32,
                fontSize: isTablet ? 16 : 14
              }}
            >
              <Option value="none">无</Option>
              <Option value="one">1子女</Option>
              <Option value="two">2子女</Option>
              <Option value="three">3子女</Option>
              <Option value="other">其他</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} lg={12} xl={9}>
          <Form.Item
            label="血型"
            name="bloodType"
          >
            <Select 
              placeholder="请选择血型" 
              style={{ 
                width: '100%',
                height: isTablet ? 40 : 32,
                fontSize: isTablet ? 16 : 14
              }}
            >
              <Option value="A">A型</Option>
              <Option value="B">B型</Option>
              <Option value="O">O型</Option>
              <Option value="AB">AB型</Option>
              <Option value="other">其他</Option>
              <Option value="unknown">不详</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} md={12} lg={12} xl={9}>
          <Form.Item
            label="Rh血型"
            name="rhBloodType"
          >
            <Select 
              placeholder="请选择Rh血型" 
              style={{ 
                width: '100%',
                height: isTablet ? 40 : 32,
                fontSize: isTablet ? 16 : 14
              }}
            >
              <Option value="positive">Rh阳性</Option>
              <Option value="negative">Rh阴性</Option>
              <Option value="unknown">不详</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );

  // 基本健康信息部分
  const renderHealthInfo = () => (
    <Card 
      title={<><HeartOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /> 基本健康信息</>} 
      className="form-section-card"
      bordered={false}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8} lg={8} xl={6}>
          <Form.Item
            label="cancer-PS评分"
            name="psScore"
            tooltip="肿瘤患者的体能状况评分"
          >
            <Select 
              placeholder="请选择PS评分" 
              style={{
                width: '100%',
                height: isTablet ? 40 : 32,
                fontSize: isTablet ? 16 : 14
              }}
            >
              {[0, 1, 2, 3, 4, 5].map(score => (
                <Option key={score} value={score}>{score}分</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        
        <Col xs={24} md={8} lg={8} xl={6}>
          <Form.Item
            label="运动能力评分"
            name="exerciseScore"
            tooltip="自我评估运动能力（0-10分）"
          >
            <InputNumber 
              min={0} 
              max={10} 
              style={{
                width: '100%',
                height: isTablet ? 40 : 32,
                fontSize: isTablet ? 16 : 14
              }} 
              placeholder="0-10分" 
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Form.Item
            label="现有疾病"
            name="currentDiseases"
            tooltip="请输入当前患有的疾病"
          >
            <TextArea 
              placeholder="请输入疾病名称，多个疾病用逗号分隔" 
              rows={isTablet ? 4 : 3} 
              style={{ fontSize: isTablet ? 16 : 14 }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Form.Item
            label="现服用药物"
            name="currentMedications"
          >
            <TextArea 
              placeholder="格式：药物名称，用法用量，使用时长，不良反应（如：阿司匹林，每日1次每次100mg，已用2年，无不良反应）" 
              rows={isTablet ? 4 : 3} 
              style={{ fontSize: isTablet ? 16 : 14 }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Form.Item
            label="保健品使用"
            name="healthSupplements"
          >
            <TextArea 
              placeholder="格式：保健品名称，用法用量，使用时长（如：维生素C，每日1粒，已用6个月）" 
              rows={isTablet ? 4 : 3} 
              style={{ fontSize: isTablet ? 16 : 14 }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Form.Item
            label="日常保健方式"
            name="dailyHealthCare"
          >
            <Select 
              mode="multiple"
              placeholder="请选择或输入日常保健方式"
              options={healthCareOptions.map(item => ({ value: item, label: item }))}
              optionFilterProp="label"
              allowClear
              showSearch
              style={{
                width: '100%',
                minHeight: isTablet ? 40 : 32,
                fontSize: isTablet ? 16 : 14
              }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Divider orientation="left" plain>日常口服药物</Divider>
      <Form.List name="dailyMedications">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Row gutter={[16, 16]} key={key} style={{ marginBottom: 16 }}>
                <Col xs={24} md={10} lg={10} xl={9}>
                  <Form.Item
                    {...restField}
                    name={[name, 'drugName']}
                    label={`药物 ${name + 1}`}
                    rules={[{ required: true, message: '请输入药物名称' }]}
                  >
                    <Input 
                      placeholder="药物名称" 
                      style={{
                        height: isTablet ? 40 : 32,
                        fontSize: isTablet ? 16 : 14
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={10} lg={10} xl={9}>
                  <Form.Item
                    {...restField}
                    name={[name, 'dosage']}
                    label="剂量"
                    rules={[{ required: true, message: '请输入剂量' }]}
                  >
                    <Input 
                      placeholder="用法用量（如：每日2次，每次1片）" 
                      style={{
                        height: isTablet ? 40 : 32,
                        fontSize: isTablet ? 16 : 14
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={4} style={{ display: 'flex', alignItems: isMobile ? 'flex-start' : (isTablet ? 'center' : 'flex-end'), paddingBottom: isMobile ? 0 : (isTablet ? 0 : 24) }}>
                  <MinusCircleOutlined 
                            onClick={() => remove(name)}
                            style={{ fontSize: isTablet ? 20 : 18, color: '#ff4d4f', marginTop: isMobile ? 8 : (isTablet ? 4 : 0) }} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                  />
                </Col>
              </Row>
            ))}
            <Form.Item>
              <Button 
                type="dashed" 
                onClick={() => add()} 
                icon={<PlusOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                block={isMobile}
              >
                添加药物
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Form.Item
            label="不良反应（可能）"
            name="adverseReactions"
          >
            <TextArea 
              placeholder="请描述可能的不良反应" 
              rows={3} 
            />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );

  //既往史部分
  const renderMedicalHistory = () => (
    <Card 
      title={<><HistoryOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /> 既往史</>} 
      className="form-section-card"
      bordered={false}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Form.Item
            label="既往疾病史"
            name="pastDiseases"
          >
            <TextArea 
              placeholder="请输入既往患过的疾病" 
              rows={isTablet ? 4 : 3} 
              style={{ fontSize: isTablet ? 16 : 14 }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Form.Item
            label="手术史"
            name="surgeryHistory"
          >
            <TextArea 
              placeholder="请输入手术史" 
              rows={isTablet ? 4 : 3} 
              style={{ fontSize: isTablet ? 16 : 14 }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Form.Item
            label="过敏史"
            name="allergyHistory"
          >
            <TextArea 
              placeholder="请输入过敏药物或物质" 
              rows={isTablet ? 4 : 3} 
              style={{ fontSize: isTablet ? 16 : 14 }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Form.Item
            label="家族病史（直系亲属）"
            name="familyDiseases"
          >
            <Checkbox.Group
              options={familyDiseases.map(disease => ({
                label: disease,
                value: disease
              }))}
              onChange={(checkedValues) => {
                setShowOtherFamilyDisease(checkedValues.includes('其他'));
              }}
              style={{ fontSize: isTablet ? 16 : 14, gap: isTablet ? 12 : 8 }}
            />
            {showOtherFamilyDisease && (
              <Form.Item
                name="otherFamilyDisease"
                style={{ marginTop: isTablet ? 16 : 12 }}
              >
                <Input 
                  placeholder="请具体说明其他家族病史" 
                  style={{ 
                    height: isTablet ? 40 : 32,
                    fontSize: isTablet ? 16 : 14
                  }}
                />
              </Form.Item>
            )}
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Form.Item
            label="近3年住院史"
            name="hospitalizationHistory"
          >
            <TextArea 
              placeholder="请描述近3年住院情况" 
              rows={isTablet ? 4 : 3} 
              style={{ fontSize: isTablet ? 16 : 14 }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Form.Item
            label="上传住院病历和检查报告"
            name="medicalRecords"
          >
            <Upload 
              {...medicalRecordsUploadProps}
              // 修改 previewFile 类型兼容处理
              previewFile={async (file: File | Blob | any) => {
                if ('originFileObj' in file && file.originFileObj) {
                  return await getBase64(file.originFileObj);
                }
                if (file instanceof File) {
                  return await getBase64(file);
                }
                return file.url || file.preview;
              }}
            >
              <Button 
                icon={<UploadOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                size={isTablet ? 'large' : 'middle'}
              >上传图片</Button>
            </Upload>
            <div style={{ color: '#999', fontSize: isTablet ? 14 : 12, marginTop: 8 }}>
              支持上传病历、检查报告等图片（最多5张）
            </div>
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );

  // 基本体测部分
  const renderPhysicalExam = () => (
    <Card 
      title={<><DashboardOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /> 基本体测</>} 
      className="form-section-card"
      bordered={false}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8} lg={8} xl={6}>
          <Form.Item
            label="身高 (cm)"
            name="height"
            rules={[{ required: true, message: '请输入身高' }]}
            initialValue={170}
          >
            <Slider 
              min={100} 
              max={220} 
              tipFormatter={value => `${value} cm`}
              style={{ height: isTablet ? 60 : 40 }}
            />
          </Form.Item>
        </Col>
        
        <Col xs={24} md={8} lg={8} xl={6}>
          <Form.Item
            label="体重 (kg)"
            name="weight"
            rules={[{ required: true, message: '请输入体重' }]}
          >
            <Slider 
              min={30} 
              max={150} 
              tipFormatter={value => `${value} kg`}
              style={{ height: isTablet ? 60 : 40 }}
            />
          </Form.Item>
        </Col>
        
        <Col xs={24} md={8} lg={8} xl={6}>
          <Form.Item
            label="体温 (°C)"
            name="temperature"
            rules={[{ required: true, message: '请输入体温' }]}
          >
            <Slider 
              min={35} 
              max={42} 
              step={0.1}
              tipFormatter={value => `${value} °C`}
              style={{ height: isTablet ? 60 : 40 }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: isMobile ? 0 : (isTablet ? 24 : 40) }}>
        <Col xs={24} md={12} lg={12} xl={9}>
          <Form.Item
            label="血压 (mmHg)"
            rules={[{ required: true, message: '请输入血压' }]}
          >
            <Input.Group compact>
              <Form.Item
                name={['bloodPressure', 'systolic']}
                noStyle
                rules={[
                  { required: true, message: '请输入收缩压' },
                  { pattern: /^\d{2,3}$/, message: '请输入正确值' }
                ]}
              >
                <Input 
                  style={{ 
                    width: isMobile ? '100%' : '45%', 
                    marginBottom: isMobile ? 8 : 0,
                    height: isTablet ? 40 : 32,
                    fontSize: isTablet ? 16 : 14
                  }} 
                  placeholder="收缩压（高压）" 
                />
              </Form.Item>
              {!isMobile && (
                <span style={{ 
                  display: 'inline-block', 
                  width: '10%', 
                  textAlign: 'center',
                  lineHeight: isTablet ? '40px' : '32px',
                  fontSize: isTablet ? 16 : 14
                }}>/</span>
              )}
              <Form.Item
                name={['bloodPressure', 'diastolic']}
                noStyle
                rules={[
                  { required: true, message: '请输入舒张压' },
                  { pattern: /^\d{2,3}$/, message: '请输入正确值' }
                ]}
              >
                <Input 
                  style={{ 
                    width: isMobile ? '100%' : '45%',
                    height: isTablet ? 40 : 32,
                    fontSize: isTablet ? 16 : 14
                  }} 
                  placeholder="舒张压（低压）" 
                />
              </Form.Item>
            </Input.Group>
          </Form.Item>
        </Col>
        
        <Col xs={24} md={6} lg={6} xl={4.5}>
          <Form.Item
            label="心率 (次/分钟)"
            name="heartRate"
            rules={[
              { required: true, message: '请输入心率' },
              { pattern: /^\d+$/, message: '请输入正确的心率值' }
            ]}
          >
            <InputNumber 
              min={40} 
              max={200} 
              style={{ 
                width: '100%',
                height: isTablet ? 40 : 32,
                fontSize: isTablet ? 16 : 14
              }} 
              placeholder="心率" 
            />
          </Form.Item>
        </Col>
        
        <Col xs={24} md={6} lg={6} xl={4.5}>
          <Form.Item
            label="脉氧 (%)"
            name="pulseOxygen"
            rules={[
              { required: true, message: '请输入脉氧' },
              { pattern: /^\d+$/, message: '请输入正确的脉氧值' }
            ]}
          >
            <InputNumber 
              min={80} 
              max={100} 
              style={{ 
                width: '100%',
                height: isTablet ? 40 : 32,
                fontSize: isTablet ? 16 : 14
              }} 
              placeholder="血氧饱和度" 
            />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );

  // Luca 报告部分
  const renderLucaReport = () => (
    <Card 
      title={<><FileTextOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /> Luca 报告</>} 
      className="form-section-card"
      bordered={false}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Form.Item
            label="上传 Luca 报告图片"
            name="lucaReports"
          >
            <Upload 
              {...lucaReportsUploadProps}
              // 修改 previewFile 类型兼容处理
              previewFile={async (file: File | Blob | any) => {
                if ('originFileObj' in file && file.originFileObj) {
                  return await getBase64(file.originFileObj);
                }
                if (file instanceof File) {
                  return await getBase64(file);
                }
                return file.url || file.preview;
              }}
            >
              <Button 
                icon={<UploadOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                size={isTablet ? 'large' : 'middle'}
              >上传图片</Button>
            </Upload>
            <div style={{ color: '#999', fontSize: isTablet ? 14 : 12, marginTop: 8 }}>
              支持上传多张 Luca 报告图片（最多5张）
            </div>
          </Form.Item>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Form.Item
            label="报告说明"
            name="lucaReportDescription"
          >
            <TextArea 
              placeholder="请输入报告相关说明或备注"
              rows={isTablet ? 4 : 3}
              style={{ fontSize: isTablet ? 16 : 14 }}
            />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );

  // 移动端折叠面板视图
  const renderMobileView = () => (
    <Collapse defaultActiveKey={['personal']} accordion>
      <Panel header={<><UserOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /> 个人信息</>} key="personal">
        {renderPersonalInfo()}
      </Panel>
      <Panel header={<><DashboardOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /> 基本体测</>} key="exam">
        {renderPhysicalExam()}
      </Panel>
      <Panel header={<><HeartOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /> 基本健康信息</>} key="health">
        {renderHealthInfo()}
      </Panel>
      <Panel header={<><HistoryOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /> 既往史</>} key="history">
        {renderMedicalHistory()}
      </Panel>
      <Panel header={<><FileTextOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /> Luca 报告</>} key="luca">
        {renderLucaReport()}
      </Panel>
    </Collapse>
  );

  // 桌面端标签页视图
  const renderDesktopView = () => (
    <Tabs 
      activeKey={activeTab} 
      onChange={setActiveTab}
      tabPosition="left"
      style={{ minHeight: 500 }}
    >
      <TabPane tab={<span><UserOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /> 个人信息</span>} key="personal">
        {renderPersonalInfo()}
      </TabPane>
      <TabPane tab={<span><DashboardOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /> 基本体测</span>} key="exam">
        {renderPhysicalExam()}
      </TabPane>
      <TabPane tab={<span><HeartOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /> 健康信息</span>} key="health">
        {renderHealthInfo()}
      </TabPane>
      <TabPane tab={<span><HistoryOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /> 既往史</span>} key="history">
        {renderMedicalHistory()}
      </TabPane>
       <TabPane tab={<span><FileTextOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /> Luca 报告</span>} key="luca">
        {renderLucaReport()}
      </TabPane>
    </Tabs>
  );

  return (
    <div style={{
      padding: isMobile ? 12 : isTablet ? 16 : 24,
      maxWidth: 1200,
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh'
    }}>
      <div style={{ textAlign: 'center', marginBottom: isMobile ? 16 : 24 }}>
        <h1 style={{ color: '#1890ff', fontWeight: 500, fontSize: isTablet ? '1.5rem' : '1.8rem' }}>个人健康信息登记表</h1>
        <p style={{ color: '#666' }}>请完整填写您的健康信息，以获得更好的医疗服务</p>
        
        {/* 显示当前登录用户信息 */}
        {currentUser && (
          <div style={{ marginTop: 12, color: '#52c41a' }}>
            <p>录入员：{currentUser.username}（{currentUser.role}）</p>
          </div>
        )}
      </div>
      
      <div style={{
        flex: 1,
        overflowY: 'auto',
        maxHeight: isMobile ? 'calc(100vh - 250px)' : isTablet ? 'calc(100vh - 280px)' : 'calc(100vh - 320px)',
        marginBottom: 20
      }}>
        <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          // 个人信息默认值
          name: '张三',
          gender: 'male',
          birthDate: dayjs('2000-01'),
          phone: '13800138000',
          idNumber: '110101200001011234',
          // 基本体测默认值
          height: 170,
          weight: 65,
          temperature: 36.5,
          bloodPressure: {
            systolic: 120,
            diastolic: 80
          },
          heartRate: 70,
          pulseOxygen: 98
        }}
          scrollToFirstError
        >
          {isMobile ? renderMobileView() : renderDesktopView()}
        </Form>
      </div>

      <div style={{ textAlign: 'center', padding: 20, backgroundColor: '#fff', borderRadius: 4, boxShadow: '0 -2px 8px rgba(0,0,0,0.06)' }}>
        <Button type="primary" htmlType="submit" size="large" style={{ width: isMobile ? '100%' : isTablet ? 280 : 240 }} onClick={() => form.submit()} loading={submitting} disabled={submitting}>
          提交健康信息
        </Button>
      </div>
    </div>
  );
};

export default HealthForm;