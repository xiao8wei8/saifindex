"use client";
import React, { useState } from 'react';
import { 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  Card, 
  Row, 
  Col, 
  Button,
  Checkbox,
  Slider,
  InputNumber,
  Upload,
  message,
  Divider,
  Collapse,
  Tabs
} from 'antd';
import { 
  PlusOutlined, 
  MinusCircleOutlined, 
  UploadOutlined,
  UserOutlined,
  HeartOutlined,
  HistoryOutlined,
  DashboardOutlined
} from '@ant-design/icons';
import './antd-custom.css'; // 自定义样式
import type { UploadChangeParam, UploadFile } from 'antd/es/upload';



const { Option } = Select;
const { TextArea } = Input;
const { MonthPicker } = DatePicker;
const { Panel } = Collapse;
const { TabPane } = Tabs;

const HealthForm = () => {
  const [form] = Form.useForm();
  const [showOtherFamilyDisease, setShowOtherFamilyDisease] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // 监听窗口大小变化
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const familyDiseases = [
    '高血压', '高血脂', '心脏病', '癌症', 
    '帕金森', '阿兹海默', '其他'
  ];

  const healthCareOptions = [
    '广场舞', '太极', '快步走', '跑步', 
    '骑行', '游泳', '瑜伽', '健身'
  ];

  // 处理表单提交
  const onFinish = (values: any) => {
    console.log('表单数据:', values);
    message.success('健康信息提交成功！');
  };

  // 处理文件上传
  const uploadProps = {
    beforeUpload: (file: File) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('请上传图片文件！');
      }
      return isImage || Upload.LIST_IGNORE;
    },
    maxCount: 5,
    multiple: true,
    accept: 'image/*',
    onChange: (info: UploadChangeParam<UploadFile>) => {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 上传成功`);
      }
    },
  };

  // 个人信息部分
  const renderPersonalInfo = () => (
    <Card 
      title={<><UserOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /> 个人信息</>} 
      className="form-section-card"
      bordered={false}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Form.Item
            label="姓名"
            name="name"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>
        </Col>
        
        <Col xs={24} md={8}>
          <Form.Item
            label="性别"
            name="gender"
            rules={[{ required: true, message: '请选择性别' }]}
          >
            <Select placeholder="请选择性别">
              <Option value="male">男</Option>
              <Option value="female">女</Option>
            </Select>
          </Form.Item>
        </Col>
        
        <Col xs={24} md={8}>
          <Form.Item
            label="出生年月"
            name="birthDate"
            rules={[{ required: true, message: '请选择出生年月' }]}
          >
            <MonthPicker placeholder="选择年月" style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Form.Item
            label="电话"
            name="phone"
            rules={[
              { required: true, message: '请输入电话号码' },
              { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }
            ]}
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>
        </Col>
        
        <Col xs={24} md={8}>
          <Form.Item
            label="身份证号"
            name="idNumber"
            rules={[
              { required: true, message: '请输入身份证号' },
              { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '身份证格式不正确' }
            ]}
          >
            <Input placeholder="请输入身份证号" />
          </Form.Item>
        </Col>
        
        <Col xs={24} md={8}>
          <Form.Item
            label="医保号"
            name="medicareNumber"
          >
            <Input placeholder="请输入医保号" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Form.Item
            label="住址"
            name="address"
          >
            <Input placeholder="请输入详细住址" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Form.Item
            label="婚姻情况"
            name="maritalStatus"
          >
            <Select placeholder="请选择婚姻状况">
              <Option value="married">已婚</Option>
              <Option value="unmarried">未婚</Option>
              <Option value="widowed">丧偶</Option>
              <Option value="divorced">离异</Option>
            </Select>
          </Form.Item>
        </Col>
        
        <Col xs={24} md={8}>
          <Form.Item
            label="居住情况"
            name="livingStatus"
          >
            <Select placeholder="请选择居住情况">
              <Option value="withFamily">和家人同住</Option>
              <Option value="alone">独居</Option>
            </Select>
          </Form.Item>
        </Col>
        
        <Col xs={24} md={8}>
          <Form.Item
            label="子女情况"
            name="childrenStatus"
          >
            <Select placeholder="请选择子女情况">
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
        <Col xs={24} md={12}>
          <Form.Item
            label="血型"
            name="bloodType"
          >
            <Select placeholder="请选择血型">
              <Option value="A">A型</Option>
              <Option value="B">B型</Option>
              <Option value="O">O型</Option>
              <Option value="AB">AB型</Option>
              <Option value="other">其他</Option>
              <Option value="unknown">不详</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label="Rh血型"
            name="rhBloodType"
          >
            <Select placeholder="请选择Rh血型">
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
        <Col xs={24} md={8}>
          <Form.Item
            label="cancer-PS评分"
            name="psScore"
            tooltip="肿瘤患者的体能状况评分"
          >
            <Select placeholder="请选择PS评分">
              {[0, 1, 2, 3, 4, 5].map(score => (
                <Option key={score} value={score}>{score}分</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        
        <Col xs={24} md={8}>
          <Form.Item
            label="运动能力评分"
            name="exerciseScore"
            tooltip="自我评估运动能力（0-10分）"
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

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Form.Item
            label="现有疾病"
            name="currentDiseases"
            tooltip="请输入当前患有的疾病"
          >
            <TextArea 
              placeholder="请输入疾病名称，多个疾病用逗号分隔" 
              rows={3} 
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
              rows={3} 
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
              rows={3} 
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
                <Col xs={24} md={10}>
                  <Form.Item
                    {...restField}
                    name={[name, 'drugName']}
                    label={`药物 ${name + 1}`}
                    rules={[{ required: true, message: '请输入药物名称' }]}
                  >
                    <Input placeholder="药物名称" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={10}>
                  <Form.Item
                    {...restField}
                    name={[name, 'dosage']}
                    label="剂量"
                    rules={[{ required: true, message: '请输入剂量' }]}
                  >
                    <Input placeholder="用法用量（如：每日2次，每次1片）" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={4} style={{ display: 'flex', alignItems: isMobile ? 'flex-start' : 'flex-end', paddingBottom: isMobile ? 0 : 24 }}>
                  <MinusCircleOutlined 
                            onClick={() => remove(name)}
                            style={{ fontSize: 18, color: '#ff4d4f', marginTop: isMobile ? 8 : 0 }} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                  />
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

  // 既往史部分
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
              rows={3} 
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
              rows={3} 
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
              rows={3} 
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
            />
            {showOtherFamilyDisease && (
              <Form.Item
                name="otherFamilyDisease"
                style={{ marginTop: 12 }}
                rules={[{ required: true, message: '请输入其他家族病史' }]}
              >
                <Input placeholder="请具体说明其他家族病史" />
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
              rows={3} 
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
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}>上传图片</Button>
            </Upload>
            <div style={{ color: '#999', fontSize: 12, marginTop: 8 }}>
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
        <Col xs={24} md={8}>
          <Form.Item
            label="身高 (cm)"
            name="height"
          >
            <Slider 
              min={100} 
              max={220} 
              tipFormatter={value => `${value} cm`}
            />
          </Form.Item>
        </Col>
        
        <Col xs={24} md={8}>
          <Form.Item
            label="体重 (kg)"
            name="weight"
          >
            <Slider 
              min={30} 
              max={150} 
              tipFormatter={value => `${value} kg`}
            />
          </Form.Item>
        </Col>
        
        <Col xs={24} md={8}>
          <Form.Item
            label="体温 (°C)"
            name="temperature"
          >
            <Slider 
              min={35} 
              max={42} 
              step={0.1}
              tipFormatter={value => `${value} °C`}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: isMobile ? 0 : 40 }}>
        <Col xs={24} md={12}>
          <Form.Item
            label="血压 (mmHg)"
          >
            <Input.Group compact>
              <Form.Item
                name={['bloodPressure', 'systolic']}
                noStyle
                rules={[{ pattern: /^\d{2,3}$/, message: '请输入正确值' }]}
              >
                <Input 
                  style={{ width: isMobile ? '100%' : '45%', marginBottom: isMobile ? 8 : 0 }} 
                  placeholder="收缩压（高压）" 
                />
              </Form.Item>
              {!isMobile && (
                <span style={{ 
                  display: 'inline-block', 
                  width: '10%', 
                  textAlign: 'center',
                  lineHeight: '32px'
                }}>/</span>
              )}
              <Form.Item
                name={['bloodPressure', 'diastolic']}
                noStyle
                rules={[{ pattern: /^\d{2,3}$/, message: '请输入正确值' }]}
              >
                <Input 
                  style={{ width: isMobile ? '100%' : '45%' }} 
                  placeholder="舒张压（低压）" 
                />
              </Form.Item>
            </Input.Group>
          </Form.Item>
        </Col>
        
        <Col xs={24} md={6}>
          <Form.Item
            label="心率 (次/分钟)"
            name="heartRate"
          >
            <InputNumber 
              min={40} 
              max={200} 
              style={{ width: '100%' }} 
              placeholder="心率" 
            />
          </Form.Item>
        </Col>
        
        <Col xs={24} md={6}>
          <Form.Item
            label="脉氧 (%)"
            name="pulseOxygen"
          >
            <InputNumber 
              min={80} 
              max={100} 
              style={{ width: '100%' }} 
              placeholder="血氧饱和度" 
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
      <Panel header={<><HeartOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /> 基本健康信息</>} key="health">
        {renderHealthInfo()}
      </Panel>
      <Panel header={<><HistoryOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /> 既往史</>} key="history">
        {renderMedicalHistory()}
      </Panel>
      <Panel header={<><DashboardOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /> 基本体测</>} key="exam">
        {renderPhysicalExam()}
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
      <TabPane tab={<span><HeartOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /> 健康信息</span>} key="health">
        {renderHealthInfo()}
      </TabPane>
      <TabPane tab={<span><HistoryOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /> 既往史</span>} key="history">
        {renderMedicalHistory()}
      </TabPane>
      <TabPane tab={<span><DashboardOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /> 基本体测</span>} key="exam">
        {renderPhysicalExam()}
      </TabPane>
    </Tabs>
  );

  return (
    <div style={{ padding: isMobile ? 12 : 24, maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h1 style={{ color: '#1890ff', fontWeight: 500 }}>个人健康信息登记表</h1>
        <p style={{ color: '#666' }}>请完整填写您的健康信息，以便我们为您提供更好的医疗服务</p>
      </div>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        scrollToFirstError
      >
        {isMobile ? renderMobileView() : renderDesktopView()}

        <Form.Item style={{ textAlign: 'center', marginTop: 32 }}>
          <Button type="primary" htmlType="submit" size="large" style={{ width: isMobile ? '100%' : 200 }}>
            提交健康信息
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default HealthForm;