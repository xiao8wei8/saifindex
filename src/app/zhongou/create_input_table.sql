-- 创建 zhongou.input 表，用于存储健康信息登记表数据
CREATE TABLE IF NOT EXISTS `zhongou`.`input` (
  `id` INT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
  `uid` VARCHAR(36) NOT NULL UNIQUE COMMENT '全局唯一标识符',
  
  -- 个人基本信息
  `name` VARCHAR(50) NOT NULL COMMENT '姓名',
  `gender` VARCHAR(10) NOT NULL COMMENT '性别',
  `birthDate` VARCHAR(20) COMMENT '出生年月',
  `phone` VARCHAR(20) NOT NULL COMMENT '电话',
  `idNumber` VARCHAR(30) NOT NULL COMMENT '身份证号',
  `medicareNumber` VARCHAR(50) COMMENT '医保号',
  `address` VARCHAR(255) COMMENT '地址',
  `maritalStatus` VARCHAR(20) COMMENT '婚姻状况',
  `livingStatus` VARCHAR(20) COMMENT '居住状况',
  `childrenStatus` VARCHAR(20) COMMENT '子女状况',
  `bloodType` VARCHAR(10) COMMENT '血型',
  `rhBloodType` VARCHAR(10) COMMENT 'RH血型',
  
  -- 健康评估
  `psScore` INT COMMENT 'PS评分',
  `exerciseScore` INT COMMENT '运动评分',
  
  -- 当前健康状况
  `currentDiseases` TEXT COMMENT '目前患有的疾病',
  `currentMedications` TEXT COMMENT '目前服用的药物',
  `healthSupplements` TEXT COMMENT '营养补充剂',
  `dailyHealthCare` JSON COMMENT '日常保健方式', -- 存储数组
  `dailyMedications` JSON COMMENT '日常用药情况', -- 存储对象数组
  `adverseReactions` TEXT COMMENT '药物不良反应',
  
  -- 既往史
  `pastDiseases` TEXT COMMENT '既往疾病史',
  `surgeryHistory` TEXT COMMENT '手术史',
  `allergyHistory` TEXT COMMENT '过敏史',
  `familyDiseases` JSON COMMENT '家族病史', -- 存储数组
  `otherFamilyDisease` TEXT COMMENT '其他家族病史说明',
  `hospitalizationHistory` TEXT COMMENT '住院史',
  
  -- 体测数据
  `height` FLOAT COMMENT '身高(cm)',
  `weight` FLOAT COMMENT '体重(kg)',
  `temperature` FLOAT COMMENT '体温(°C)',
  `systolicPressure` INT COMMENT '收缩压(mmHg)',
  `diastolicPressure` INT COMMENT '舒张压(mmHg)',
  `heartRate` INT COMMENT '心率(次/分)',
  `pulseOxygen` INT COMMENT '脉氧(%)',
  
  -- 报告相关
  `medicalRecords` JSON COMMENT '病历资料', -- 存储文件信息数组
  `lucaReports` JSON COMMENT 'Luca报告', -- 存储文件信息数组
  `lucaReportDescription` TEXT COMMENT 'Luca报告说明',
  
  -- 录入信息
  `recorder_id` VARCHAR(50) COMMENT '录入员ID',
  `recorder_username` VARCHAR(50) COMMENT '录入员姓名',
  `recorder_role` VARCHAR(50) COMMENT '录入员角色',
  `recorder_phone` VARCHAR(20) COMMENT '录入员电话',
  
  -- 系统信息
  `submitTime` DATETIME NOT NULL COMMENT '提交时间',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  
  -- 索引
  INDEX `idx_phone` (`phone`),
  INDEX `idx_idNumber` (`idNumber`),
  INDEX `idx_submitTime` (`submitTime`),
  INDEX `idx_recorder_id` (`recorder_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='健康信息登记表';