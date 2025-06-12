import { NextRequest, NextResponse } from "next/server";
import jsonwebtoken from "jsonwebtoken";
import { encrypt } from "@/utils/auth";
// import { cookies } from "next/headers";
export const dynamic = "force-dynamic";
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
    const countrys = params.countrys || ["中国", "美国"];
    console.log("[dates]", params.dates);
    const years = params.dates || [2010, 2023];

    const sql = `

 select * from ${table} where countryname_cn in (\'${countrys.join(
        "','"
    )}\') and year>=${years[0]} and year<=${
        years[1]
    }  order by countryname_cn ,year
 
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
    let nextMonthFirstDay: any = new Date(
        today.getFullYear(),
        currentMonth + 1,
        1
    );
    let currentMonthLastDay = new Date(nextMonthFirstDay - 1);

    // 返回结果
    return {
        lastMonthFirstDay: lastMonthFirstDay.toISOString().split("T")[0], // 格式化为 YYYY-MM-DD
        lastMonthLastDay: lastMonthLastDay.toISOString().split("T")[0],
        currentMonthLastDay: currentMonthLastDay.toISOString().split("T")[0],
    };
}

// 获取当前日期
// const currentDate = new Date();

// 定义一个函数来减去月份
function subtractMonths(date: any, months: any) {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() - months);
    return newDate;
}

// 调用函数并打印结果

const get_tradesignal_dashboard = (params?: any) => {
    // 获取当前日期
    const currentDate = new Date();

    // 当前时间点
    const currentFormattedDate = currentDate.toISOString().split("T")[0];

    // 两个月前的时间点
    const twoMonthsAgoDate = subtractMonths(currentDate, 2);
    const twoMonthsAgoFormattedDate = twoMonthsAgoDate
        .toISOString()
        .split("T")[0];

    // 输出时间点
    console.log(
        `时间跨度: ${currentFormattedDate}` +
            " - " +
            `${twoMonthsAgoFormattedDate}`
    );
    // console.log(`两个月前: ${twoMonthsAgoFormattedDate}`);

    // let result = getLastMonthFirstDayAndCurrentMonthLastDay();
    // console.log("上个月第一天:", result.lastMonthFirstDay);
    // console.log("上个月最后一天:", result.lastMonthLastDay);
    // console.log("当前月最后一天:", result.currentMonthLastDay);
    let code = params?.stockcode || null; //"601636";
    let date = params?.date || null;
    //   dbf.close as '当日收盘价',

    let sql0 = date
        ? "'" + date + "'"
        : `(select dbf.tradedate from stockmarket.ts_daily_befadjust dbf inner join stockmarket.stock_basic_ash sba on dbf.symbol = sba.symbol
    inner join (select akts.tradedate, akts.symbol, akts.trade_act_name from stockmarketstatistics.ads_kdj_tradesignal_summary akts
                where   akts.tradedate >= '${twoMonthsAgoFormattedDate}' and akts.tradedate <= '${currentFormattedDate}'
                    and tradesignal_power = 2) ads_trd on ads_trd.symbol = dbf.symbol and ads_trd.tradedate = dbf.tradedate
    where  dbf.tradedate >='${twoMonthsAgoFormattedDate}' and dbf.tradedate <= '${currentFormattedDate}' and dbf.symbol='000001'  order by dbf.symbol,  dbf.tradedate desc limit 1
 )
    `;

    const sql1 = `
        
    select dbf.tradedate as '交易日期',
        dbf.symbol as '股票代码',
        dbf.stockname_cn as '股票名称(中文)',
        sba.area as '所在城市',
        sba.industry as '所属行业',
        dbf.pct_chg as '当日涨跌幅' ,
        case when dbf.pct_chg > 9.8 then 1 else 0 end as "涨幅次数",
        case when dbf.pct_chg <= -9.6 then 1 else 0 end as "跌幅次数",
        ads_trd.trade_act_name as '交易信号名称',
        CONVERT(dbf.close,DECIMAL(10,2)) as '当日收盘价',
      round(dbf.total_mv/100000000,2)  as "总市值 （亿）", 
       round(dbf.circ_mv/100000000,2)  as "流通市值（亿）", 
        round((dbf.total_mv - dbf.circ_mv)/100000000,2)  as "非流通市值（亿）"


    from stockmarket.ts_daily_befadjust dbf inner join stockmarket.stock_basic_ash sba on dbf.symbol = sba.symbol
    inner join (select akts.tradedate, akts.symbol, akts.trade_act_name from stockmarketstatistics.ads_kdj_tradesignal_summary akts
                where   akts.tradedate >= '${twoMonthsAgoFormattedDate}' and akts.tradedate <= '${currentFormattedDate}'
                    and tradesignal_power = 2) ads_trd on ads_trd.symbol = dbf.symbol and ads_trd.tradedate = dbf.tradedate
    where  dbf.tradedate = 
       ${sql0}
    `;

    const sql2 = `and dbf.symbol = '${code}'`;

    const sql3 = `and dbf.isst = 'N'
     order by 2 desc,1
    `;

    let sql = "";
    sql = sql1 + " " + (code ? sql2 : "") + " " + sql3;

    // and dbf.close >= 10 and dbf.close <= 20
    //         dbf.total_mv as "总市值 （亿）",
    // dbf.circ_mv as "流通市值（亿）",
    //         round(dbf.total_mv - dbf.circ_mv,2) as "非流通市值（亿）"
    const sqll = `
   select 
   akts.tradedate    as "交易日期", 
       akts.symbol     as "股票代码", 
       akts.stockname_cn   as "股票名称(中文)", 
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
};

const get_tradesignal_kdj = (params?: any) => {
    // 获取当前日期
    const currentDate = new Date();

    // 当前时间点
    const currentFormattedDate = currentDate.toISOString().split("T")[0];

    // 两个月前的时间点
    const twoMonthsAgoDate = subtractMonths(currentDate, 2);
    const twoMonthsAgoFormattedDate = twoMonthsAgoDate
        .toISOString()
        .split("T")[0];

    // 输出时间点
    console.log(
        `时间跨度: ${currentFormattedDate}` +
            " - " +
            `${twoMonthsAgoFormattedDate}`
    );
    // console.log(`两个月前: ${twoMonthsAgoFormattedDate}`);

    // let result = getLastMonthFirstDayAndCurrentMonthLastDay();
    // console.log("上个月第一天:", result.lastMonthFirstDay);
    // console.log("上个月最后一天:", result.lastMonthLastDay);
    // console.log("当前月最后一天:", result.currentMonthLastDay);
    let code = params?.stockcode || null; //"601636";
    let date = params?.date || null;
    //   dbf.close as '当日收盘价',

    let sql0 = date
        ? "'" + date + "'"
        : `(select dbf.tradedate from stockmarket.ts_daily_befadjust dbf inner join stockmarket.stock_basic_ash sba on dbf.symbol = sba.symbol
    inner join (select akts.tradedate, akts.symbol, akts.trade_act_name from stockmarketstatistics.ads_kdj_tradesignal_summary akts
                where   akts.tradedate >= '${twoMonthsAgoFormattedDate}' and akts.tradedate <= '${currentFormattedDate}'
                    and tradesignal_power = 2) ads_trd on ads_trd.symbol = dbf.symbol and ads_trd.tradedate = dbf.tradedate
    where  dbf.tradedate >='${twoMonthsAgoFormattedDate}' and dbf.tradedate <= '${currentFormattedDate}' and dbf.symbol='000001'  order by dbf.symbol,  dbf.tradedate desc limit 1
 )
    `;
    const sql1 = `

select kdj.symbol    as "股票代码",
       kdj.tradedate   as "交易日期", 
       kdj.stockname_cn  as "股票名称", 
       kdj.kvalue   as "K 值",
       kdj.dvalue   as "D 值", 
       kdj.jvalue   as "J 值", 
       macd.diff   as "DIFF 值", 
       macd.dea    as "DEA 值",
       macd.macd   as "MACD 值",
       boll.lower20   as "20天下轨线",
       boll.middle20  as "20天中轨线", 
       boll.upper20   as "20天上轨线",
       boll.lower50   as "50天下轨线",
       boll.middle50  as "50天中轨线", 
       boll.upper50   as "50天上轨线"
  from (select kdi.symbol,kdi.tradedate, kdi.stockname_cn, kdi.rsvvalue, kdi.kvalue, kdi.dvalue, kdi.jvalue 
       from stockmarketstatistics.kdj_daily_index kdi
      where kdi.tradedate =  ${sql0}
        and kdi.kdjcycle = '9-3-3') kdj
  left join(
    select mdi.symbol, mdi.tradedate, mdi.macdperiod, mdi.diff, mdi.dea, mdi.macd
      from stockmarketstatistics.macd_daily_index mdi 
     where mdi.tradedate =  ${sql0}
       and mdi.macdperiod = '12-26-9'
  ) macd on kdj.symbol = macd.symbol and kdj.tradedate = macd.tradedate
  left join(
    select symbol, tradedate,
         MAX(CASE WHEN bdi.bollperiod = 20 THEN bdi.lowerband END) AS "lower20",
         MAX(CASE WHEN bdi.bollperiod = 20 THEN bdi.middleband END) AS "middle20",
         MAX(CASE WHEN bdi.bollperiod = 20 THEN bdi.upperband END) AS "upper20",
         MAX(CASE WHEN bdi.bollperiod = 50 THEN bdi.lowerband END) AS "lower50",
         MAX(CASE WHEN bdi.bollperiod = 50 THEN bdi.middleband END) AS "middle50",
         MAX(CASE WHEN bdi.bollperiod = 50 THEN bdi.upperband END) AS "upper50"
     from stockmarketstatistics.boll_daily_index bdi
   where bdi.tradedate = ${sql0}
       and bdi.bollperiod in ('20','50')
    GROUP by symbol, tradedate
  ) boll on kdj.symbol = boll.symbol and kdj.tradedate = boll.tradedate
order by kdj.symbol
`;

    const sql22 = `
        
    select dbf.tradedate as '交易日期',
        dbf.symbol as '股票代码',
        dbf.stockname_cn as '股票名称(中文)',
        sba.area as '所在城市',
        sba.industry as '所属行业',
        dbf.pct_chg as '当日涨跌幅' ,
        case when dbf.pct_chg > 9.8 then 1 else 0 end as "涨幅次数",
        case when dbf.pct_chg <= -9.6 then 1 else 0 end as "跌幅次数",
        ads_trd.trade_act_name as '交易信号名称',
        CONVERT(dbf.close,DECIMAL(10,2)) as '当日收盘价',
      round(dbf.total_mv/100000000,2)  as "总市值 （亿）", 
       round(dbf.circ_mv/100000000,2)  as "流通市值（亿）", 
        round((dbf.total_mv - dbf.circ_mv)/100000000,2)  as "非流通市值（亿）"


    from stockmarket.ts_daily_befadjust dbf inner join stockmarket.stock_basic_ash sba on dbf.symbol = sba.symbol
    inner join (select akts.tradedate, akts.symbol, akts.trade_act_name from stockmarketstatistics.ads_kdj_tradesignal_summary akts
                where   akts.tradedate >= '${twoMonthsAgoFormattedDate}' and akts.tradedate <= '${currentFormattedDate}'
                    and tradesignal_power = 2) ads_trd on ads_trd.symbol = dbf.symbol and ads_trd.tradedate = dbf.tradedate
    where  dbf.tradedate = 
       ${sql0}
    `;

    const sql2 = `and dbf.symbol = '${code}'`;

    const sql3 = `and dbf.isst = 'N'
     order by 2 desc,1
    `;

    let sql = "";
    sql = sql1; // +" "+( code?sql2:"") +" "+ sql3;

    // and dbf.close >= 10 and dbf.close <= 20
    //         dbf.total_mv as "总市值 （亿）",
    // dbf.circ_mv as "流通市值（亿）",
    //         round(dbf.total_mv - dbf.circ_mv,2) as "非流通市值（亿）"
    const sqll44 = `
   select 
   akts.tradedate    as "交易日期", 
       akts.symbol     as "股票代码", 
       akts.stockname_cn   as "股票名称(中文)", 
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
};

const get_tradesignal_dashboard_etf = (params?: any) => {
    // 获取当前日期
    const currentDate = new Date();

    // 当前时间点
    const currentFormattedDate = currentDate.toISOString().split("T")[0];

    // 两个月前的时间点
    const twoMonthsAgoDate = subtractMonths(currentDate, 2);
    const twoMonthsAgoFormattedDate = twoMonthsAgoDate
        .toISOString()
        .split("T")[0];

    // 输出时间点
    console.log(
        `时间跨度: ${currentFormattedDate}` +
            " - " +
            `${twoMonthsAgoFormattedDate}`
    );
    // console.log(`两个月前: ${twoMonthsAgoFormattedDate}`);

    // let result = getLastMonthFirstDayAndCurrentMonthLastDay();
    // console.log("上个月第一天:", result.lastMonthFirstDay);
    // console.log("上个月最后一天:", result.lastMonthLastDay);
    // console.log("当前月最后一天:", result.currentMonthLastDay);
    let code = params?.stockcode || null; //"601636";
    let date = params?.date || null;
    //   dbf.close as '当日收盘价',

    let sql0 = date
        ? "'" + date + "'"
        : `(select dbf.tradedate from stockmarket.ts_daily_befadjust dbf inner join stockmarket.stock_basic_ash sba on dbf.symbol = sba.symbol
    inner join (select akts.tradedate, akts.symbol, akts.trade_act_name from stockmarketstatistics.ads_kdj_tradesignal_summary akts
                where   akts.tradedate >= '${twoMonthsAgoFormattedDate}' and akts.tradedate <= '${currentFormattedDate}'
                    and tradesignal_power = 2) ads_trd on ads_trd.symbol = dbf.symbol and ads_trd.tradedate = dbf.tradedate
    where  dbf.tradedate >='${twoMonthsAgoFormattedDate}' and dbf.tradedate <= '${currentFormattedDate}' and dbf.symbol='000001'  order by dbf.symbol,  dbf.tradedate desc limit 1
 )
    `;

    const sql1 = `
        
    select
tradedate as '交易日期', fundsymbol as '股票代码' , fundname_cn as '股票名称(中文)',  open as '当日开盘价', high as '当日最高价', low as '当日最低价', close as '当日收盘价', pre_close  as '前一日收盘价', price_change as '当日涨跌幅', volumn as '当日成交量', amount  as '当日成交额',  fundmarket  as '所属交易所'

from etfmarket.fund_daily  dbf where tradedate=  ${sql0}`;

    const sql2 = `and dbf.fundsymbol = '${code}'`;

    const sql3 = `
     order by 2 desc,1
    `; //and dbf.isst = 'N'

    let sql = "";
    sql = sql1 + " " + (code ? sql2 : "") + " " + sql3;

    return sql;
};
const get_tradesignal_dashboard_us = (params?: any) => {
    // 获取当前日期
    const currentDate = new Date();

    // 当前时间点
    const currentFormattedDate = currentDate.toISOString().split("T")[0];

    // 两个月前的时间点
    const twoMonthsAgoDate = subtractMonths(currentDate, 2);
    const twoMonthsAgoFormattedDate = twoMonthsAgoDate
        .toISOString()
        .split("T")[0];

    // 输出时间点
    console.log(
        `时间跨度: ${currentFormattedDate}` +
            " - " +
            `${twoMonthsAgoFormattedDate}`
    );
    // console.log(`两个月前: ${twoMonthsAgoFormattedDate}`);

    // let result = getLastMonthFirstDayAndCurrentMonthLastDay();
    // console.log("上个月第一天:", result.lastMonthFirstDay);
    // console.log("上个月最后一天:", result.lastMonthLastDay);
    // console.log("当前月最后一天:", result.currentMonthLastDay);
    let code = params?.stockcode || null; //"601636";
    let date = params?.date || null;
    //   dbf.close as '当日收盘价',

    let sql0 = date
        ? "'" + date + "'"
        : `(select dbf.tradedate from stockmarket.ts_daily_befadjust dbf inner join stockmarket.stock_basic_ash sba on dbf.symbol = sba.symbol
    inner join (select akts.tradedate, akts.symbol, akts.trade_act_name from stockmarketstatistics.ads_kdj_tradesignal_summary akts
                where   akts.tradedate >= '${twoMonthsAgoFormattedDate}' and akts.tradedate <= '${currentFormattedDate}'
                    and tradesignal_power = 2) ads_trd on ads_trd.symbol = dbf.symbol and ads_trd.tradedate = dbf.tradedate
    where  dbf.tradedate >='${twoMonthsAgoFormattedDate}' and dbf.tradedate <= '${currentFormattedDate}' and dbf.symbol='000001'  order by dbf.symbol,  dbf.tradedate desc limit 1
 )
    `;

    const sql1 = `select  symbol as '股票代码', date as '交易日期', open  as '当日开盘价', high as '当日最高价', low as '当日最低价', close as '当日收盘价', adjusted_close  as '前一日收盘价' , volume  as '当日成交量' 
from us_stockmarket.us_daily   dbf where date=  '2002-01-23'`;

    const sql2 = `and dbf.symbol = '${code}'`;

    const sql3 = `
     order by 2 desc,1
    `; //and dbf.isst = 'N'

    let sql = "";
    sql = sql1 + " " + (code ? sql2 : "") + " " + sql3;

    return sql;
};
const get_tradesignal = (params?: any) => {
    // 获取当前日期
    const currentDate = new Date();

    // 当前时间点
    const currentFormattedDate = currentDate.toISOString().split("T")[0];

    // 两个月前的时间点
    const twoMonthsAgoDate = subtractMonths(currentDate, 2);
    const twoMonthsAgoFormattedDate = twoMonthsAgoDate
        .toISOString()
        .split("T")[0];

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
       akts.stockname_cn   as "股票名称(中文)", 
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
};

const get_tradesignaletf = (params?: any) => {
    // 获取当前日期
    const currentDate = new Date();

    // 当前时间点
    const currentFormattedDate = currentDate.toISOString().split("T")[0];

    // 两个月前的时间点
    const twoMonthsAgoDate = subtractMonths(currentDate, 2);
    const twoMonthsAgoFormattedDate = twoMonthsAgoDate
        .toISOString()
        .split("T")[0];

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
tradedate as '交易日期', fundsymbol as '股票代码' , fundname_cn as '股票名称(中文)',  open as '当日开盘价', high as '当日最高价', low as '当日最低价', close as '当日收盘价', pre_close  as '前一日收盘价', price_change as '当日涨跌幅', volumn as '当日成交量', amount  as '当日成交额',  fundmarket  as '所属交易所'

from etfmarket.fund_daily  akts 

 where akts.fundsymbol = '${code}'
   and akts.tradedate >= '${twoMonthsAgoFormattedDate}' and akts.tradedate <= '${currentFormattedDate}'
   order by akts.tradedate desc
 `;
    return sql;
};

const get_tradesignalus = (params?: any) => {
    // 获取当前日期
    const currentDate = new Date();

    // 当前时间点
    const currentFormattedDate = currentDate.toISOString().split("T")[0];

    // 两个月前的时间点
    const twoMonthsAgoDate = subtractMonths(currentDate, 2);
    const twoMonthsAgoFormattedDate = twoMonthsAgoDate
        .toISOString()
        .split("T")[0];

    // 输出时间点
    console.log(`当前时间: ${currentFormattedDate}`);
    console.log(`两个月前: ${twoMonthsAgoFormattedDate}`);

    // let result = getLastMonthFirstDayAndCurrentMonthLastDay();
    // console.log("上个月第一天:", result.lastMonthFirstDay);
    // console.log("上个月最后一天:", result.lastMonthLastDay);
    // console.log("当前月最后一天:", result.currentMonthLastDay);
    let code = params?.stockcode || "601636";

    const sql = `

        select  symbol as '股票代码', date as '交易日期', open  as '当日开盘价', high as '当日最高价', low as '当日最低价', close as '当日收盘价', adjusted_close  as '前一日收盘价' , volume  as '当日成交量' 
        from us_stockmarket.us_daily  akts

 where akts.symbol = '${code}'
   and akts.date >= '2002-01-23' and akts.date <= '2002-03-23'
   order by akts.date desc
 `;
    return sql;
};

import { query } from "@/libs/db";

const get_balancesheet = (params?: any) => {
    let code = params?.stockcode || "000001";

    const sql = `

       SELECT 
    -- tb.symbol           as "股票代码", 
    --    tb.stockname        as "股票名称", 
    --    tb.ann_date         as "公告日期",
    --    tb.f_ann_date       as "实际公告日期",
       tb.end_date        as "报告期",
    --    tb.report_type      as "报表名称",
       tb.comp_type      as "公司类型名称",
       tb.report_end_type    as "报告结束类型名称",
       tb.total_share     as "期末总股本",
       tb.cap_rese       as "资本公积金",
       tb.undistr_porfit     as "未分配利润",
       tb.surplus_rese     as "盈余公积金",
       tb.special_rese     as "专项储备",
       tb.money_cap      as "货币资金",
       tb.trad_asset     as "交易性金融资产",
       tb.notes_receiv     as "应收票据",
       tb.accounts_receiv    as "应收账款",
       tb.oth_receiv     as "其他应收款",
       tb.prepayment     as "预付款项",
       tb.div_receiv     as "应收股利",
       tb.int_receiv     as "应收利息",
       tb.inventories     as "存货",
       tb.amor_exp      as "待摊费用",
       tb.nca_within_1y     as "一年内到期的非流动资产",
       tb.sett_rsrv      as "结算备付金",
       tb.loanto_oth_bank_fi   as "拆出资金",
       tb.premium_receiv    as "应收保费",
       tb.reinsur_receiv    as "应收分保账款",
       tb.reinsur_res_receiv   as "应收分保合同准备金",
       tb.pur_resale_fa     as "买入返售金融资产",
       tb.oth_cur_assets    as "其他流动资产",
       tb.total_cur_assets    as "流动资产合计",
       tb.fa_avail_for_sale    as "可供出售金融资产",
       tb.htm_invest     as "持有至到期投资产",
       tb.lt_eqt_invest     as "长期股权投资",
       tb.invest_real_estate   as "投资性房地产",
       tb.time_deposits     as "定期存款",
       tb.oth_assets     as "其他资产",
       tb.lt_rec      as "长期应收款",
       tb.fix_assets     as "固定资产",
       tb.cip       as "在建工程",
       tb.const_materials     as "工程物资",
       tb.fixed_assets_disp    as "固定资产清理",
       tb.produc_bio_assets    as "生产性生物资产",
       tb.oil_and_gas_assets   as "油气资产",
       tb.intan_assets     as "无形资产",
       tb.r_and_d      as "研发支出",
       tb.goodwill      as "商誉",
       tb.lt_amor_exp     as "长期待摊费用",
       tb.defer_tax_assets    as "递延所得税资产",
       tb.decr_in_disbur    as "发放贷款及垫款",
       tb.oth_nca      as "其他非流动资产",
       tb.total_nca      as "非流动资产合计",
       tb.cash_reser_cb     as "现金及存放中央银行款项",
       tb.depos_in_oth_bfi    as "存放同业和其它金融机构款项",
       tb.prec_metals     as "贵金属",
       tb.deriv_assets     as "衍生金融资产",
       tb.rr_reins_une_prem    as "应收分保未到期责任准备金",
       tb.rr_reins_outstd_cla   as "应收分保未决赔款准备金",
       tb.rr_reins_lins_liab   as "应收分保寿险责任准备金",
       tb.rr_reins_lthins_liab   as "应收分保长期健康险责任准备金",
       tb.refund_depos     as "存出保证金",
       tb.ph_pledge_loans    as "保户质押贷款",
       tb.refund_cap_depos    as "存出资本保证金",
       tb.indep_acct_assets    as "独立账户资产",
       tb.client_depos     as "其中:客户资金存款",
       tb.client_prov     as "其中:客户备付金",
       tb.transac_seat_fee    as "其中:交易席位费",
       tb.invest_as_receiv    as "应收款项类投资",
       tb.total_assets     as "资产总计",
       tb.lt_borr      as "长期借款",
       tb.st_borr      as "短期借款",
       tb.cb_borr      as "向中央银行借款",
       tb.depos_ib_deposits    as "吸收存款及同业存放",
       tb.loan_oth_bank     as "拆入资金",
       tb.trading_fl     as "交易性金融负债",
       tb.notes_payable     as "应付票据",
       tb.acct_payable     as "应付账款",
       tb.adv_receipts     as "预收款项",
       tb.sold_for_repur_fa    as "卖出回购金融资产款",
       tb.comm_payable     as "应付手续费及佣金",
       tb.payroll_payable    as "应付职工薪酬",
       tb.taxes_payable     as "应交税费",
       tb.int_payable     as "应付利息",
       tb.div_payable     as "应付股利",
       tb.oth_payable     as "其他应付款",
       tb.acc_exp      as "预提费用",
       tb.deferred_inc     as "递延收益",
       tb.st_bonds_payable    as "应付短期债券",
       tb.payable_to_reinsurer   as "应付分保账款",
       tb.rsrv_insur_cont    as "保险合同准备金",
       tb.acting_trading_sec   as "代理买卖证券款",
       tb.acting_uw_sec     as "代理承销证券款",
       tb.non_cur_liab_due_1y   as "一年内到期的非流动负债",
       tb.oth_cur_liab     as "其他流动负债",
       tb.total_cur_liab    as "流动负债合计",
       tb.bond_payable     as "应付债券",
       tb.lt_payable     as "长期应付款",
       tb.specific_payables    as "专项应付款",
       tb.estimated_liab    as "预计负债",
       tb.defer_tax_liab    as "递延所得税负债",
       tb.defer_inc_non_cur_liab  as "递延收益-非流动负债",
       tb.oth_ncl      as "其他非流动负债",
       tb.total_ncl      as "非流动负债合计",
       tb.depos_oth_bfi     as "同业和其它金融机构存放款项",
       tb.deriv_liab     as "衍生金融负债",
       tb.depos       as "吸收存款",
       tb.agency_bus_liab    as "代理业务负债",
       tb.oth_liab      as "其他负债",
       tb.prem_receiv_adva    as "预收保费",
       tb.depos_received    as "存入保证金",
       tb.ph_invest      as "保户储金及投资款",
       tb.reser_une_prem    as "未到期责任准备金",
       tb.reser_outstd_claims   as "未决赔款准备金",
       tb.reser_lins_liab    as "寿险责任准备金",
       tb.reser_lthins_liab    as "长期健康险责任准备金",
       tb.indept_acc_liab    as "独立账户负债",
       tb.pledge_borr     as "其中:质押借款",
       tb.indem_payable     as "应付赔付款",
       tb.policy_div_payable   as "应付保单红利",
       tb.total_liab     as "负债合计",
       tb.treasury_share    as "减:库存股",
       tb.ordin_risk_reser    as "一般风险准备",
       tb.forex_differ     as "外币报表折算差额",
       tb.invest_loss_unconf   as "未确认的投资损失",
       tb.minority_int     as "少数股东权益",
       tb.total_hldr_eqy_exc_min_int as "股东权益合计(不含少数股东权益)",
       tb.total_hldr_eqy_inc_min_int as "股东权益合计(含少数股东权益)",
       tb.total_liab_hldr_eqy   as "负债及股东权益总计",
       tb.lt_payroll_payable   as "长期应付职工薪酬",
       tb.oth_comp_income    as "其他综合收益",
       tb.oth_eqt_tools     as "其他权益工具",
       tb.oth_eqt_tools_p_shr   as "其他权益工具(优先股)",
       tb.lending_funds     as "融出资金",
       tb.acc_receivable    as "应收款项",
       tb.st_fin_payable    as "应付短期融资款",
       tb.payables      as "应付款项",
       tb.hfs_assets     as "持有待售的资产",
       tb.hfs_sales      as "持有待售的负债",
       tb.cost_fin_assets    as "以摊余成本计量的金融资产",
       tb.fair_value_fin_assets   as "以公允价值计量且其变动计入其他综合收益的金融资产",
       tb.cip_total      as "在建工程(合计)(元)",
       tb.oth_pay_total     as "其他应付款(合计)(元)",
       tb.long_pay_total    as "长期应付款(合计)(元)",
       tb.debt_invest     as "债权投资(元)",
       tb.oth_debt_invest    as "其他债权投资(元)",
       tb.oth_eq_invest     as "其他权益工具投资(元)",
       tb.oth_illiq_fin_assets   as "其他非流动金融资产(元)",
       tb.oth_eq_ppbond     as "其他权益工具:永续债(元)",
       tb.receiv_financing    as "应收款项融资",
       tb.use_right_assets    as "使用权资产",
       tb.lease_liab     as "租赁负债",
       tb.contract_assets    as "合同资产",
       tb.contract_liab     as "合同负债",
       tb.accounts_receiv_bill   as "应收票据及应收账款",
       tb.accounts_pay     as "应付票据及应付账款",
       tb.oth_rcv_total     as "其他应收款(合计)（元）",
       tb.fix_assets_total    as "固定资产(合计)(元)"     
  FROM stockmarket.ts_balancesheet tb
 WHERE tb.symbol = '${code}'
   and tb.report_end_type_no = 4
   and tb.update_flag = (
           SELECT MAX(tmp.update_flag) 
           FROM stockmarket.ts_balancesheet tmp
            WHERE tb.symbol = '${code}'
            AND tb.report_end_type_no = 4
           AND tmp.symbol = tb.symbol AND tmp.ann_date = tb.ann_date) order by tb.ann_date desc
 `;
    return sql;
    
}
const get_income = (params?: any) => {
    let code = params?.stockcode || "000001";

    const sql = `
    SELECT 
--  ti.symbol      as "股票代码", 
--  ti.stockname     as "股票名称", 
--  ti.ann_date      as "公告日期", 
--  ti.f_ann_date     as "实际公告日期",
    ti.end_date      as "报告期",
--  ti.report_type     as "报表名称",
    ti.comp_type     as "公司类型名称",
    ti.report_end_type    as "报告结束类型名称",
    ti.basic_eps     as "净利润",
    ti.diluted_eps     as "财务费用",
    ti.total_revenue    as "营业总收入",
    ti.revenue      as "营业收入",
    ti.int_income     as "利息收入",
    ti.prem_earned     as "已赚保费",
    ti.comm_income     as "手续费及佣金收入",
    ti.n_commis_income    as "手续费及佣金净收入",
    ti.n_oth_income     as "其他经营净收益",
    ti.n_oth_b_income    as "加:其他业务净收益",
    ti.prem_income     as "保险业务收入",
    ti.out_prem      as "减:分出保费",
    ti.une_prem_reser    as "提取未到期责任准备金",
    ti.reins_income     as "其中:分保费收入",
    ti.n_sec_tb_income    as "代理买卖证券业务净收入",
    ti.n_sec_uw_income    as "证券承销业务净收入",
    ti.oth_b_income     as "其他业务收入",
    ti.fv_value_chg_gain   as "加:公允价值变动净收益",
    ti.invest_income    as "投资净收益",
    ti.ass_invest_income   as "其中: 对联营企业和合营企业的投资收益",
    ti.forex_gain     as "加:汇兑净收益",
    ti.total_cogs     as "营业总成本",
    ti.oper_cost     as "减:营业成本",
    ti.int_exp      as "减:利息支出",
    ti.comm_exp      as "减:手续费及佣金支出",
    ti.biz_tax_surchg    as "减:营业税金及附加",
    ti.sell_exp     as "减:销售费用",
    ti.admin_exp     as "减:管理费用",
    ti.fin_exp     as "减:财务费用",
    ti.assets_impair_loss  as "减:资产减值损失",
    ti.prem_refund    as "退保金",
    ti.compens_payout   as "赔付总支出",
    ti.reser_insur_liab   as "提取保险责任准备金",
    ti.div_payt     as "保户红利支出",
    ti.reins_exp     as "分保费用",
    ti.oper_exp     as "营业支出",
    ti.compens_payout_refu  as "减:摊回赔付支出",
    ti.insur_reser_refu   as "减:摊回保险责任准备金",
    ti.reins_cost_refund   as "减:摊回分保费用",
    ti.other_bus_cost   as "其他业务成本",
    ti.operate_profit   as "营业利润",
    ti.non_oper_income   as "加:营业外收入",
    ti.non_oper_exp    as "减:营业外支出",
    ti.nca_disploss    as "其中:减:非流动资产处置净损失",
    ti.total_profit    as "利润总额",
    ti.income_tax    as "所得税费用",
    ti.n_income     as "净利润(含少数股东损益)",
    ti.n_income_attr_p   as "净利润(不含少数股东损益)",
    ti.minority_gain    as "少数股东损益",
    ti.oth_compr_income   as "其他综合收益",
    ti.t_compr_income   as "综合收益总额",
    ti.compr_inc_attr_p   as "归属于母公司(或股东)的综合收益总额",
    ti.compr_inc_attr_m_s  as "归属于少数股东的综合收益总额",
    ti.ebit      as "息税前利润",
    ti.ebitda     as "息税折旧摊销前利润",
    ti.insurance_exp    as "保险业务支出",
    ti.undist_profit    as "年初未分配利润",
    ti.distable_profit   as "可分配利润",
    ti.rd_exp     as "研发费用",
    ti.fin_exp_int_exp   as "财务费用:利息费用",
    ti.fin_exp_int_inc   as "财务费用:利息收入",
    ti.transfer_surplus_rese  as "盈余公积转入",
    ti.transfer_housing_imprest as "住房周转金转入",
    ti.transfer_oth    as "其他转入",
    ti.adj_lossgain    as "调整以前年度损益",
    ti.withdra_legal_surplus  as "提取法定盈余公积",
    ti.withdra_legal_pubfund  as "提取法定公益金",
    ti.withdra_biz_devfund  as "提取企业发展基金",
    ti.withdra_rese_fund   as "提取储备基金",
    ti.withdra_oth_ersu   as "提取任意盈余公积金",
    ti.workers_welfare   as "职工奖金福利",
    ti.distr_profit_shrhder  as "可供股东分配的利润",
    ti.prfshare_payable_dvd  as "应付优先股股利",
    ti.comshare_payable_dvd  as "应付普通股股利",
    ti.capit_comstock_div  as "转作股本的普通股股利",
    ti.net_after_nr_lp_correct as "扣除非经常性损益后的净利润（更正前）",
    ti.credit_impa_loss   as "信用减值损失",
    ti.net_expo_hedging_benefits as "净敞口套期收益",
    ti.oth_impair_loss_assets as "其他资产减值损失", 
    ti.total_opcost    as "营业总成本（二）",
    ti.amodcost_fin_assets  as "以摊余成本计量的金融资产终止确认收益",
    ti.oth_income    as "其他收益",
    ti.asset_disp_income   as "资产处置收益",
    ti.continued_net_profit  as "持续经营净利润",
    ti.end_net_profit   as "终止经营净利润"
  FROM stockmarket.ts_income ti
 WHERE ti.symbol = '${code}'
   and ti.report_end_type_no = 4
   and ti.update_flag = (
           SELECT MAX(tmp.update_flag) 
         FROM stockmarket.ts_income tmp
       WHERE tmp.symbol = '${code}'
         and tmp.report_end_type_no = 4
       and tmp.symbol = ti.symbol AND tmp.ann_date = ti.ann_date) order by ti.ann_date desc
 `;
    return sql;
    
}


const ts_cashflow = (params?: any) => {
    let code = params?.stockcode || "000001";

    const sql = `
    SELECT 
     --     tc.symbol           as "股票代码", 
    --    tc.stockname        as "股票名称", 
    --    tc.ann_date         as "公告日期",
    --    tc.f_ann_date       as "实际公告日期",
       tc.end_date        as "报告期",
    --    tc.report_type      as "报表名称",
       tc.comp_type      as "公司类型名称",
       tc.report_end_type    as "报告结束类型名称",
       tc.net_profit     as "净利润",
       tc.finan_exp      as "财务费用",
       tc.c_fr_sale_sg     as "销售商品、提供劳务收到的现金",
       tc.recp_tax_rends    as "收到的税费返还",
       tc.n_depos_incr_fi    as "客户存款和同业存放款项净增加额",
       tc.n_incr_loans_cb    as "向中央银行借款净增加额",
       tc.n_inc_borr_oth_fi    as "向其他金融机构拆入资金净增加额",
       tc.prem_fr_orig_contr   as "收到原保险合同保费取得的现金",
       tc.n_incr_insured_dep   as "保户储金净增加额",
       tc.n_reinsur_prem    as "收到再保业务现金净额",
       tc.n_incr_disp_tfa    as "处置交易性金融资产净增加额",
       tc.ifc_cash_incr     as "收取利息和手续费净增加额",
       tc.n_incr_disp_faas    as "处置可供出售金融资产净增加额",
       tc.n_incr_loans_oth_bank   as "拆入资金净增加额",
       tc.n_cap_incr_repur    as "回购业务资金净增加额",
       tc.c_fr_oth_operate_a   as "收到其他与经营活动有关的现金",
       tc.c_inf_fr_operate_a   as "经营活动现金流入小计",
       tc.c_paid_goods_s    as "购买商品、接受劳务支付的现金",
       tc.c_paid_to_for_empl   as "支付给职工以及为职工支付的现金",
       tc.c_paid_for_taxes    as "支付的各项税费",
       tc.n_incr_clt_loan_adv   as "客户贷款及垫款净增加额",
       tc.n_incr_dep_cbob    as "存放央行和同业款项净增加额",
       tc.c_pay_claims_orig_inco  as "支付原保险合同赔付款项的现金", 
       tc.pay_handling_chrg    as "支付手续费的现金",
       tc.pay_comm_insur_plcy   as "支付保单红利的现金",
       tc.oth_cash_pay_oper_act   as "支付其他与经营活动有关的现金",
       tc.st_cash_out_act    as "经营活动现金流出小计",
       tc.n_cashflow_act    as "经营活动产生的现金流量净额",
       tc.oth_recp_ral_inv_act   as "收到其他与投资活动有关的现金",
       tc.c_disp_withdrwl_invest  as "收回投资收到的现金",
       tc.c_recp_return_invest   as "取得投资收益收到的现金",
       tc.n_recp_disp_fiolta   as "处置固定资产、无形资产和其他长期资产收回的现金净额",
       tc.n_recp_disp_sobu    as "处置子公司及其他营业单位收到的现金净额",
       tc.stot_inflows_inv_act   as "投资活动现金流入小计",
       tc.c_pay_acq_const_fiolta  as "购建固定资产、无形资产和其他长期资产支付的现金",
       tc.c_paid_invest     as "投资支付的现金",
       tc.n_disp_subs_oth_biz   as "取得子公司及其他营业单位支付的现金净额",
       tc.oth_pay_ral_inv_act   as "支付其他与投资活动有关的现金",
       tc.n_incr_pledge_loan   as "质押贷款净增加额",
       tc.stot_out_inv_act    as "投资活动现金流出小计",
       tc.n_cashflow_inv_act   as "投资活动产生的现金流量净额",
       tc.c_recp_borrow     as "取得借款收到的现金",
       tc.proc_issue_bonds    as "发行债券收到的现金",
       tc.oth_cash_recp_ral_fnc_act  as "收到其他与筹资活动有关的现金",
       tc.stot_cash_in_fnc_act   as "筹资活动现金流入小计",
       tc.free_cashflow     as "企业自由现金流量",
       tc.c_prepay_amt_borr    as "偿还债务支付的现金",
       tc.c_pay_dist_dpcp_int_exp  as "分配股利、利润或偿付利息支付的现金",
       tc.incl_dvd_profit_paid_sc_ms as "其中:子公司支付给少数股东的股利、利润", 
       tc.oth_cashpay_ral_fnc_act  as "支付其他与筹资活动有关的现金", 
       tc.stot_cashout_fnc_act   as "筹资活动现金流出小计",
       tc.n_cash_flows_fnc_act   as "筹资活动产生的现金流量净额",
       tc.eff_fx_flu_cash    as "汇率变动对现金的影响",
       tc.n_incr_cash_cash_equ   as "现金及现金等价物净增加额",
       tc.c_cash_equ_beg_period   as "期初现金及现金等价物余额",
       tc.c_cash_equ_end_period   as "期末现金及现金等价物余额",
       tc.c_recp_cap_contrib   as "吸收投资收到的现金",
       tc.incl_cash_rec_saims   as "其中:子公司吸收少数股东投资收到的现金",
       tc.uncon_invest_loss    as "未确认投资损失",
       tc.prov_depr_assets    as "加:资产减值准备",
       tc.depr_fa_coga_dpba    as "固定资产折旧、油气资产折耗、生产性生物资产折旧",
       tc.amort_intang_assets   as "无形资产摊销",
       tc.lt_amort_deferred_exp   as "长期待摊费用摊销",
       tc.decr_deferred_exp    as "待摊费用减少",
       tc.incr_acc_exp     as "预提费用增加",
       tc.loss_disp_fiolta    as "处置固定、无形资产和其他长期资产的损失",
       tc.loss_scr_fa     as "固定资产报废损失",
       tc.loss_fv_chg     as "公允价值变动损失",
       tc.invest_loss     as "投资损失",
       tc.decr_def_inc_tax_assets  as "递延所得税资产减少",
       tc.incr_def_inc_tax_liab   as "递延所得税负债增加",
       tc.decr_inventories    as "存货的减少",
       tc.decr_oper_payable    as "经营性应收项目的减少",
       tc.incr_oper_payable    as "经营性应付项目的增加",
       tc.others      as "其他",
       tc.im_net_cashflow_oper_act  as "经营活动产生的现金流量净额(间接法)",
       tc.conv_debt_into_cap   as "债务转为资本",
       tc.conv_copbonds_due_within_1y as "一年内到期的可转换公司债券",
       tc.fa_fnc_leases     as "融资租入固定资产",
       tc.im_n_incr_cash_equ   as "现金及现金等价物净增加额(间接法)",
       tc.net_dism_capital_add   as "拆出资金净增加额",
       tc.net_cash_rece_sec    as "代理买卖证券收到的现金净额(元)",
       tc.credit_impa_loss    as "信用减值损失",
       tc.use_right_asset_dep   as "使用权资产折旧",
       tc.oth_loss_asset    as "其他资产减值损失",
       tc.end_bal_cash     as "现金的期末余额",
       tc.beg_bal_cash     as "减:现金的期初余额",
       tc.end_bal_cash_equ    as "加:现金等价物的期末余额",
       tc.beg_bal_cash_equ     as "减:现金等价物的期初余额"
  FROM stockmarket.ts_cashflow tc
 WHERE tc.symbol = '${code}'
   and tc.report_end_type_no = 4
   and tc.update_flag = (
           SELECT MAX(tmp.update_flag) 
           FROM stockmarket.ts_cashflow tmp
            WHERE tmp.symbol = '${code}'
            AND tmp.report_end_type_no = 4
       and tmp.symbol = tc.symbol AND tmp.ann_date = tc.ann_date) order by tc.ann_date desc
    `;
    return sql;

}
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
        case "income":
            sql = get_income(params);
            break;
        case "balancesheet":
            sql = get_balancesheet(params);
            break;
        case "cashflow":
            sql = ts_cashflow(params);
            break;
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
            sql = get_countryname_cn();
            break;
        case "cataloguelist":
            sql = get_catalogue_list(params);
            break;

        case "tradesignal":
            sql = get_tradesignal(params);
            break;
        case "tradesignaletf":
            sql = get_tradesignaletf(params);
            break;

        case "tradesignaldashboardetf":
            sql = get_tradesignal_dashboard_etf(params);
            break;
        case "tradesignalus":
            sql = get_tradesignalus(params);
            break;

        case "tradesignaldashboardus":
            sql = get_tradesignal_dashboard_us(params);
            break;
        case "tradesignaldashboard":
            sql = get_tradesignal_dashboard(params);
            break;
        case "tradesignalkdj":
            sql = get_tradesignal_kdj(params);
            break;

        default:
            break;
    }

    try {
        console.log("[SQL]:", sql);

        const results: any = await query({
            query: sql,
        });

        // console.log(results); // results contains rows returned by server
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


