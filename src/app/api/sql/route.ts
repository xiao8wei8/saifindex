

 import { NextResponse } from 'next/server'
import jsonwebtoken from 'jsonwebtoken'
import { encrypt } from '@/utils/auth'
import { cookies } from 'next/headers'

const sql = `
 select tiw.tradedate,tiw.indexprefix,tiw.symbol,tiw.stockmarketareacode,tiw.weight
  from ts_index_weight tiw 
 where tiw.indexcode = '930693.CSI' 
   and tradedate >= '20230301' and tradedate <= '20230331'
 order by tiw.weight desc

`
import {query} from '@/libs/db'

export async function GET(
    request: Request,
    // { params: { auth } }: { params: { auth: string } }
    // {sql}: {sql: string}
  ) {
    query({query: sql})

    try {
        const results: any = await query({
          query: sql
        } );
      
        console.log(results); // results contains rows returned by server
        // console.log(fields); // fields contains extra meta data about results, if available
        return NextResponse.json({data: { results }, msg: '成功'})
      } catch (err) {
        console.log(err);
        return NextResponse.json({data: { results: [] }, msg: '失败'+err})
      }

    // const { email, pwd } = await request.json();

    // // 加密后的密文密码，建议前端传输时也进行加密，后端来解密
    // const en_pwd = encrypt(pwd);

    //  // 存储用户信息
    //  let info = {
    //   email,
    //   // 其他加密key
    //   role: 1
    // }

    // const token = jsonwebtoken.sign(
    //     info,
    //     process.env.JWT_SECRET || '',
    //     { expiresIn: '3d' }
    // );
    
    // // 设置token过期时间
    // const oneDay = 3 * 24 * 60 * 60 * 1000;
    // // 将token设置到session中，请求中就不需要手动设置token参数
    // cookies().set('token', token, { httpOnly: true, expires: Date.now() + oneDay })

    // if(auth === 'login') {
    //   return NextResponse.json({data: { email, pwd: en_pwd }, msg: '登录成功'})
    // }

    // if(auth === 'register') {
    //   return NextResponse.json({data: { email, pwd: en_pwd }, msg: '注册成功'})
    // }
    
}