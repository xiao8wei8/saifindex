-- 创建数据库
CREATE DATABASE IF NOT EXISTS zhongou;

-- 如果user表存在则删除
DROP TABLE IF EXISTS zhongou.user;

-- 创建user表
CREATE TABLE zhongou.`user` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` varchar(50) NOT NULL COMMENT '用户名',
  `password` varchar(100) NOT NULL COMMENT '密码',
  `phone` varchar(20) NOT NULL COMMENT '手机号',
  `role` enum('管理员','编辑','查看者') NOT NULL COMMENT '角色',
  `status` enum('active','inactive') NOT NULL COMMENT '状态',
  `created_at` date NOT NULL COMMENT '创建日期',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 插入mock数据
INSERT INTO zhongou.`user` (`id`, `username`, `password`, `phone`, `role`, `status`, `created_at`) VALUES
(1, 'admin', '111111', '13800138000', '管理员', 'active', '2023-01-15'),
(2, 'editor1', '111111', '13900139000', '编辑', 'active', '2023-02-20'),
(3, 'viewer1', '111111', '13700137000', '查看者', 'inactive', '2023-03-10'),
(4, 'manager', '111111', '13600136000', '管理员', 'active', '2023-04-05'),
(5, 'editor2', '111111', '13500135000', '编辑', 'inactive', '2023-05-12'),
(6, 'viewer2', '111111', '13400134000', '查看者', 'active', '2023-06-18');

-- 查询user表中的所有数据
SELECT * FROM zhongou.`user`;

-- ======================================================
-- 备份数据相关语句
-- ======================================================

-- 方法1: 将数据导出到CSV文件
-- 注意：需要确保MySQL服务器有写入权限到指定目录
-- SELECT * FROM zhongou.`user`
-- INTO OUTFILE '/tmp/user_backup.csv'
-- FIELDS TERMINATED BY ','
-- ENCLOSED BY '"'
-- LINES TERMINATED BY '\n';

-- 方法2: 创建备份表并复制数据
-- 创建备份表(如果不存在)
CREATE TABLE IF NOT EXISTS zhongou.`user_backup` LIKE zhongou.`user`;

-- 清空备份表中的数据
TRUNCATE TABLE zhongou.`user_backup`;

-- 复制数据到备份表
INSERT INTO zhongou.`user_backup` SELECT * FROM zhongou.`user`;

-- 方法3: 使用mysqldump命令备份(在命令行执行)
-- mysqldump -u [username] -p zhongou user > user_backup.sql

-- 方法4: 远程备份到其他服务器(通过SSH)
-- 备份到远程服务器(将备份文件直接传输到远程服务器)
-- mysqldump -u [username] -p zhongou user | gzip -9 | ssh [remote_user]@[remote_server] "cat > /path/to/backup/user_backup_$(date +%Y%m%d).sql.gz"

-- 或者先备份到本地再传输到远程服务器
-- mysqldump -u [username] -p zhongou user > user_backup.sql
-- gzip user_backup.sql
-- scp user_backup.sql.gz [remote_user]@[remote_server]:/path/to/backup/

-- 方法5: 远程连接备份到其他数据库
-- mysqldump -u [local_username] -p zhongou user | mysql -h [remote_host] -u [remote_username] -p [remote_database]

-- 方法6: 将远程数据库备份到本地(通过SSH直接获取)
-- 通过SSH从远程服务器获取数据库备份并保存到本地
-- ssh [remote_user]@[remote_server] "mysqldump -u [remote_db_username] -p[remote_db_password] [remote_database] user" > local_backup.sql

-- 方法7: 使用mysqldump直接连接远程数据库并备份到本地
-- 直接连接远程MySQL服务器并备份到本地文件
-- mysqldump -h [remote_host] -u [remote_username] -p [remote_database] user > local_user_backup.sql

-- 方法8: 压缩版本(节省空间)
-- mysqldump -h [remote_host] -u [remote_username] -p [remote_database] user | gzip -9 > local_user_backup_$(date +%Y%m%d).sql.gz

-- 方法9: 在macOS上安装mysqldump(如果出现'command not found: mysqldump'错误)
-- 通过Homebrew安装mysql-client(只包含客户端工具，不安装MySQL服务器)
-- brew install mysql-client
-- 安装后需要将mysql-client添加到PATH中
-- echo 'export PATH="/usr/local/opt/mysql-client/bin:$PATH"' >> ~/.zshrc
-- source ~/.zshrc

-- 或者安装完整的MySQL(包含服务器和客户端工具)
-- brew install mysql

-- 解决"Failed to upgrade Homebrew Portable Ruby!"错误的方法
-- 方法1: 更新Homebrew本身
-- brew update --force

-- 方法2: 重新安装Homebrew的Portable Ruby
-- rm -rf /usr/local/Homebrew/Library/Homebrew/vendor/portable-ruby
-- brew update

-- 方法3: 手动设置系统Ruby为Homebrew使用
-- echo 'export HOMEBREW_FORCE_RUBY_DOWNLOAD=1' >> ~/.zshrc
-- source ~/.zshrc
-- brew update

-- 解决"Authentication plugin 'mysql_native_password' cannot be loaded"错误的方法
-- 这个错误通常发生在MySQL客户端版本与服务器端身份验证插件不兼容时

-- 方法1: 在连接命令中指定身份验证插件
-- mysqldump -h [host] -u [username] -p --default-auth=mysql_native_password [database] [table] > backup.sql

-- 方法2: 使用兼容的mysql-client版本
-- 如果是安装了最新版MySQL客户端连接旧版MySQL服务器，尝试安装特定版本的客户端
-- brew install mysql-client@5.7
-- echo 'export PATH="/usr/local/opt/mysql-client@5.7/bin:$PATH"' >> ~/.zshrc
-- source ~/.zshrc

-- 方法3: 在MySQL配置文件中启用mysql_native_password插件
-- 注意：此配置需要在**MySQL服务器端**（远程MySQL服务器）上进行，而不是在本地客户端配置
-- 在服务器的my.cnf或my.ini文件中添加以下内容
-- [mysqld]
-- default_authentication_plugin=mysql_native_password
-- 然后重启MySQL服务器

-- 验证备份是否成功
SELECT COUNT(*) AS `backup_count` FROM zhongou.`user_backup`;