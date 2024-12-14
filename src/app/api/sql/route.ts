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
const get_catalogue_list = (params?: any) => {
    const table = params.table || "stockmarket.df_central_gov_debt_total";
    const countrys = params.countrys || ['中国','美国'];
    console.log("[dates]", params.dates);
    const years = params.dates||[2010,2023]; ;

    const sql = `

 select * from ${table} where countryname_cn in (\'${countrys.join("\',\'")}\') and year>=${years[0]} and year<=${years[1]}  order by countryname_cn ,year
 
  `;
    return sql;

    // {
    //     name: "中国",
    //     data: [
    //         43934, 48656, 65165, 81827, 112143, 142383, 171533, 165174,
    //         155157, 161454, 154610, 168960,
    //     ],
    // },
};
function getLastMonthFirstDayAndCurrentMonthLastDay() {
    // 获取当前日期
    let today = new Date();

    // 获取当前月份
    let currentMonth = today.getMonth();

    // 获取上个月的第一天
    let lastMonthFirstDay = new Date(today.getFullYear(), currentMonth, 1);

    // 获取上个月的最后一天
    // 由于上个月的最后一天就是当前月的第一天的前一天，所以可以通过设置当前月的第一天，然后减去一天来获取
    let lastMonthLastDay = new Date(today.getFullYear(), currentMonth, 0);

    // 获取当前月的最后一天
    // 同样的方法，设置下个月的第一天，然后减去一天，就是当前月的最后一天
    let nextMonthFirstDay:any = new Date(today.getFullYear(), currentMonth + 1, 1);
    let currentMonthLastDay = new Date(nextMonthFirstDay - 1);

    // 返回结果
    return {
        lastMonthFirstDay: lastMonthFirstDay.toISOString().split('T')[0], // 格式化为 YYYY-MM-DD
        lastMonthLastDay: lastMonthLastDay.toISOString().split('T')[0],
        currentMonthLastDay: currentMonthLastDay.toISOString().split('T')[0]
    };
}

// 获取当前日期
const currentDate = new Date();

// 定义一个函数来减去月份
function subtractMonths(date:any, months:any) {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() - months);
  return newDate;
}



// 调用函数并打印结果

const get_tradesignal = (params?: any) => {

    // 当前时间点
    const currentFormattedDate = currentDate.toISOString().split('T')[0];

    // 两个月前的时间点
    const twoMonthsAgoDate = subtractMonths(currentDate, 2);
    const twoMonthsAgoFormattedDate = twoMonthsAgoDate.toISOString().split('T')[0];

    // 输出时间点
    console.log(`当前时间: ${currentFormattedDate}`);
    console.log(`两个月前: ${twoMonthsAgoFormattedDate}`);

    // let result = getLastMonthFirstDayAndCurrentMonthLastDay();
    // console.log("上个月第一天:", result.lastMonthFirstDay);
    // console.log("上个月最后一天:", result.lastMonthLastDay);
    // console.log("当前月最后一天:", result.currentMonthLastDay);
    let code = params?.stockcode || "601636";

    const sql = `
   select 
   akts.tradedate    as "交易日期", 
       akts.symbol     as "股票代码", 
       akts.stockname_cn   as "股票名称（中文", 
       akts.trade_act_name   as "交易信号名称",
       round(akts.close,2)     as "当日收盘价", 
       akts.pct_change    as "当日涨跌额",
       round(akts.pct_chg,2)    as "当日涨幅",
       akts.cum_pct_chg   as "周期累积涨幅",
       akts.premium_rate   as "溢价率%",
       akts.risk_rate    as "风险指数%",
       akts.turnover_rate_f  as "当日自由流通股换手率", 
       akts.cum_turnover_f_rate as "累积自由流通股换手率",
       akts.cur_yield    as "当日收益",
       akts.cum_yield    as "周期累积收益",
       round(akts.cur_yield_ratio * 100,2) as "当日收益率",
       round(akts.cum_yield_ratio * 100,2)  as "周期累积收益率"
  from stockmarketstatistics.ads_kdj_tradesignal_summary akts
 where akts.symbol = '${code}'
   and akts.tradedate >= '${twoMonthsAgoFormattedDate}' and akts.tradedate <= '${currentFormattedDate}'
   and tradesignal_power = 2   order by akts.tradedate desc
 `;
   return sql;

}


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
            sql=get_catalogue_list(params);
            break;

        case 'tradesignal':
            sql=get_tradesignal(params);
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
