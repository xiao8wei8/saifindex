"use client";
"use client";
import React, { useState, useEffect, useRef } from 'react';
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
  notification,
  Divider,
  Collapse,
  Tabs,
  Table,
  Popconfirm,
  Space,
  Modal
} from 'antd';
import { PlusOutlined,
  MinusCircleOutlined,
  UploadOutlined,
  UserOutlined,
  HeartOutlined,
  HistoryOutlined,
  DashboardOutlined,
  FileTextOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined
} from '@ant-design/icons'

import dayjs, { type Dayjs } from 'dayjs';
import axios from 'axios';
import './antd-custom.css'; // 自定义样式
import type { UploadChangeParam, UploadFile } from 'antd/es/upload';



const { Option } = Select;
const { TextArea } = Input;
const { MonthPicker } = DatePicker;
const { Panel } = Collapse;
const { TabPane } = Tabs;

// 定义健康信息接口
interface HealthInfo {
  id: string;
  uid: string;
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
  recorderUsername?: string;
  recorderId?: string | number;
  recorderRole?: string;
  recorderPhone?: string;
}

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

// 生成唯一ID
const generateUniqueId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `health_${timestamp}_${random}`;
};

const HealthForm = () => {
  // 处理取消按钮点击
  const handleCancel = () => {
    // 重置表单
    form.resetFields();
    // 清空独立的fileList状态
    setMedicalRecordsFileList([]);
    setLucaReportsFileList([]);
    // 退出编辑模式
    setIsEditMode(false);
    setRecordId(null);
  };
  // 使用useRouter进行路由跳转
  const router = useRouter();
  // 确保客户端环境
  const [isClient, setIsClient] = useState<boolean>(false);
  // 编辑模式标记
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  // 记录ID
  const [recordId, setRecordId] = useState<string | null>(null);
  // 健康数据列表
  const [healthData, setHealthData] = useState<HealthInfo[]>([]);
  // 过滤后的数据列表
  const [filteredData, setFilteredData] = useState<HealthInfo[]>([]);
  // 搜索文本
  const [searchText, setSearchText] = useState('');
  // 数据加载状态
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // 确保在客户端环境中设置标记
    setIsClient(true);
    
    // 解析URL参数，检查是否有记录ID
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get('id');
      if (id) {
        setRecordId(id);
        setIsEditMode(true);
        // 加载记录数据
        loadRecordData(id);
      }
    }
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
  
  // 控制图片预览Modal显示的状态
  const [showLucaModal, setShowLucaModal] = useState<boolean>(false);
  const [showMedicalModal, setShowMedicalModal] = useState<boolean>(false);
  const [currentPreviewImages, setCurrentPreviewImages] = useState<any[]>([]);
  const [currentPreviewTitle, setCurrentPreviewTitle] = useState<string>('');
  
  // 为medicalRecords和lucaReports分别定义独立的fileList状态
  const [medicalRecordsFileList, setMedicalRecordsFileList] = useState<UploadFile<any>[]>([]);
  const [lucaReportsFileList, setLucaReportsFileList] = useState<UploadFile<any>[]>([]);
  
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
      // 优先从sessionStorage获取用户信息
      let userInfo = sessionStorage.getItem('currentUser');
      
      // 如果sessionStorage中没有，从localStorage获取
      if (!userInfo) {
        userInfo = localStorage.getItem('currentUser');
      }
      
      if (userInfo) {
        setCurrentUser(JSON.parse(userInfo));
      } else {
        // 用户未登录，跳转到登录页面
        console.log('用户未登录，跳转到登录页面');
        if (typeof window !== 'undefined') {
          window.location.href = '/zhongou/login';
        }
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
      // 发生错误时也跳转到登录页面
      if (typeof window !== 'undefined') {
        window.location.href = '/zhongou/login';
      }
    }
  }, []);
  
  // 当用户信息可用时获取健康数据
  useEffect(() => {
    if (currentUser && currentUser.username) {
      fetchHealthData();
    }
  }, [currentUser]);
  
  // 从API获取健康信息数据
  const fetchHealthData = async () => {
    try {
      // 确保用户信息已加载
      if (!currentUser || !currentUser.username) {
        console.warn('[FRONTEND-WARNING] 用户信息尚未加载，无法获取健康数据');
        setLoading(false);
        return;
      }
      
      setLoading(true);
      
      console.log('[FRONTEND-LOG] 开始获取健康信息数据');
      const startTime = Date.now();
      
      // 构建API请求URL，添加username参数
      const apiUrl = `/rest2/zhongou/input?username=${encodeURIComponent(currentUser.username)}`;
      console.log(`[FRONTEND-LOG] 发送请求，用户: ${currentUser.username}`);
      
      // 调用真实的API
      const response = await fetch(apiUrl);
      
      console.log('[FRONTEND-LOG] 获取健康信息响应状态:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP错误状态: ${response.status}`);
      }
      
      const data = await response.json();
      const endTime = Date.now();
      
      console.log(`[FRONTEND-LOG] 获取健康信息完成，耗时 ${endTime - startTime}ms，返回 ${data.length} 条记录`);
      console.log('[FRONTEND-LOG] 返回数据示例:', data.length > 0 ? JSON.stringify(data[0], null, 2) : '无数据');
      
      // 处理响应数据
      setHealthData(data);
      setFilteredData(data); // 后端已处理权限控制，直接使用返回的数据
      
    } catch (error) {
      console.error('[FRONTEND-ERROR] 获取健康信息失败:', error);
      message.error('获取健康信息失败');
    } finally {
      setLoading(false);
    }
  };
  
  // 健康保险选项
  const healthCareOptions = ['基本医疗保险', '商业健康保险', '无保险'];
  
  // 家族疾病选项
  const familyDiseases = ['高血压', '糖尿病', '冠心病', '脑卒中', '肿瘤', '其他'] as const;
  
  // 搜索功能
  const handleSearch = (value: string) => {
    setSearchText(value);
    
    // 由于后端已处理权限控制，直接使用返回的数据进行搜索过滤
    const filtered = healthData.filter((item: HealthInfo) => 
      item.name.toLowerCase().includes(value.toLowerCase()) ||
      item.phone.includes(value) ||
      item.idNumber.includes(value) ||
      item.uid.includes(value)
    );
    setFilteredData(filtered);
  };
  
  // 删除健康记录 - 现在使用手机号作为唯一标识
  const handleDelete = async (phone: string) => {
    try {
      setLoading(true);
      
      // 调用真实的API删除健康信息
      const response = await fetch(`/rest2/zhongou/input?phone=${phone}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        message.success('健康信息删除成功！');
        // 重新获取数据
        fetchHealthData();
      } else {
        const errorData = await response.json();
        message.error(errorData.error || '删除失败，请重试');
      }
    } catch (error) {
      console.error('删除记录失败:', error);
      message.error('删除失败，请重试');
    } finally {
      setLoading(false);
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
  
  // 创建特定字段的上传配置，支持传入初始文件列表（用于编辑模式）
  const createUploadProps = (fieldName: string, fileList?: UploadFile<any>[]) => ({
    fileList: fileList || [], // 添加fileList属性，用于显示初始文件列表
    beforeUpload: (file: File) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('请上传图片文件！');
      }
      console.log('文件上传前验证:', { fileName: file.name, fileType: file.type, isImage });
      
      // 阻止默认上传行为，让customRequest来处理上传
      return false;
    },
    maxCount: 5,
    multiple: true,
    accept: 'image/*',
    listType: 'picture-card' as const, // 设置为图片卡片样式，显示预览，使用const断言确保类型正确性
    showUploadList: {
      showPreviewIcon: true,
      showRemoveIcon: true,
      showDownloadIcon: false // 不显示下载按钮，因为文件可能尚未上传完成
    },
    // 自定义上传按钮文本，提示用户上传机制
    uploadButton: (
      <div>
        <PlusOutlined className="ant-upload-icon" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
        <div style={{ marginTop: 8 }}>点击选择文件</div>
      </div>
    ) as React.ReactNode,
    // 自定义预览方法，确保使用base64数据进行预览
    previewFile: async (file: Blob | File) => {
      // 对于新上传的文件对象，使用base64进行预览
      const base64String = await getBase64(file);
      return base64String;
    },
    // 添加预览点击事件处理，用于打开预览Modal
    onPreview: async (file: UploadFile<any>) => {
      try {
        console.log(`====== [预览流程开始] ====== ${fieldName}预览点击事件触发`);
        console.log(`[预览触发] 文件信息:`, {
          uid: file.uid,
          name: file.name,
          status: file.status,
          hasPreview: !!file.preview,
          hasBase64Data: !!((file as any).base64Data),
          hasUrl: !!file.url,
          hasOriginFileObj: !!file.originFileObj,
          previewLength: file.preview ? file.preview.length : 0,
          base64DataLength: (file as any).base64Data ? ((file as any).base64Data as string).length : 0,
          urlLength: file.url ? file.url.length : 0
        });
        
        // 获取预览URL，优先使用file.preview，其次是file.base64Data，最后是file.url
        let previewUrl = file.preview || (file as any).base64Data || file.url;
        
        console.log(`[预览URL选择] 当前选择的URL类型:`, {
          source: file.preview ? 'preview' : ((file as any).base64Data ? 'base64Data' : (file.url ? 'url' : '无')),
          previewUrlExists: !!previewUrl
        });
        
        // 如果是新上传的文件还没有preview，需要生成base64预览
        if (!previewUrl && file.originFileObj) {
          console.log(`[即时预览生成] 开始为新上传文件生成预览...`, {
            fileName: file.name,
            fileType: file.originFileObj.type,
            fileSize: file.originFileObj.size
          });
          previewUrl = await getBase64(file.originFileObj);
          console.log(`[即时预览生成] 预览生成成功，数据长度:`, previewUrl ? previewUrl.length : 0);
        }
        
        // 设置预览数据并打开对应的Modal
        if (previewUrl) {
          console.log(`[预览设置] 更新预览数据:`, {
            previewImagesLength: 1,
            title: file.name,
            urlPreview: previewUrl.substring(0, 100) + (previewUrl.length > 100 ? '...' : '')
          });
          
          setCurrentPreviewImages([previewUrl]);
          setCurrentPreviewTitle(file.name);
          
          // 根据字段名打开不同的预览Modal
          if (fieldName === 'lucaReports') {
            console.log(`[预览Modal] 打开Luca报告预览Modal`);
            setShowLucaModal(true);
          } else if (fieldName === 'medicalRecords') {
            console.log(`[预览Modal] 打开病历预览Modal`);
            setShowMedicalModal(true);
          }
          
          console.log(`====== [预览流程结束] ====== 成功打开预览Modal`);
        } else {
          console.warn(`====== [预览流程失败] ====== 无法获取有效的预览URL`, {
            hasOriginFileObj: !!file.originFileObj,
            hasAnyUrl: !!file.preview || !!((file as any).base64Data) || !!file.url
          });
          message.error('无法预览图片，请稍后再试');
        }
      } catch (error) {
        console.error(`====== [预览流程异常] ====== 预览图片失败:`, error);
        message.error('预览图片失败，请稍后再试');
      }
    },
    // 使用顶层定义的处理函数，传入字段名
    onChange: (info: UploadChangeParam<UploadFile<any>>) => handleUploadChange(fieldName, info),
    // 自定义请求处理 - 仅用于生成预览，不实际上传
  customRequest: async (options: any) => {
    try {
      console.log(`====== [预览生成流程] ====== 开始生成文件预览`);
      // 在customRequest中保存原始文件对象引用
      const file = options.file;
      
      // 生成base64预览数据（用于前端预览）
      const base64Data = await getBase64(file);
      
      // 更新文件对象，但不执行实际上传
      options.file.preview = base64Data;
      (options.file as any).base64Data = base64Data;
      options.file.status = 'ready'; // 标记为准备上传状态
      options.file.originFileObj = file; // 确保保留原始文件对象引用
      
      // 通知"上传成功"，但实际上只是生成了预览
      if (options.onSuccess) {
        options.onSuccess({ status: 'success', file: options.file });
      }
      
      console.log(`====== [预览生成流程] ====== 文件预览生成完成: ${file.name}`);
    } catch (err) {
      console.error(`====== [预览生成异常] ====== 预览生成失败:`, err);
      if (options.onError) {
        options.onError(err);
      }
    }
    }
  });
  
  // 获取文件的base64编码，支持File或Blob类型
  const getBase64 = (file: File | Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };
  
  // 处理上传变化 - 仅处理文件选择和预览，不进行实际上传
  const handleUploadChange = async (fieldName: string, info: UploadChangeParam<UploadFile<any>>) => {
    const { fileList, file } = info;
    
    // 遍历fileList，确保每个文件都有正确的属性
    const updatedFileList = await Promise.all(
      fileList.map(async (f: UploadFile<any>) => {
        // 确保文件对象不为null
        if (!f) return f;
        
        // 对于已有originFileObj但没有preview的新上传文件，生成base64预览
        if (f.originFileObj && !f.preview) {
          try {
            // 为文件生成base64预览
              const previewData = await getBase64(f.originFileObj);
              return {
                ...f,
                preview: previewData,
                base64Data: previewData, // 额外存储base64数据
                status: 'ready' // 标记为准备上传状态
              } as any;
          } catch (error) {
            console.error(`生成文件预览失败: ${f.name}`, error);
            return f; // 出错时返回原始文件对象
          }
        }
        
        // 如果是已上传完成的文件（有url但可能缺少base64Data），保留url
        if (f.url && f.status === 'done') {
          return {
            ...f,
            // 确保base64Data存在，即使为空字符串
            base64Data: (f as any).base64Data || ''
          } as any;
        }
        
        return f;
      })
    );

    console.log(`====== [上传变更处理开始] ====== 字段: ${fieldName}, 状态: ${file.status}`);
    console.log(`[上传变更] 文件信息:`, {
      fileName: file.name,
      fileStatus: file.status,
      totalFiles: fileList.length,
      hasOriginFileObj: !!file.originFileObj,
      hasUrl: !!file.url
    });
    
    // 根据字段名更新对应的fileList状态
    if (fieldName === 'medicalRecords') {
      setMedicalRecordsFileList(updatedFileList);
    } else if (fieldName === 'lucaReports') {
      setLucaReportsFileList(updatedFileList);
    }
    
    // 根据上传状态提供用户反馈
    if (file.status === 'removed') {
      message.success(`${file.name} 已删除`);
    }
    
    console.log(`====== [上传变更处理结束] ====== 处理完成`);
  };

  // 独立的文件上传函数，在表单提交时调用
  const uploadFileToServer = async (file: File): Promise<string> => {
    try {
      console.log(`====== [文件上传流程] ====== 开始上传文件: ${file.name}`);
      
      // 创建FormData对象
      const formData = new FormData();
      formData.append('files', file);
      formData.append('timestamp', Date.now().toString());
      
      // 发送请求到文件上传API
      const response = await axios.post('http://152.136.175.14:3001/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('上传请求响应:', response.data);
      
      // 检查响应是否成功
      if (response.data.success) {
        console.log(`成功上传了文件: ${file.name}`);
      } else {
        throw new Error(`上传失败：${response.data.message || '未知错误'}`);
      }
      
      // 容错处理：尝试从不同可能的字段中获取 URL
      // 根据最新返回格式，优先从files数组的第一个元素中获取url
      const fileUrl = response.data.files?.[0]?.url || response.data.url || response.data.fileUrl || response.data.data?.url || '';
      
      if (!fileUrl) {
        throw new Error('服务器未返回有效的文件URL');
      }
      
      console.log(`[上传请求] 文件上传成功，返回URL:`, fileUrl);
      return fileUrl;
    } catch (error) {
      console.error(`====== [上传流程异常] ====== 文件上传失败:`, error);
      throw error;
    }
  };
  
  // 住院病历上传配置 - 移除顶层常量定义，改为在组件内部动态创建
  // Luca报告上传配置 - 移除顶层常量定义，改为在组件内部动态创建
    
  // 表单提交处理 - 增强版，正确处理base64格式的图片数据
  const onFinish = async (values: any) => {
      try {
        console.log('原始表单值:', values);
        
        // 表单验证 - 检查必填字段
        try {
          // 触发所有必填字段的验证
          await form.validateFields();
        } catch (error) {
          // 有必填字段未填写，显示toast提示
          message.error('请填写所有必填字段后再提交');
          return;
        }
        
        // 设置提交状态为true
        setSubmitting(true);
        
        // 处理表单数据，特别是日期格式和对象类型
    const formData = {
      ...values,
      // 转换日期格式
      birthDate: values.birthDate ? values.birthDate.format('YYYY-MM') : '',
      // 添加提交时间
      submitTime: new Date().toISOString(),
      // 确保必填字段有值
      height: values.height || 170,
      // 处理对象类型字段
      bloodPressure: values.bloodPressure ? values.bloodPressure : { systolic: null, diastolic: null },
      // 添加记录员信息
      recorderId: currentUser?.id || 'admin',
      recorderUsername: currentUser?.username || 'admin',
      recorderRole: currentUser?.role || '系统管理员',
      recorderPhone: currentUser?.phone || ''
    };
    
    // 生成唯一的uid（新增模式下）
    if (!isEditMode) {
      formData.uid = generateUniqueId();
      // 将生成的uid设置到表单字段中，以便显示在界面上
      form.setFieldsValue({ uid: formData.uid });
    }
        
        // 1. 收集所有待上传的文件
        const filesToUpload: Array<{file: UploadFile<any>, type: 'medicalRecords' | 'lucaReports'}> = [];
        
        // 收集住院病历待上传文件
        if (medicalRecordsFileList && medicalRecordsFileList.length > 0) {
          medicalRecordsFileList.forEach((file: any) => {
            if (file && file.originFileObj && !file.url) {
              filesToUpload.push({file, type: 'medicalRecords'});
            }
          });
        }
        
        // 收集Luca报告待上传文件
        if (lucaReportsFileList && lucaReportsFileList.length > 0) {
          lucaReportsFileList.forEach((file: any) => {
            if (file && file.originFileObj && !file.url) {
              filesToUpload.push({file, type: 'lucaReports'});
            }
          });
        }
        
        // 2. 如果有待上传文件，进行上传
        if (filesToUpload.length > 0) {
          message.loading('文件正在上传中，请稍候...', 0);
          
          try {
            // 逐个上传文件
            for (const item of filesToUpload) {
              const {file, type} = item;
              console.log(`开始上传文件: ${file.name}, 类型: ${type}`);
              
              // 执行文件上传
              const fileUrl = await uploadFileToServer(file.originFileObj as File);
              
              // 更新文件对象，添加URL
              file.url = fileUrl;
              file.status = 'done';
              
              // 更新对应文件列表
              if (type === 'medicalRecords') {
                setMedicalRecordsFileList(prev => 
                  prev.map(f => f.uid === file.uid ? file : f)
                );
              } else {
                setLucaReportsFileList(prev => 
                  prev.map(f => f.uid === file.uid ? file : f)
                );
              }
              
              console.log(`文件上传成功: ${file.name}, URL: ${fileUrl}`);
            }
            
            message.destroy();
            message.success(`所有 ${filesToUpload.length} 个文件上传成功！`);
          } catch (error) {
            message.destroy();
            message.error(`文件上传失败: ${error instanceof Error ? error.message : '未知错误'}`);
            setSubmitting(false);
            return;
          }
        }
        
        // 3. 处理图片文件数据，使用服务器返回的URL，不再传递preview字段
        if (medicalRecordsFileList && medicalRecordsFileList.length > 0) {
          formData.medicalRecords = medicalRecordsFileList
            .map((file: any) => ({
              name: file.name || '未命名文件',
              url: file.url || '',
              uid: file.uid || '',
              status: file.status || 'done'
            }));
        }
        
        if (lucaReportsFileList && lucaReportsFileList.length > 0) {
          formData.lucaReports = lucaReportsFileList
            .map((file: any) => ({
              name: file.name || '未命名文件',
              url: file.url || '',
              uid: file.uid || '',
              status: file.status || 'done'
            }));
        }
        
        // 记录提交数据详情，便于调试
        console.log('处理后的表单数据:', formData);
        console.log('处理后的medicalRecords:', formData.medicalRecords ? formData.medicalRecords.map((f: any) => ({name: f.name, hasUrl: !!f.url})) : '无');
        console.log('处理后的lucaReports:', formData.lucaReports ? formData.lucaReports.map((f: any) => ({name: f.name, hasUrl: !!f.url})) : '无');
        
        // 新建信息时进行手机号查重
        if (!isEditMode) {
          try {
            // 检查手机号是否存在 - 使用API接口调用
            const response = await fetch(`/rest2/zhongou/input?check_exists=true&phone=${values.phone}`);
            const result = await response.json();
            if (result.exists) {
              message.error('该手机号已存在，请使用其他手机号');
              setSubmitting(false);
              return;
            }
          } catch (error) {
            console.error('手机号查重失败:', error);
            message.error('验证手机号失败，请重试');
            setSubmitting(false);
            return;
          }
        }
        
        // 发送请求到API
        const response = await fetch('/rest2/zhongou/input', {
          method: isEditMode ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        
        // 记录响应状态
        console.log('API响应状态码:', response.status);
        
        // 检查响应是否有效
        if (!response.ok) {
          throw new Error(`API请求失败: ${response.status}`);
        }
        
        const result = await response.json();
        
        // 记录API返回结果
        console.log('API返回结果:', result);
        
        // 处理响应结果
        // 注意：后端API返回的是完整数据对象，不是{success: true}格式
        if (result && result.phone) {
          message.success(isEditMode ? '健康信息更新成功！' : '健康信息提交成功！');
          
          // 打印调试信息
          console.log('表单提交成功，正在重置表单...');
          
          // 延迟1秒后刷新当前页面，确保用户能看到成功提示
        setTimeout(() => {
          // 重置表单
          form.resetFields();
          // 清空独立的fileList状态
          setMedicalRecordsFileList([]);
          setLucaReportsFileList([]);
          // 退出编辑模式
          setIsEditMode(false);
          setRecordId(null);
          // 重新获取数据
          fetchHealthData();
        }, 1000);
        } else {
          message.error('提交失败，未返回有效数据');
          console.error('提交失败:', result);
        }
      } catch (error: any) {
        console.error('提交过程发生错误:', error.message, error.stack);
        message.error(`提交失败: ${error.message || '请检查网络连接后重试'}`);
      } finally {
        // 无论成功失败，都要将提交状态设为false
        setSubmitting(false);
      }
    };
    
  // 加载记录数据 - 增强版，支持处理base64格式图片
  const loadRecordData = async (phone: string) => {
    try {
      setLoading(true);
      
      console.log(`[FRONTEND-LOG] 开始加载手机号 ${phone} 的健康记录数据`);
      const startTime = Date.now();
      
      // 调用API获取指定手机号的健康信息
      const response = await fetch(`/rest2/zhongou/input?phone=${phone}`);
      
      console.log(`[FRONTEND-LOG] 加载手机号 ${phone} 的健康记录响应状态:`, response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP错误状态: ${response.status}`);
      }
      
      const record = await response.json();
      const endTime = Date.now();
      
      console.log(`[FRONTEND-LOG] 加载手机号 ${phone} 的健康记录完成，耗时 ${endTime - startTime}ms`);
      console.log(`[FRONTEND-LOG] 加载结果: ${record ? '找到记录' : '未找到记录'}`);
      
      if (record) {
        console.log(`[FRONTEND-LOG] 加载到的记录详情:`, JSON.stringify(record, null, 2));
        
        // 处理日期格式
        if (record.birthDate) {
          record.birthDate = dayjs(record.birthDate);
          console.log(`[FRONTEND-LOG] 转换日期格式: ${record.birthDate}`);
        }
        
        // 映射API返回字段到表单字段 - 完整版本，包含所有需要的字段
        const formData = {
          name: record.name,
          gender: record.gender,
          birthDate: record.birthDate,
          phone: record.phone,
          idNumber: record.idNumber,
          uid: record.uid,
          medicareNumber: record.medicareNumber,
          address: record.address,
          maritalStatus: record.maritalStatus,
          livingStatus: record.livingStatus,
          childrenStatus: record.childrenStatus,
          bloodType: record.bloodType,
          rhBloodType: record.rhBloodType,
          psScore: record.psScore,
          exerciseScore: record.exerciseScore,
          height: record.height,
          weight: record.weight,
          bloodPressure: record.bloodPressure,
          heartRate: record.heartRate,
          temperature: record.temperature,
          pulseOxygen: record.pulseOxygen,
          pastDiseases: record.pastDiseases,
          currentDiseases: record.currentDiseases,
          currentMedications: record.currentMedications,
          surgeryHistory: record.surgeryHistory,
          allergyHistory: record.allergyHistory,
          familyDiseases: record.familyDiseases,
          // 处理medicalRecords数据，转换为Upload组件需要的格式，优先使用base64数据
          medicalRecords: record.medicalRecords && Array.isArray(record.medicalRecords) 
            ? record.medicalRecords.map((recordData: any, index: number) => {
                // 优先使用base64Data作为预览源，其次是url或preview
                const previewUrl = recordData.base64Data || recordData.url || recordData.preview || '';
                const fileName = recordData.name || `medical-record-${index + 1}`;
                
                console.log(`[FRONTEND-LOG] 解析医疗记录文件:`, {
                  index,
                  name: fileName,
                  hasBase64: !!recordData.base64Data,
                  hasUrl: !!recordData.url,
                  hasPreview: !!previewUrl
                });
                
                return {
                  uid: recordData.uid || `medical-${index}`,
                  name: fileName,
                  status: 'done',
                  url: recordData.url || previewUrl, // 保留url字段
                  preview: previewUrl, // 确保preview属性使用base64或URL
                  base64Data: recordData.base64Data || '', // 保存原始base64数据
                  originFileObj: null // 编辑模式下没有原始文件对象
                };
              }).filter((recordData: any) => recordData.preview) // 过滤掉没有预览数据的项
            : [],
          // 处理lucaReports数据，转换为Upload组件需要的格式，优先使用base64数据
          lucaReports: record.lucaReports && Array.isArray(record.lucaReports) 
            ? record.lucaReports.map((report: any, index: number) => {
                // 优先使用base64Data作为预览源，其次是url或preview
                const previewUrl = report.base64Data || report.url || report.preview || '';
                const fileName = report.name || `luca-report-${index + 1}`;
                
                console.log(`[FRONTEND-LOG] 解析LUCA报告文件:`, {
                  index,
                  name: fileName,
                  hasBase64: !!report.base64Data,
                  hasUrl: !!report.url,
                  hasPreview: !!previewUrl
                });
                
                return {
                  uid: report.uid || `luca-${index}`,
                  name: fileName,
                  status: 'done',
                  url: report.url || previewUrl, // 保留url字段
                  preview: previewUrl, // 确保preview属性使用base64或URL
                  base64Data: report.base64Data || '', // 保存原始base64数据
                  originFileObj: null // 编辑模式下没有原始文件对象
                };
              }).filter((report: any) => report.preview) // 过滤掉没有预览数据的项
            : [],
          lucaReportDescription: record.lucaReportDescription,
          // 确保以下字段正确映射到表单
          healthSupplements: record.healthSupplements || '',
          dailyHealthCare: record.dailyHealthCare || [],
          adverseReactions: record.adverseReactions || '',
          dailyMedications: record.dailyMedications || [],
          hospitalizationHistory: record.hospitalizationHistory || ''
        };
        
        // 对于需要特殊处理的字段，可以在这里进行处理
        // 例如，确保dailyHealthCare是数组格式
        if (record.dailyHealthCare && typeof record.dailyHealthCare === 'string') {
          try {
            formData.dailyHealthCare = JSON.parse(record.dailyHealthCare);
          } catch (e) {
            console.error('解析dailyHealthCare失败，使用空数组', e);
            formData.dailyHealthCare = [];
          }
        }
        
        // 确保dailyMedications是正确的数组格式
        if (record.dailyMedications && !Array.isArray(record.dailyMedications)) {
          try {
            formData.dailyMedications = JSON.parse(record.dailyMedications);
          } catch (e) {
            console.error('解析dailyMedications失败，使用空数组', e);
            formData.dailyMedications = [];
          }
        }
        
        // 特殊处理bloodPressure字段，将字符串格式转换为对象格式
        if (record.bloodPressure && typeof record.bloodPressure === 'string') {
          try {
            const [systolic, diastolic] = record.bloodPressure.split('/').map(Number);
            if (!isNaN(systolic) && !isNaN(diastolic)) {
              formData.bloodPressure = {
                systolic: systolic,
                diastolic: diastolic
              };
              console.log(`[FRONTEND-LOG] 解析血压数据成功:`, formData.bloodPressure);
            } else {
              console.error('血压数据格式不正确:', record.bloodPressure);
              formData.bloodPressure = { systolic: 120, diastolic: 80 };
            }
          } catch (e) {
            console.error('解析血压数据失败:', e);
            formData.bloodPressure = { systolic: 120, diastolic: 80 };
          }
        }
        
        // 设置表单值
        form.setFieldsValue(formData);
        
        // 设置独立的fileList状态
        setMedicalRecordsFileList(formData.medicalRecords || []);
        setLucaReportsFileList(formData.lucaReports || []);
        
        console.log(`[FRONTEND-LOG] 表单数据和独立fileList状态已设置完成`);
        message.success('数据加载成功');
      } else {
        console.log(`[FRONTEND-LOG] 未找到手机号 ${phone} 对应的记录`);
        message.error('未找到记录数据');
      }
    } catch (error) {
      console.error(`[FRONTEND-ERROR] 加载手机号 ${phone} 的健康记录失败:`, error);
      message.error('加载记录数据失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 处理编辑按钮点击 - 更新为使用手机号作为唯一标识
  const handleEdit = (phone: string) => {
    setRecordId(phone);
    setIsEditMode(true);
    // 加载记录数据
    loadRecordData(phone);
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
              disabled={isEditMode}
            />
          </Form.Item>
        </Col>
        
        <Col xs={24} md={8} lg={8} xl={6}>
          <Form.Item
            label="UID"
            name="uid"
          >
            <Input 
              placeholder="系统自动生成"
              style={{ 
                height: isTablet ? 40 : 32,
                fontSize: isTablet ? 16 : 14
              }}
              disabled
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
            rules={[
              {
                required: false, 
                message: '此字段非必填'
              }
            ]}
          >
            <Upload 
                listType="picture-card"
                fileList={medicalRecordsFileList}
                onPreview={async (file: UploadFile<any>) => {
                  if (!file.url && !file.preview && file.originFileObj) {
                    file.preview = await getBase64(file.originFileObj);
                  }
                  
                  const images = medicalRecordsFileList.map((f: UploadFile<any>) => {
                    return f.url || f.preview || (f as any).base64Data;
                  }).filter(Boolean);
                  
                  setCurrentPreviewImages(images);
                  setCurrentPreviewTitle("住院病历和检查报告");
                  setShowMedicalModal(true);
                }}
                onChange={(info: UploadChangeParam<UploadFile<any>>) => handleUploadChange('medicalRecords', info)}
                beforeUpload={() => false} // 阻止自动上传
                multiple // 支持多文件上传
              >
                {medicalRecordsFileList.length >= 8 ? null : (
                  <div>
                    <PlusOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                    <div style={{ marginTop: 8 }}>上传图片</div>
                  </div>
                )}
              </Upload>
            <div style={{ color: '#999', fontSize: isTablet ? 14 : 12, marginTop: 8 }}>
              支持上传病历、检查报告等图片（最多8张）
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
            rules={[
              {
                required: false, 
                message: '此字段非必填'
              }
            ]}
          >
            <Upload 
              listType="picture-card"
              fileList={lucaReportsFileList}
              onPreview={async (file: UploadFile<any>) => {
                
                if (!file.url && !file.preview && file.originFileObj) {
                  file.preview = await getBase64(file.originFileObj);
                }
                
                const images = lucaReportsFileList.map((f: UploadFile<any>) => {
                  return f.url || f.preview || (f as any).base64Data;
                }).filter(Boolean);
                
                setCurrentPreviewImages(images);
                setCurrentPreviewTitle("Luca 报告");
                setShowLucaModal(true);
              }}
              onChange={(info: UploadChangeParam<UploadFile<any>>) => handleUploadChange('lucaReports', info)}
              beforeUpload={() => false} // 阻止自动上传
              multiple // 支持多文件上传
            >
              {lucaReportsFileList.length >= 8 ? null : (
                <div>
                  <PlusOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                  <div style={{ marginTop: 8 }}>上传图片</div>
                </div>
              )}
            </Upload>
            <div style={{ color: '#999', fontSize: isTablet ? 14 : 12, marginTop: 8 }}>
              支持上传多张 Luca 报告图片（最多8张）
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

  // 生成唯一ID
  const generateUniqueId = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  // 复制到剪贴板
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      message.success('已复制到剪贴板');
    }).catch(err => {
      console.error('复制失败:', err);
      message.error('复制失败，请重试');
    });
  };

  // 定义表格列
  const columns = [
    {
      title: 'UID',
      dataIndex: 'uid',
      key: 'uid',
      ellipsis: true,
      render: (text: string) => (
        <span style={{ cursor: 'pointer', color: '#1890ff' }}
              onClick={() => copyToClipboard(text)}
              title="点击复制UID">
          {text}
        </span>
      )
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      render: (text: string) => (text === 'male' ? '男' : '女'),
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
      ellipsis: true,
    },
    {
      title: '身份证号',
      dataIndex: 'idNumber',
      key: 'idNumber',
      ellipsis: true,
    },
    {
      title: '提交时间',
      dataIndex: 'submitTime',
      key: 'submitTime',
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: 'Luca报告',
      dataIndex: 'lucaReports',
      key: 'lucaReports',
      render: (reports: any) => {
        if (!reports || !Array.isArray(reports) || reports.length === 0) return '-';
        return (
          <>
            <Button 
              type="link" 
              onClick={() => {
                // 处理图片数据，优先使用base64Data
                const images = reports.map((report: any) => {
                  const url = report.base64Data || report.url || report.preview || (typeof report === 'string' ? report : '');
                  return url || null;
                }).filter(Boolean);
                if (images.length > 0) {
                  setCurrentPreviewImages(images);
                  setCurrentPreviewTitle("Luca报告预览");
                  setShowLucaModal(true);
                }
              }}
            >
              {reports.length}张图片
            </Button>
          </>
        );
      },
    },
    {
      title: '检查报告',
      dataIndex: 'medicalRecords',
      key: 'medicalRecords',
      render: (records: any) => {
        if (!records || !Array.isArray(records) || records.length === 0) return '-';
        return (
          <>
            <Button 
              type="link" 
              onClick={() => {
                // 处理图片数据，优先使用base64Data
                const images = records.map((record: any) => {
                  const url = record.base64Data || record.url || record.preview || (typeof record === 'string' ? record : '');
                  return url || null;
                }).filter(Boolean);
                if (images.length > 0) {
                  setCurrentPreviewImages(images);
                  setCurrentPreviewTitle("检查报告预览");
                  setShowMedicalModal(true);
                }
              }}
            >
              {records.length}张图片
            </Button>
          </>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: HealthInfo) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />} 
            onClick={() => handleEdit(record.phone)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这条记录吗？"
            onConfirm={() => handleDelete(record.phone)}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  
  return (
    <div>
      <div style={{
        padding: isMobile ? 12 : isTablet ? 16 : 24,
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
      }}>
      <div style={{ textAlign: 'center', marginBottom: isMobile ? 16 : 24 }}>
        <h1 style={{ color: '#1890ff', fontWeight: 500, fontSize: isTablet ? '1.5rem' : '1.8rem' }}>
          个人健康信息管理系统
        </h1>
        <p style={{ color: '#666' }}>
          在此页面可以添加、查看、编辑和删除健康信息
        </p>
        
        {/* 显示当前登录用户信息 */}
        {currentUser && (
          <div style={{ marginTop: 12, color: '#52c41a' }}>
            <p>录入员：{currentUser.username}（{currentUser.role}）</p>
          </div>
        )}
      </div>
      
      {/* 搜索和添加按钮区域 */}
      <div style={{
        marginBottom: 20,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <div style={{ marginBottom: isMobile ? 12 : 0, width: isMobile ? '100%' : 300 }}>
          <Input
              placeholder="搜索姓名、电话或身份证号"
              prefix={<SearchOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
            />
        </div>
        {!isEditMode && (
          <Button 
            type="primary" 
            onClick={() => {
              form.resetFields();
              // 清空独立的fileList状态
              setMedicalRecordsFileList([]);
              setLucaReportsFileList([]);
              setIsEditMode(false);
              setRecordId(null);
            }}
          >
            添加健康信息
          </Button>
        )}
      </div>
      
      {/* 健康数据列表 */}
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="phone"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} 共 ${total} 条记录`
        }}
        scroll={{ x: 768 }}
      />
      
      <Divider style={{ margin: '20px 0' }} />
      
      {/* 表单标题 */}
      <div style={{ textAlign: 'center', marginBottom: isMobile ? 16 : 24 }}>
        <h2 style={{ color: '#1890ff', fontWeight: 500, fontSize: isTablet ? '1.3rem' : '1.5rem' }}>
          {isEditMode ? '编辑个人健康信息' : '填写个人健康信息'}
        </h2>
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
        {isEditMode && (
          <Button style={{ marginRight: 16, width: isMobile ? '100%' : isTablet ? 280 : 120, marginBottom: isMobile ? 12 : 0 }} onClick={handleCancel}>
            取消
          </Button>
        )}
        <Button type="primary" size="large" style={{ width: isMobile ? '100%' : isTablet ? 280 : (isEditMode ? 120 : 240) }} onClick={() => form.submit()} loading={submitting} disabled={submitting}>
          {isEditMode ? '更新' : '提交健康信息'}
        </Button>
      </div>
    </div>
    
    <Modal
      title={currentPreviewTitle}
      open={showLucaModal}
      footer={null}
      onCancel={() => setShowLucaModal(false)}
      width={800}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
        {currentPreviewImages.map((url: string, index: number) => (
          <img 
            key={index} 
            src={url} 
            alt={`图片${index + 1}`} 
            style={{ maxWidth: '100%', maxHeight: '500px' }}
          />
        ))}
      </div>
    </Modal>
    
    <Modal
      title={currentPreviewTitle}
      open={showMedicalModal}
      footer={null}
      onCancel={() => setShowMedicalModal(false)}
      width={800}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
        {currentPreviewImages.map((url: string, index: number) => (
          <img 
            key={index} 
            src={url} 
            alt={`图片${index + 1}`} 
            style={{ maxWidth: '100%', maxHeight: '500px' }}
          />
        ))}
      </div>
    </Modal>
    </div>
  );
};

export default HealthForm;