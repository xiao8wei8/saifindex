import { NextRequest, NextResponse } from "next/server";
import { queryZhongou } from "@/libs/zhongou_db";
export const dynamic = "force-dynamic";

// 添加日志记录工具
const logRequest = (method: string, action?: string, details?: any) => {
  console.log(`[API] ${method} request${action ? ` (action: ${action})` : ''}:`, details);
};

const logResponse = (method: string, action?: string, success: boolean = true, details?: any) => {
  console.log(`[API] ${method} response${action ? ` (action: ${action})` : ''} - ${success ? 'SUCCESS' : 'ERROR'}:`, details);
};

interface User {
  id: number;
  username: string;
  password: string;
  phone: string;
  role: string;
  status: string;
  created_at: string;
}

// 获取所有用户或处理登录请求
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');
    
    // 如果是登录操作
    if (action === 'login') {
      const username = searchParams.get('username');
      const password = searchParams.get('password');
      
      // 验证必填字段
      if (!username || !password) {
        return NextResponse.json({ 
          success: false, 
          error: "用户名和密码不能为空" 
        }, { status: 400 });
      }
      
      // 查询用户信息
      const query = `SELECT * FROM zhongou.user WHERE username = ? AND password = ?`;
      const users = await queryZhongou({
        query,
        values: [username, password]
      });
      
      // 检查查询结果
      if (!users || users.length === 0) {
        return NextResponse.json({ 
          success: false, 
          error: "用户名或密码错误" 
        }, { status: 401 });
      }
      
      const user = users[0];
      
      // 检查用户状态
      if (user.status !== 'active') {
        return NextResponse.json({ 
          success: false, 
          error: "用户账户已禁用" 
        }, { status: 403 });
      }
      
      // 登录成功，返回用户信息
      return NextResponse.json({
        success: true,
        data: user
      });
    }
    
    // 普通的获取所有用户请求
    const users = await queryZhongou({
      query: "SELECT * FROM zhongou.user"
    });
    return NextResponse.json({ success: true, data: users });
  } catch (error: any) {
    console.error("查询用户失败:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 导入需要的类型
interface BloodPressure {
  systolic: string;
  diastolic: string;
}

interface Medication {
  drugName: string;
  dosage: string;
}

interface HealthFormData {
  name: string;
  gender: string;
  birthDate?: string;
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
  height?: number;
  weight?: number;
  temperature?: number;
  bloodPressure?: BloodPressure;
  heartRate?: number;
  pulseOxygen?: number;
  medicalRecords?: any[];
  lucaReports?: any[];
  lucaReportDescription?: string;
  recorder?: {
    id?: string;
    username?: string;
    role?: string;
    phone?: string;
  };
  submitTime: string;
}

// 创建新用户
export async function POST(req: NextRequest) {
  try {
    logRequest('POST', '接收请求');
    
    const body = await req.json();
    const { action } = body;
    
    logRequest('POST', action, { requestBody: body });
    
    // 如果是提交健康信息表单
    if (action === 'submitHealthInfo') {
      logRequest('POST', 'submitHealthInfo', '开始处理健康信息提交');
      
      const formData = body.formData as HealthFormData;
      logRequest('POST', 'submitHealthInfo', { formDataKeys: Object.keys(formData || {}) });
      
      // 验证必填字段 - 个人信息
      logRequest('POST', 'submitHealthInfo', '开始表单验证');
      
      if (!formData.name || formData.name.trim() === '') {
        const errorResponse = { success: false, error: "请输入姓名" };
        logResponse('POST', 'submitHealthInfo', false, errorResponse);
        return NextResponse.json(errorResponse, { status: 400 });
      }
      
      if (!formData.gender) {
        const errorResponse = { success: false, error: "请选择性别" };
        logResponse('POST', 'submitHealthInfo', false, errorResponse);
        return NextResponse.json(errorResponse, { status: 400 });
      }
      
      if (!formData.birthDate) {
        const errorResponse = { success: false, error: "请选择出生年月" };
        logResponse('POST', 'submitHealthInfo', false, errorResponse);
        return NextResponse.json(errorResponse, { status: 400 });
      }
      
      // 验证手机号格式
      if (!formData.phone || !/^1[3-9]\d{9}$/.test(formData.phone)) {
        const errorResponse = { success: false, error: "请输入正确的手机号码" };
        logResponse('POST', 'submitHealthInfo', false, errorResponse);
        return NextResponse.json(errorResponse, { status: 400 });
      }
      
      // 验证身份证格式
      if (!formData.idNumber || !/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(formData.idNumber)) {
        const errorResponse = { success: false, error: "请输入正确的身份证号码" };
        logResponse('POST', 'submitHealthInfo', false, errorResponse);
        return NextResponse.json(errorResponse, { status: 400 });
      }
      
      // 健康状况和既往史字段非必填
      // 保留字段存在性检查，但不再作为必填项验证
      if (formData.currentDiseases === undefined) formData.currentDiseases = '';
      if (formData.currentMedications === undefined) formData.currentMedications = '';
      if (formData.pastDiseases === undefined) formData.pastDiseases = '';
      if (formData.surgeryHistory === undefined) formData.surgeryHistory = '';
      if (formData.allergyHistory === undefined) formData.allergyHistory = '';
      
      // 验证体测数据必填字段
      if (!formData.height) {
        const errorResponse = { success: false, error: "请输入身高信息" };
        logResponse('POST', 'submitHealthInfo', false, errorResponse);
        return NextResponse.json(errorResponse, { status: 400 });
      }
      
      if (!formData.weight) {
        const errorResponse = { success: false, error: "请输入体重信息" };
        logResponse('POST', 'submitHealthInfo', false, errorResponse);
        return NextResponse.json(errorResponse, { status: 400 });
      }
      
      if (!formData.bloodPressure || !formData.bloodPressure.systolic || !formData.bloodPressure.diastolic) {
        const errorResponse = { success: false, error: "请输入血压信息" };
        logResponse('POST', 'submitHealthInfo', false, errorResponse);
        return NextResponse.json(errorResponse, { status: 400 });
      }
      
      // 验证血压数值是否为有效数字
      const systolicPressure = formData.bloodPressure?.systolic ? parseInt(formData.bloodPressure.systolic) : NaN;
      const diastolicPressure = formData.bloodPressure?.diastolic ? parseInt(formData.bloodPressure.diastolic) : NaN;
      
      if (isNaN(systolicPressure) || isNaN(diastolicPressure)) {
        const errorResponse = { success: false, error: "请输入有效的血压数值" };
        logResponse('POST', 'submitHealthInfo', false, errorResponse);
        return NextResponse.json(errorResponse, { status: 400 });
      }
      
      if (!formData.heartRate) {
        const errorResponse = { success: false, error: "请输入心率信息" };
        logResponse('POST', 'submitHealthInfo', false, errorResponse);
        return NextResponse.json(errorResponse, { status: 400 });
      }
      
      // 验证心率是否为有效数字
      if (isNaN(formData.heartRate)) {
        const errorResponse = { success: false, error: "请输入有效的心率数值" };
        logResponse('POST', 'submitHealthInfo', false, errorResponse);
        return NextResponse.json(errorResponse, { status: 400 });
      }
      
      // 验证日常用药情况（如果有输入）
      if (formData.dailyMedications && formData.dailyMedications.length > 0) {
        for (let i = 0; i < formData.dailyMedications.length; i++) {
          const med = formData.dailyMedications[i];
          if (!med.drugName || !med.dosage) {
            const errorResponse = { 
              success: false, 
              error: `第${i+1}条用药信息不完整，请检查药物名称和剂量`
            };
            logResponse('POST', 'submitHealthInfo', false, errorResponse);
            return NextResponse.json(errorResponse, { status: 400 });
          }
        }
      }
      
      // 验证家族病史
      if (formData.familyDiseases && formData.familyDiseases.includes('其他') && 
          (!formData.otherFamilyDisease || formData.otherFamilyDisease.trim() === '')) {
        const errorResponse = { 
          success: false, 
          error: "请填写其他家族病史说明"
        };
        logResponse('POST', 'submitHealthInfo', false, errorResponse);
        return NextResponse.json(errorResponse, { status: 400 });
      }
      
      logRequest('POST', 'submitHealthInfo', '表单验证通过');
      
      // 检查图片上传情况
      if (formData.medicalRecords && formData.medicalRecords.length > 0) {
        logRequest('POST', 'submitHealthInfo', `收到${formData.medicalRecords.length}个病历图片文件`);
      } else {
        logRequest('POST', 'submitHealthInfo', '未收到病历图片文件');
      }
      
      if (formData.lucaReports && formData.lucaReports.length > 0) {
        logRequest('POST', 'submitHealthInfo', `收到${formData.lucaReports.length}个Luca报告图片文件`);
      } else {
        logRequest('POST', 'submitHealthInfo', '未收到Luca报告图片文件');
      }
      
      // 构建SQL插入语句
      logRequest('POST', 'submitHealthInfo', '开始准备SQL插入操作');
      
      // 仔细检查列名数量和问号数量，确保完全匹配
      const insertQuery = `
        INSERT INTO zhongou.input (
          name, gender, birthDate, phone, idNumber, medicareNumber, address,
          maritalStatus, livingStatus, childrenStatus, bloodType, rhBloodType,
          psScore, exerciseScore, currentDiseases, currentMedications,
          healthSupplements, dailyHealthCare, dailyMedications, adverseReactions,
          pastDiseases, surgeryHistory, allergyHistory, familyDiseases, otherFamilyDisease,
          hospitalizationHistory, height, weight, temperature, systolicPressure, diastolicPressure,
          heartRate, pulseOxygen, medicalRecords, lucaReports, lucaReportDescription,
          recorder_id, recorder_username, recorder_role, recorder_phone, submitTime
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      // 准备参数，处理可能为null的字段和特殊类型
      logRequest('POST', 'submitHealthInfo', '开始处理参数和JSON转换');
      
      // 插入前校验，检查所有必要字段
      logRequest('POST', 'submitHealthInfo', '开始进行插入前字段校验');
      
      // 定义所有需要检查的字段及其默认值
      const requiredFields = [
        { name: 'name', value: formData.name },
        { name: 'gender', value: formData.gender },
        { name: 'birthDate', value: formData.birthDate },
        { name: 'phone', value: formData.phone },
        { name: 'idNumber', value: formData.idNumber },
        { name: 'systolicPressure', value: systolicPressure },
        { name: 'diastolicPressure', value: diastolicPressure },
        { name: 'submitTime', value: formData.submitTime }
      ];
      
      // 检查必填字段
      const missingFields = [];
      for (const field of requiredFields) {
        if (field.value === undefined || field.value === null || field.value === '') {
          missingFields.push(field.name);
        }
      }
      
      if (missingFields.length > 0) {
        logRequest('POST', 'submitHealthInfo', `发现缺少的必填字段: ${missingFields.join(', ')}`);
        // 可以根据需要补充默认值或返回错误
        const errorResponse = { success: false, error: `缺少必要字段: ${missingFields.join(', ')}` };
        logResponse('POST', 'submitHealthInfo', false, errorResponse);
        return NextResponse.json(errorResponse, { status: 400 });
      }
      
      logRequest('POST', 'submitHealthInfo', '所有必填字段检查通过');
      
      const birthDateStr = formData.birthDate || null;
      
      // 转换JSON字段
      const dailyHealthCareJSON = formData.dailyHealthCare ? JSON.stringify(formData.dailyHealthCare) : null;
      const dailyMedicationsJSON = formData.dailyMedications ? JSON.stringify(formData.dailyMedications) : null;
      const familyDiseasesJSON = formData.familyDiseases ? JSON.stringify(formData.familyDiseases) : null;
      
      // 详细记录图片数据转换过程
      const medicalRecordsJSON = formData.medicalRecords ? JSON.stringify(formData.medicalRecords) : null;
      logRequest('POST', 'submitHealthInfo', `medicalRecords数据转换: ${medicalRecordsJSON ? '有数据' : '无数据'}，原始数据: ${JSON.stringify(formData.medicalRecords)}`);
      
      const lucaReportsJSON = formData.lucaReports ? JSON.stringify(formData.lucaReports) : null;
      logRequest('POST', 'submitHealthInfo', `lucaReports数据转换: ${lucaReportsJSON ? '有数据' : '无数据'}，原始数据: ${JSON.stringify(formData.lucaReports)}`);
      
      // 处理可选字段，确保没有undefined值
      const medicareNumber = formData.medicareNumber || null;
      const address = formData.address || null;
      const maritalStatus = formData.maritalStatus || null;
      const livingStatus = formData.livingStatus || null;
      const childrenStatus = formData.childrenStatus || null;
      const bloodType = formData.bloodType || null;
      const rhBloodType = formData.rhBloodType || null;
      const psScore = formData.psScore || null;
      const exerciseScore = formData.exerciseScore || null;
      const healthSupplements = formData.healthSupplements || null;
      const adverseReactions = formData.adverseReactions || null;
      const otherFamilyDisease = formData.otherFamilyDisease || null;
      const hospitalizationHistory = formData.hospitalizationHistory || null;
      const temperature = formData.temperature || null;
      const pulseOxygen = formData.pulseOxygen || null;
      const lucaReportDescription = formData.lucaReportDescription || null;
      const recorderId = formData.recorder?.id || null;
      const recorderUsername = formData.recorder?.username || null;
      const recorderRole = formData.recorder?.role || null;
      const recorderPhone = formData.recorder?.phone || null;
      
      // 确保血压数据格式正确（systolicPressure和diastolicPressure已在上方222-223行定义）
      // 这里不需要重复声明，使用已有的变量


      
      // 构建values数组并进行最终校验
      // 转换submitTime为MySQL兼容的日期时间格式
      const submitTimeFormatted = formData.submitTime ? 
        new Date(formData.submitTime).toISOString().slice(0, 19).replace('T', ' ') : null;
        
      const values = [
        formData.name,
        formData.gender,
        birthDateStr,
        formData.phone,
        formData.idNumber,
        medicareNumber,
        address,
        maritalStatus,
        livingStatus,
        childrenStatus,
        bloodType,
        rhBloodType,
        psScore,
        exerciseScore,
        formData.currentDiseases,
        formData.currentMedications,
        healthSupplements,
        dailyHealthCareJSON,
        dailyMedicationsJSON,
        adverseReactions,
        formData.pastDiseases,
        formData.surgeryHistory,
        formData.allergyHistory,
        familyDiseasesJSON,
        otherFamilyDisease,
        hospitalizationHistory,
        formData.height,
        formData.weight,
        temperature,
        systolicPressure,
        diastolicPressure,
        formData.heartRate,
        pulseOxygen,
        medicalRecordsJSON,
        lucaReportsJSON,
        lucaReportDescription,
        recorderId,
        recorderUsername,
        recorderRole,
        recorderPhone,
        submitTimeFormatted
      ];
      
      // 执行最终校验：检查values数组长度与列数是否匹配
      const expectedColumnCount = 41; // 与SQL语句中的41个列名和41个问号数量完全匹配
      if (values.length !== expectedColumnCount) {
        const errorMsg = `列数与值数不匹配：预期${expectedColumnCount}个值，实际提供了${values.length}个值`;
        logRequest('POST', 'submitHealthInfo', errorMsg);
        
        // 打印每个值的详细信息，帮助调试
        logRequest('POST', 'submitHealthInfo', '详细值信息：');
        values.forEach((value, index) => {
          logRequest('POST', 'submitHealthInfo', `索引${index}: ${typeof value === 'undefined' ? 'undefined' : 
                                          value === null ? 'null' : 
                                          JSON.stringify(value).substring(0, 50) + '...'}`);
        });
        
        const errorResponse = { success: false, error: errorMsg };
        logResponse('POST', 'submitHealthInfo', false, errorResponse);
        return NextResponse.json(errorResponse, { status: 400 });
      }
      
      logRequest('POST', 'submitHealthInfo', `值数组校验通过：包含${values.length}个值，与预期的${expectedColumnCount}个列匹配`);
      
      // 执行数据库插入
      logRequest('POST', 'submitHealthInfo', '执行数据库插入操作');
      
      // 打印完整的SQL语句和值数量，以便调试列数与值数不匹配问题
      logRequest('POST', 'submitHealthInfo', `即将执行的SQL语句：\n${insertQuery}`);
      logRequest('POST', 'submitHealthInfo', `SQL语句中的问号数量：${(insertQuery.match(/\?/g) || []).length}`);
      logRequest('POST', 'submitHealthInfo', `提供的值数量：${values.length}`);
      logRequest('POST', 'submitHealthInfo', `submitTime原始格式：${formData.submitTime}，转换后格式：${submitTimeFormatted}`);
      
      await queryZhongou({
        query: insertQuery,
        values: values
      });
      
      logRequest('POST', 'submitHealthInfo', '数据库插入操作完成');
      
      const responseData = {
        success: true,
        message: "健康信息提交成功"
      };
      
      logResponse('POST', 'submitHealthInfo', true, responseData);
      
      return NextResponse.json(responseData);
    }
    
    // 原有创建用户的逻辑
    logRequest('POST', 'createUser', '开始创建用户');
    
    const userData: Partial<User> = body;
    const { username, password, phone, role, status, created_at } = userData;
    
    logRequest('POST', 'createUser', { username, phone, role });
    
    // 验证必填字段
    if (!username || !password || !phone || !role || !status || !created_at) {
      const errorResponse = { success: false, error: "缺少必要参数" };
      logResponse('POST', 'createUser', false, errorResponse);
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    // 检查用户是否已存在
    logRequest('POST', 'createUser', '检查用户是否已存在');
    
    const checkUserQuery = "SELECT * FROM zhongou.user WHERE username = ?";
    const existingUsers = await queryZhongou({
      query: checkUserQuery,
      values: [username]
    });
    
    if (existingUsers && existingUsers.length > 0) {
      const errorResponse = { 
        success: false, 
        error: "用户名已存在"
      };
      logResponse('POST', 'createUser', false, errorResponse);
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    // 插入新用户
    logRequest('POST', 'createUser', '准备插入新用户');
    
    // 插入新用户
    logRequest('POST', 'createUser', '执行用户创建操作');
    
    await queryZhongou({
      query: "INSERT INTO zhongou.user (username, password, phone, role, status, created_at) VALUES (?, ?, ?, ?, ?, ?)",
      values: [username, password, phone, role, status, created_at]
    });
    
    // 查询新创建的用户信息
    logRequest('POST', 'createUser', '查询新创建的用户信息');
    
    const newUserQuery = "SELECT * FROM zhongou.user WHERE username = ?";
    const newUsers = await queryZhongou({
      query: newUserQuery,
      values: [username]
    });
    
    if (newUsers && newUsers.length > 0) {
      const newUser = newUsers[0];
      const responseData = {
        success: true,
        message: "用户创建成功",
        data: newUser
      };
      
      logResponse('POST', 'createUser', true, responseData);
      return NextResponse.json(responseData);
    } else {
      const errorResponse = {
        success: false,
        error: "用户创建失败"
      };
      
      logResponse('POST', 'createUser', false, errorResponse);
      return NextResponse.json(errorResponse, { status: 500 });
    }
  } catch (error: any) {
    console.error("创建用户或提交健康信息失败:", error);
    const errorMessage = error.message || '服务器内部错误';
    const errorResponse = { success: false, error: errorMessage };
    
    logResponse('POST', 'general', false, { error: errorMessage, stack: error.stack });
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// 更新用户信息
export async function PUT(req: NextRequest) {
  try {
    const body: Partial<User> = await req.json();
    const { id, username, password, phone, role, status } = body;
    
    // 验证必填字段
    if (!id) {
      return NextResponse.json({ success: false, error: "缺少用户ID" }, { status: 400 });
    }
    
    // 构建更新语句
    const updateFields: string[] = [];
    const values: any[] = [];
    
    if (username) {
      updateFields.push("username = ?");
      values.push(username);
    }
    if (password) {
      updateFields.push("password = ?");
      values.push(password);
    }
    if (phone) {
      updateFields.push("phone = ?");
      values.push(phone);
    }
    if (role) {
      updateFields.push("role = ?");
      values.push(role);
    }
    if (status) {
      updateFields.push("status = ?");
      values.push(status);
    }
    
    // 如果没有需要更新的字段
    if (updateFields.length === 0) {
      return NextResponse.json({ success: false, error: "没有需要更新的字段" }, { status: 400 });
    }
    
    // 添加ID到参数列表
    values.push(id);
    
    // 执行更新
    await queryZhongou({
      query: `UPDATE zhongou.user SET ${updateFields.join(", ")} WHERE id = ?`,
      values
    });
    
    return NextResponse.json({ success: true, message: "用户更新成功" });
  } catch (error: any) {
    console.error("更新用户失败:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 删除用户
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    // 验证必填字段
    if (!id) {
      return NextResponse.json({ success: false, error: "缺少用户ID" }, { status: 400 });
    }
    
    // 执行删除
    await queryZhongou({
      query: "DELETE FROM zhongou.user WHERE id = ?",
      values: [id]
    });
    
    return NextResponse.json({ success: true, message: "用户删除成功" });
  } catch (error: any) {
    console.error("删除用户失败:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}