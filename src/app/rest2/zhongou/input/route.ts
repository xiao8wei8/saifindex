import { queryZhongou } from '../../../../libs/zhongou_db';
import { NextResponse, NextRequest } from 'next/server';
import mysql from 'mysql2/promise';

// 日志记录函数
export const logRequest = (method: string, action?: string, details?: any) => {
  console.log(`[API] ${method} request${action ? ` (action: ${action})` : ''}:`, details);
};

export const logResponse = (method: string, action?: string, success: boolean = true, details?: any) => {
  console.log(`[API] ${method} response${action ? ` (action: ${action})` : ''} - ${success ? 'SUCCESS' : 'ERROR'}:`, details);
};

// 健康信息数据类型定义
export interface HealthInfo {
  id: string;
  name: string;
  gender: string;
  birthDate: string;
  phone: string;
  idNumber: string;
  medicareNumber: string;
  address: string;
  maritalStatus: string;
  livingStatus: string;
  height: number;
  weight: number;
  bloodType: string;
  bloodPressure: { systolic: number; diastolic: number };
  heartRate: number;
  temperature: number;
  pulseOxygen: number;
  pastDiseases: string;
  currentDiseases: string;
  currentMedications: string;
  surgeryHistory: string;
  allergyHistory: string;
  familyDiseases: string;
  medicalRecords?: any[];
  lucaReports?: any[];
  lucaReportDescription?: string;
  submitTime: string;
  createdAt: string;
  recorderId?: string;
  recorderUsername?: string;
  recorderRole?: string;
  recorderPhone?: string;
}

// 处理文件数据，优化存储并确保与前端数据格式兼容
export function processFileData(files: any[] | Record<string, any> | undefined) {
  if (!files) return null;
  
  try {
    // 处理数组类型的文件数据
    if (Array.isArray(files)) {
      // 过滤掉无效文件并移除base64Data以优化存储
      const processedFiles = files
        .filter(file => typeof file === 'object' && file !== null && file.name) // 只保留有效的文件对象
        .map(file => {
          // 创建新对象，避免直接修改原对象
          const newFile = { ...file };
          // 安全地删除base64Data字段以减少存储
          if (newFile.base64Data) {
            delete newFile.base64Data;
          }
          
          // 确保关键字段存在
          return {
            name: newFile.name || '未命名文件',
            url: newFile.url || '',
            uid: newFile.uid || '',
            status: newFile.status || 'done',
            // 保留preview用于前端展示
            preview: newFile.preview || ''
          };
        });
        
      // 确保返回的是字符串格式
      return JSON.stringify(processedFiles);
    }
    
    // 处理对象类型的文件数据
    if (typeof files === 'object') {
      const safeFile = files as Record<string, any>;
      // 创建新对象，避免直接修改原对象
      const newFile = { ...safeFile };
      // 安全地删除base64Data字段
      if (newFile.base64Data) {
        delete newFile.base64Data;
      }
      // 确保返回的是字符串格式
      return JSON.stringify(newFile);
    }
    
    // 如果不是数组或对象，直接返回字符串表示
    return typeof files === 'string' ? files : JSON.stringify(files);
  } catch (error) {
    console.error('Error processing file data:', error);
    // 出错时返回空数组的字符串表示，避免影响后续操作
    return '[]';
  }
};

// 查询健康信息，支持带查询参数
// - 无参数: 获取所有健康信息
// - ?phone=xxx: 获取特定手机号的健康信息
// - ?check_exists=true&phone=xxx: 仅检查手机号是否存在
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const phone = url.searchParams.get('phone');
    const checkExists = url.searchParams.get('check_exists') === 'true';
    
    // 记录请求参数
    logRequest('GET', 'health-info', { phone, checkExists });
    
    // 检查手机号是否存在
    if (checkExists && phone) {
      logRequest('GET', 'check-phone-exists', { phone });
      const exists = await CHECK_PHONE_EXISTS(phone);
      logResponse('GET', 'check-phone-exists', true, { phone, exists });
      return NextResponse.json({ exists });
    }
    
    // 根据手机号查询健康信息
    if (phone) {
      const healthInfo = await GET_BY_PHONE(phone);
      if (healthInfo) {
        logResponse('GET', 'health-info', true, { phone, name: healthInfo.name });
        return NextResponse.json(healthInfo);
      } else {
        logResponse('GET', 'health-info', false, { phone, error: 'Record not found' });
        return NextResponse.json({ error: 'Record not found' }, { status: 404 });
      }
    }

    // 获取所有健康信息列表（深度优化版）
    // 优化版查询：使用覆盖索引，避免排序内存不足问题
    // 1. 只选择必要字段
    // 2. 对文本字段进一步压缩
    // 3. 优化函数调用以提高性能
    // 4. 添加FORCE INDEX提示优化排序
    // 5. 添加NULL值处理以提高查询稳定性
    // 6. 添加基于角色的权限控制
    // 先设置会话变量
    await queryZhongou({ query: 'SET SESSION sort_buffer_size = 1024 * 1024 * 32;' });
    
    // 获取当前登录用户的用户名，从请求参数中获取
    const username = url.searchParams.get('username');
    console.log('[权限控制] 当前登录用户:', username);
    
    // 构建SQL查询语句，添加基于角色的权限控制
    let selectQuery = `
      SELECT 
        id, 
        uid, 
        name, 
        gender, 
        birthDate, 
        phone, 
        idNumber,
        height, 
        weight, 
        bloodType, 
        rhBloodType,
        -- 保留CONCAT函数用于格式化血压数据
        CONCAT(IFNULL(systolicPressure, ''), '/', IFNULL(diastolicPressure, '')) as bloodPressure,
        heartRate, 
        temperature, 
        pulseOxygen,
        psScore,
        exerciseScore,
        childrenStatus,
        -- 获取完整的文本字段，不再截断
        pastDiseases,
        currentDiseases,
        currentMedications,
        dailyMedications,
        surgeryHistory,
        allergyHistory,
        familyDiseases,
        otherFamilyDisease,
        healthSupplements,
        dailyHealthCare,
        adverseReactions,
        hospitalizationHistory,
        submitTime,
        created_at as createdAt,
        recorder_id as recorderId,
        recorder_username as recorderUsername,
        recorder_role as recorderRole,
        recorder_phone as recorderPhone,
        -- 获取完整的medicalRecords和lucaReports数据
        medicalRecords,
        lucaReports
      FROM zhongou.input 
      -- 添加FORCE INDEX提示以优化ORDER BY操作
      FORCE INDEX (idx_submitTime)`;
    
    // 添加WHERE条件进行权限控制
    let queryParams = [];
    if (username && username.toLowerCase() !== 'admin') {
      selectQuery += ` WHERE recorder_username = ?`;
      queryParams.push(username);
      console.log('[权限控制] 非管理员用户，仅返回自己录入的数据');
    } else if (username) {
      console.log('[权限控制] 管理员用户，返回所有数据');
    }
    
    // 添加排序和分页
    selectQuery += ` ORDER BY submitTime DESC LIMIT 100`;
    // 执行查询，根据是否有参数决定调用方式
    const results = await queryZhongou(queryParams.length > 0 ? { query: selectQuery, values: queryParams } : { query: selectQuery });
    logResponse('GET', 'get-all', true, { recordCount: results.length });
    return NextResponse.json(results);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logResponse('GET', 'health-info', false, { error: errorMessage });
    return NextResponse.json({ error: 'Failed to fetch health information', details: errorMessage }, { status: 500 });
  }
}

// 根据手机号查询健康信息 - 优化版
export async function GET_BY_PHONE(phone: string) {
  try {
    // 优化策略：
    // 1. 只选择前端实际需要的核心字段
    // 2. 对长文本字段使用SUBSTRING截取，减少数据量
    // 3. 避免选择可能导致内存问题的大字段
    const query = `
      SELECT 
        id, 
        name, 
        gender, 
        birthDate, 
        phone, 
        idNumber, 
        address, 
        height, 
        weight, 
        bloodType, 
        rhBloodType,
        childrenStatus,
        psScore,
        exerciseScore,
        dailyMedications,
        otherFamilyDisease,
        healthSupplements,
        dailyHealthCare,
        adverseReactions,
        hospitalizationHistory,
        medicareNumber,
        maritalStatus,
        livingStatus,
        CONCAT(systolicPressure, '/', diastolicPressure) as bloodPressure,
        heartRate, 
        temperature, 
        pulseOxygen, 
        -- 对长文本字段进行截取，减少返回数据量
        SUBSTRING(pastDiseases, 1, 200) as pastDiseases, 
        SUBSTRING(currentDiseases, 1, 200) as currentDiseases, 
        SUBSTRING(currentMedications, 1, 200) as currentMedications, 
        SUBSTRING(surgeryHistory, 1, 200) as surgeryHistory, 
        SUBSTRING(allergyHistory, 1, 200) as allergyHistory, 
        SUBSTRING(familyDiseases, 1, 200) as familyDiseases,
        -- 保留文件数据但会在processFileData中进一步处理
        medicalRecords,
        lucaReports,
        lucaReportDescription,
        submitTime,
        created_at as createdAt,
        recorder_id as recorderId,
        recorder_username as recorderUsername,
        recorder_role as recorderRole,
        recorder_phone as recorderPhone
      FROM zhongou.input 
      WHERE phone = ?
      LIMIT 1
    `;
    const results = await queryZhongou({ query, values: [phone] });
    return results[0] || null;
  } catch (error) {
    console.error('Error fetching health information by phone:', error);
    throw error;
  }
}

// 检查手机号是否已存在
export async function CHECK_PHONE_EXISTS(phone: string) {
  try {
    // 使用COUNT(1)代替COUNT(*)以提高性能
    const query = `
      SELECT COUNT(1) as count FROM zhongou.input WHERE phone = ?
    `;
    const results = await queryZhongou({ query, values: [phone] });
    return parseInt(results[0].count) > 0;
  } catch (error) {
    console.error('Error checking phone existence:', error);
    throw error;
  }
}

// 添加健康信息
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { 
      name, 
      gender, 
      birthDate, 
      phone, 
      idNumber, 
      medicareNumber, 
      address, 
      maritalStatus, 
      livingStatus, 
      bloodPressure,
      heartRate, 
      temperature, 
      pulseOxygen, 
      pastDiseases, 
      currentDiseases, 
      currentMedications, 
      surgeryHistory, 
      allergyHistory, 
      familyDiseases,
      medicalRecords,
      lucaReports,
      lucaReportDescription,
      recorderId,
      recorderUsername,
      recorderRole,
      recorderPhone,
      uid,
      height,
      weight,
      bloodType
    } = data;

    // 记录请求信息
    logRequest('POST', 'health-info', { phone, name });

    // 检查手机号是否已存在
    const exists = await CHECK_PHONE_EXISTS(phone);
    if (exists) {
      logResponse('POST', 'health-info', false, { phone, error: 'Phone number already exists' });
      return NextResponse.json({ error: 'Phone number already exists' }, { status: 400 });
    }

    const query = `
      INSERT INTO zhongou.input (
        uid,
        name, 
        gender, 
        birthDate, 
        phone, 
        idNumber, 
        medicareNumber, 
        address, 
        maritalStatus, 
        livingStatus,
        childrenStatus,
        height,
        weight,
        bloodType,
        rhBloodType,
        systolicPressure,
        diastolicPressure,
        heartRate,
        temperature,
        pulseOxygen,
        psScore,
        exerciseScore,
        pastDiseases,
        currentDiseases,
        currentMedications,
        dailyMedications,
        surgeryHistory,
        allergyHistory,
        familyDiseases,
        otherFamilyDisease,
        healthSupplements,
        dailyHealthCare,
        adverseReactions,
        hospitalizationHistory,
        medicalRecords,
        lucaReports,
        lucaReportDescription,
        recorder_id,
        recorder_username,
        recorder_role,
        recorder_phone,
        submitTime
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      uid || '',
      name || null,
      gender || null,
      birthDate || null,
      phone,
      idNumber || null,
      medicareNumber || null,
      address || null,
      maritalStatus || null,
      livingStatus || null,
      data.childrenStatus || null,
      height || null,
      weight || null,
      bloodType || null,
      data.rhBloodType || null,
      bloodPressure?.systolic || null,
      bloodPressure?.diastolic || null,
      heartRate || null,
      temperature || null,
      pulseOxygen || null,
      data.psScore || null,
      data.exerciseScore || null,
      pastDiseases || null,
      currentDiseases || null,
      currentMedications || null,
      data.dailyMedications || null,
      surgeryHistory || null,
      allergyHistory || null,
      typeof familyDiseases === 'object' ? JSON.stringify(familyDiseases) : familyDiseases || null,
      data.otherFamilyDisease || null,
      data.healthSupplements || null,
      data.dailyHealthCare || null,
      data.adverseReactions || null,
      data.hospitalizationHistory || null,
      processFileData(medicalRecords),
      processFileData(lucaReports),
      lucaReportDescription || null,
      recorderId || null,
      recorderUsername || null,
      recorderRole || null,
      recorderPhone || null,
      new Date().toISOString().slice(0, 19).replace('T', ' ') // submitTime
    ];

    await queryZhongou({ query, values });
    logResponse('POST', 'health-info', true, { phone, name });
    
    // 获取刚刚插入的数据
    const insertedData = await GET_BY_PHONE(phone);
    return NextResponse.json(insertedData, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logResponse('POST', 'health-info', false, { error: errorMessage });
    return NextResponse.json({ error: 'Failed to create health information', details: errorMessage }, { status: 500 });
  }
}

// 更新健康信息
export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { 
      name, 
      gender, 
      birthDate, 
      phone, 
      idNumber, 
      medicareNumber, 
      address, 
      maritalStatus, 
      livingStatus, 
      height, 
      weight, 
      bloodType, 
      bloodPressure,
      heartRate, 
      temperature, 
      pulseOxygen, 
      pastDiseases, 
      currentDiseases, 
      currentMedications, 
      surgeryHistory, 
      allergyHistory, 
      familyDiseases,
      medicalRecords,
      lucaReports,
      lucaReportDescription,
      recorderId,
      recorderUsername,
      recorderRole,
      recorderPhone,
      uid
    } = data;

    // 记录请求信息
    logRequest('PUT', 'health-info', { phone, name });

    const query = `
      UPDATE zhongou.input
      SET 
        name = ?, 
        gender = ?, 
        birthDate = ?, 
        idNumber = ?, 
        medicareNumber = ?, 
        address = ?, 
        maritalStatus = ?, 
        livingStatus = ?, 
        childrenStatus = ?, 
        height = ?, 
        weight = ?, 
        bloodType = ?, 
        rhBloodType = ?, 
        systolicPressure = ?, 
        diastolicPressure = ?, 
        heartRate = ?, 
        temperature = ?, 
        pulseOxygen = ?, 
        psScore = ?, 
        exerciseScore = ?, 
        pastDiseases = ?, 
        currentDiseases = ?, 
        currentMedications = ?, 
        dailyMedications = ?, 
        surgeryHistory = ?, 
        allergyHistory = ?, 
        familyDiseases = ?, 
        otherFamilyDisease = ?, 
        healthSupplements = ?, 
        dailyHealthCare = ?, 
        adverseReactions = ?, 
        hospitalizationHistory = ?, 
        medicalRecords = ?, 
        lucaReports = ?, 
        lucaReportDescription = ?, 
        recorder_id = ?, 
        recorder_username = ?, 
        recorder_role = ?, 
        recorder_phone = ?, 
        submitTime = NOW(),
        updated_at = NOW()
      WHERE phone = ?
    `;

    const values = [
      name || null,
      gender || null,
      birthDate || null,
      idNumber || null,
      medicareNumber || null,
      address || null,
      maritalStatus || null,
      livingStatus || null,
      data.childrenStatus || null,
      height || null,
      weight || null,
      bloodType || null,
      data.rhBloodType || null,
      bloodPressure?.systolic || null,
      bloodPressure?.diastolic || null,
      heartRate || null,
      temperature || null,
      pulseOxygen || null,
      data.psScore || null,
      data.exerciseScore || null,
      pastDiseases || null,
      currentDiseases || null,
      currentMedications || null,
      data.dailyMedications || null,
      surgeryHistory || null,
      allergyHistory || null,
      typeof familyDiseases === 'object' ? JSON.stringify(familyDiseases) : familyDiseases || null,
      data.otherFamilyDisease || null,
      data.healthSupplements || null,
      data.dailyHealthCare || null,
      data.adverseReactions || null,
      data.hospitalizationHistory || null,
      processFileData(medicalRecords),
      processFileData(lucaReports),
      lucaReportDescription || null,
      recorderId || null,
      recorderUsername || null,
      recorderRole || null,
      recorderPhone || null,
      phone
    ];

    await queryZhongou({ query, values });
    logResponse('PUT', 'health-info', true, { phone, name });
    
    // 获取刚刚更新的数据
    const updatedData = await GET_BY_PHONE(phone);
    return NextResponse.json(updatedData);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logResponse('PUT', 'health-info', false, { error: errorMessage });
    return NextResponse.json({ error: 'Failed to update health information', details: errorMessage }, { status: 500 });
  }
}

// 根据手机号删除健康信息
export async function DELETE_BY_PHONE(phone: string) {
  try {
    // 先获取要删除的数据
    const dataToDelete = await GET_BY_PHONE(phone);
    if (!dataToDelete) return null;
    
    const query = `
      DELETE FROM zhongou.input WHERE phone = ?
    `;
    await queryZhongou({ query, values: [phone] });
    
    return dataToDelete;
  } catch (error) {
    console.error('Error deleting health information:', error);
    throw error;
  }
}

// 处理DELETE请求
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const phone = url.searchParams.get('phone');
    
    if (!phone) {
      logResponse('DELETE', 'health-info', false, { error: 'Phone number is required' });
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }
    
    logRequest('DELETE', 'health-info', { phone });
    
    const deletedData = await DELETE_BY_PHONE(phone);
    
    if (deletedData) {
      logResponse('DELETE', 'health-info', true, { phone });
      return NextResponse.json(deletedData);
    } else {
      logResponse('DELETE', 'health-info', false, { phone, error: 'Record not found' });
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logResponse('DELETE', 'health-info', false, { error: errorMessage });
    return NextResponse.json({ error: 'Failed to delete health information', details: errorMessage }, { status: 500 });
  }
}