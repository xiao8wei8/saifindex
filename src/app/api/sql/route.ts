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
};

const basics = [
    "'399013.SZ'",
    "'000967.SH'",
    "'000967.CSI'",
    "'000905.SH'",
    "'399316.SZ'",
    "'399400.SZ'",
    "'921266.CSI'",
    "'000982.SH'",
    "'399001.SZ'",
];
// select indexcode,indexshortname t from stockmarket.ts_index_basic where indexcode in (${basics.join(",")})
//  select indexcode,indexshortname t from stockmarket.ts_index_basic where indexcode in ('399013.SZ','000967.SH','000967.CSI','000905.SH','399316.SZ','399400.SZ','921266.CSI','000982.SH','399001.SZ')

// 获取指数基本信息
const get_indexshortname = () => {
    const sql = `

   select indexcode,indexshortname t from stockmarket.ts_index_basic where indexcode in (
'399001.SZ','399006.SZ','399300.SZ','399330.SZ')
  `;

    return sql;
};
//上证300指数  {id:"688981",name:"中芯国际",value:4.807,colorValue:300},
const get_weight = (indexcode?: any) => {
    let code = indexcode || "930693.CSI";
    const hs300 = `

select sba.stockname as name,tiw.stockcode as id,tiw.weight as value, 300 AS colorValue
  from stockmarket.ts_index_weight tiw ,stockmarket.stock_basic_ash sba
 where tiw.indexcode = '${code}' 
   and tradedate >= '20230301' and tradedate <= '20230331'
   and sba.symbol = tiw.symbol
 order by tiw.weight desc

`;
    return hs300;
};
const get_stock = (stockcode?: any) => {
    let code = stockcode || "601636";
    const hs300_stock = `
 select * from stockmarket.ts_daily_befadjust where tradedate >= '20240101' and tradedate <= '20240131' and stockcode = "${code}"
`;
    return hs300_stock;
};
// 获取宏观数据目录
const get_catalogue = () => {
    const sql = `
 select cal.object_name,cal.db_name,cal.object_name,cal.object_name_cn  
  from macroeconomic.catalogue cal
 where cal.parent_id = 10
   and cal.enabled_status = 1
  `;
    return sql;
};
// 获取所有国家
const get_countryname_cn = () => {
    const sql = `
     select  distinct countryname_cn  from stockmarket.df_central_gov_debt_total
  `;
    return sql;
};
const get_catalogue_list = (table?: any, countryname_cn?: any, year?: any) => {
    table = table || "stockmarket.df_central_gov_debt_total";
    countryname_cn = countryname_cn || "('中国','美国')";
    year =
        year ||
        "2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023";

    const sql = `
  select * from stockmarket.df_central_gov_debt_total where countryname_cn in ('中国','美国') and year>=2000 and year<=2023 
  `;
    return sql;
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
    const params: any = JSON.parse(searchParams.get("params") || "{}");

    let sql = "";
    switch (type) {
        case "weight": //获取权重
            const indexcode = params.indexcode;
            sql = get_weight(indexcode);
            break;
        case "stock": //获取股票
            const stockcode = params.stockcode;
            sql = get_stock(stockcode);
            break;
        case "indexshortname": //获取指数
            sql = get_indexshortname();
            break;
        case "catalogue":
            sql = get_catalogue();
            break;
        case "countryname":
            sql=get_countryname_cn();
            break;
        case "cataloguelist":
            sql=get_catalogue_list();
            break;
            
        default:
            break;
    }

    try {
        console.log("[SQL]:", sql);
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
