-- 为已存在的`zhongou`.`input`表添加uid字段
ALTER TABLE `zhongou`.`input`
ADD COLUMN `uid` VARCHAR(36) NOT NULL UNIQUE COMMENT '全局唯一标识符' AFTER `id`;