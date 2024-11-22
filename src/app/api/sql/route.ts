import { NextRequest, NextResponse } from "next/server";
import jsonwebtoken from "jsonwebtoken";
import { encrypt } from "@/utils/auth";
import { cookies } from "next/headers";
// 获取股票基本信息
const get_stock_basic_ash = () => {
  const sql = `
  select * from stockmarket.stock_basic_ash
  `;
  return sql;
}
// 获取指数基本信息
const get_indexshortname = () => {
  const sql = `
  select indexcode,indexshortname t from stockmarket.ts_index_basic
  `;
  return sql;
}
//上证300指数
const get_hs300 = (indexcode?:any) => {
    let code = indexcode||'930693.CSI'
    const hs300 = `
  select tiw.tradedate,tiw.indexprefix,tiw.symbol,sba.stockname,tiw.stockmarketareacode,tiw.weight
  from stockmarket.ts_index_weight tiw ,stockmarket.stock_basic_ash sba
 where tiw.indexcode = '${code}' 
   and tradedate >= '20230301' and tradedate <= '20230331'
   and sba.symbol = tiw.symbol
 order by tiw.weight desc

`;
    return hs300;
};
const get_hs300_stock = (symbol?:any) => {
    let code = symbol||'601636'
    const hs300_stock = `
 select * from stockmarket.ts_daily_befadjust where tradedate >= '20240101' and tradedate <= '20240131' and symbol = "${code}"
`;
    return hs300_stock;
};

import { query } from "@/libs/db";

// export async function GET(
//     request: Request,
//     {
//         params,
//     }: { params: { id: string; start: string; end: string; type: string } }
// ) {
    // const { id, start, end, type } = params;

export async function GET(request: NextRequest) {
        const searchParams = request.nextUrl.searchParams;
        const type: any = searchParams.get("type"); // 'xxx'
        const params: any =JSON.parse(searchParams.get("params")||'{}')

    let sql = "";
    switch (type) {
        case "hs300":
          sql = get_hs300();
            break;
        case "hs300_stock":
          sql = get_hs300_stock();
            break;
        case "indexshortname":
            sql = get_indexshortname();
                break;
            
        default:
            break;
    }

    try {
        const results: any = await query({
            query: sql,
        });

        console.log(results); // results contains rows returned by server
        // console.log(fields); // fields contains extra meta data about results, if available
        return NextResponse.json({ data: { results }, msg: "成功" });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ data: { results: [] }, msg: "失败" + err });
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
