import mysql from 'mysql2/promise';

interface QueryParams {
  query: string;
  values?: any[];
}

export async function queryZhongou({ query, values = [] }: QueryParams): Promise<any> {
  const host = "152.136.175.14";
  const port = parseInt("3306");
  const database = "zhongou";
  const user =  "newuser";
  const password = "StrongPassword123!";
  
  console.log(`[数据库连接信息] 尝试连接到: ${user}@${host}:${port}/${database}`);
  
  try {
    // mysql2/promise 的 createPool 不返回 Promise，移除 await
    const dbconnection = mysql.createPool({
      host: host,
      port: port,
      database: database,
      user: user,
      password: password,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      // 添加连接超时设置
      connectTimeout: 10000
    });

    try {
      const [results] = await dbconnection.execute(query, values);
      dbconnection.end();
      return results;
    } catch (error: any) {
      dbconnection.end();
      console.error("[数据库查询错误]", error);
      
      // 针对Access denied错误提供更具体的信息
      if (error.message.includes('Access denied')) {
        throw Error(`数据库查询失败: ${error.message}\n\n这表明当前用户('${user}')没有足够的权限访问数据库('${database}')。\n请按照以下步骤解决权限问题：\n1. 登录MySQL服务器（使用具有管理员权限的账户）\n2. 执行命令: GRANT ALL PRIVILEGES ON ${database}.* TO '${user}'@'%' WITH GRANT OPTION;\n3. 然后执行: FLUSH PRIVILEGES;\n4. 确保在.env文件中正确配置ZHONGOU_MYSQL_PASSWORD（如果需要）`);
      }
      
      throw Error(`数据库查询失败: ${error.message}`);
    }
  } catch (error: any) {
    console.error("[数据库连接错误] 注意: 错误消息中的IP地址是客户端IP，不是目标服务器IP", error);
    
    // 针对Access denied错误提供更具体的信息
    if (error.message.includes('Access denied')) {
      throw Error(`数据库连接失败: ${error.message}\n\n注意：错误消息中的IP地址(如'114.92.5.62')是客户端IP，不是您配置的服务器IP(${host})。\n权限问题解决方案：\n1. 登录MySQL服务器（使用具有管理员权限的账户）\n2. 执行命令: CREATE USER '${user}'@'%' IDENTIFIED BY 'your_password'; (如果用户不存在)\n3. 执行命令: GRANT ALL PRIVILEGES ON ${database}.* TO '${user}'@'%' WITH GRANT OPTION;\n4. 执行命令: FLUSH PRIVILEGES;\n5. 在.env文件中设置正确的ZHONGOU_MYSQL_PASSWORD\n6. 确保MySQL配置文件(如my.cnf)中bind-address设置为0.0.0.0以允许远程连接`);
    }
    
    throw Error(`数据库连接失败: ${error.message}\n\n注意：错误消息中的IP地址(如'114.92.5.62')是客户端IP，不是您配置的服务器IP(${host})。\n这通常是MySQL服务器拒绝了来自客户端IP的连接请求。\n请检查：\n1. MySQL服务器是否允许来自当前客户端IP的连接\n2. '${user}'用户是否有正确的访问权限\n3. 密码(如果需要)是否正确`);
  }
}