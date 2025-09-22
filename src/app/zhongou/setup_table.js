// 用于创建 zhongou.input 表的脚本
// 运行方式: node src/app/zhongou/setup_table.js

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function setupTable() {
  try {
    // 读取SQL脚本
    const sqlFilePath = path.join(__dirname, 'create_input_table.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');
    
    console.log('读取SQL脚本成功，准备创建表...');
    
    // 创建数据库连接
    const connection = await mysql.createConnection({
      host: '152.136.175.14',
      port: 3306,
      user: 'newuser',
      password: 'password', // 注意：实际使用时请替换为正确的密码
      database: 'zhongou'
    });
    
    // 执行SQL语句
    const [result] = await connection.execute(sql);
    
    console.log('表创建成功:', result);
    
    // 关闭连接
    await connection.end();
    
    console.log('数据库连接已关闭');
  } catch (error) {
    console.error('创建表时出错:', error.message);
    
    // 处理常见错误
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('错误提示：访问被拒绝，请检查用户名和密码是否正确。');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('错误提示：数据库不存在，请检查数据库名称是否正确。');
    } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED') {
      console.error('错误提示：无法连接到数据库服务器，请检查主机地址和端口是否正确，以及服务器是否允许远程连接。');
    } else {
      console.error('请查看详细错误信息，并参考数据库文档解决问题。');
    }
  }
}

// 执行脚本
setupTable();