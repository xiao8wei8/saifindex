import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import urlencode from "urlencode";
export const dynamic = "force-dynamic";
// import mysql from "mysql2/promise";
import md5 from "@/libs/md5";
import fs from "fs";
import path from "path";
import { getDatabase, filterSql, getDatabaseList } from "@/libs/util";
import qwen from "@/libs/qwen";
let input = ""; //"请查询平安银行的股票代码。做为数据库专家，请优化查询到的SQL语句";
const token = "sk-LEWwEyfUgRH8E4ASUeQ7hsz5MQG1KMu48_c8Ngya8Oo";
const urlmapping_a = "https://app.chat2db-ai.com/api/ai/rest/mapping_a";
const urlprompt_a = "https://api.chat2db-ai.com/api/ai/rest/prompt_a";
const urlchat_a = "https://api.chat2db-ai.com/api/ai/rest/chat_a";

axios.defaults.withCredentials = true;

const isDebug = false;
const axiosinstance = axios.create({
    timeout: 600000,
});
// 添加请求拦截器
axiosinstance.interceptors.request.use(
    function (config) {
        // 在发送请求之前做些什么
        if (isDebug) {
            console.log("[axios]request config.method:", config.method);
            console.log("[axios]request config.url:", config.url);
            console.log(
                "[axios]request config.headers:",
                JSON.stringify(config.headers, null, 4)
            );
            console.log(
                "[axios]request config.data:",
                JSON.stringify(config.data, null, 4)
            );
        }

        return config;
    },
    function (error) {
        if (isDebug) {
            console.log("[axios]request error:", error);
        }

        // 对请求错误做些什么
        return Promise.reject(error);
    }
);

// 添加响应拦截器
axiosinstance.interceptors.response.use(
    function (response) {
        // 2xx 范围内的状态码都会触发该函数。
        // 对响应数据做点什么
        if (isDebug) {
            console.log(
                "[axios]response data.data:",
                JSON.stringify(response.data, null, 4)
            );
        }

        return response;
    },
    function (error) {
        // 超出 2xx 范围的状态码都会触发该函数。
        // 对响应错误做点什么
        if (isDebug) {
            console.log("[axios]response error:", error);
        }
        return Promise.reject(error);
    }
);
const devData = {
    dataSourceId: 43460,
    dataSourceName: "47.100.65.64",
    dataSourceCollectionId: 2839,
};
const proData = {
    dataSourceId: 46845,
    dataSourceName: "101.34.245.222",
    dataSourceCollectionId: 3115,
};

const environment: any = "pro"; //dev
const environmentData = environment === "dev" ? devData : proData;

/**
 * 0、默认参数{"message":"查询农业银行的股票代码","dataSourceId":43460,"dataSourceCollectionId":2839}
 * 1、调用table接口，并将0的参数传入，获取table的数据表结构定义
 * 2、调用sql_generate接口，传入1的数据表结构和0的参数，获取sql 的token
 * 3、调用chat接口，并且传入2的token，获取sql信息
 * 4、调用execute接口，传入3的sql，获取结果
 */
//2025-09-16T13:23:32.462Z
const cookie1 =
    "Chat2DB-Country=CN; _ga=GA1.1.1894398614.1725704903; CHAT2DB=e61f553e-3c87-404c-8eaa-73528f859c37; Chat2db-Organization-Token=MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCL2U3hmDAxE/+n52DX+mwci2hZTN5TSAnhf3+HF14+tFkZbbIJjfgOxoWaTW3JoPC9c5nX0uJbfthbhitWrOIfkSHtT46AFMMpB1wQpoTOVsUS4n5QNHLm8DdjNXwXvJrTPzDIlu9DC6tXlIb2xIjuvoPf92+GazQT1WCDmrKHep/W4INqL8jmCNUnqQfAY4xYDLGI0efap0k0G2MZaUaxFQaT5oLA+ZktazExLDB66331FFJEE8x8zikeeswcglQtGlugx/TJTCSeqoxxwkoxyw7LIsaxecixpplyXkUf1Jpv4EkuYzMWamREQGNZ+iOi0jGFBIjXlfB8MGAo9F8fAgMBAAECggEAJbtBigZXqkYtCg4hUORd2u25/63/phSfpdmSfM5PPTfHelbgXDeTn9jsHw+Y+XeUvGi+Lz7Ul78HfNocQ0xtzfqIXtDCL8hqR12W918WId3DWi8FyXn9LlXNe9ToYDcgxrIb5WLjtwEk/4IxT88C6vc3+Wt3CZtO97LwUVGhrW+AKSObo6J81HOl01cXaYKirCCkjYYERauaW7Y6SjBvUr/SUyrcXF4gARBQ0jQ0/tUs/57L+4tz6oFHjMQ4bk79b9xUyRQPuEQpDMTGTYsz5PjVmVe/z7an69QxDTaZwVLMMR6+B75TXQ0ZJbh8R5xWerIzDG06tqjwRcc148cvMQKBgQC/UlGMogwLXyap+E7zTibBn2RD09QHlJrx+XydcARZr7otzMDGfdoqyqPy+xANAOd5owmhYeVLjmT3x6P5IJFp6LY75ByLRbuIAVV+NGD3lu6Rp7DyI9PVspX+woILXOxyl+wM1vQXtF+xR0knxaNpgtjNwTi2KQlgwO1FqNWo/QKBgQC7IFhXehKIo77lcdJSwDcdJePOtQqXOOACOV3aTSFDP4G/g5NtdIPCI2r9qTH0O/1NMPKxMnSzZvdlFTpqW8POKuJc3yTXkikTNHTGoIDzZSMpgs5iyv/OEgeHPLUQJxYsekv8FMWrXHm+GGveFEHoCL3cIDg/JxGon48H7ORhSwKBgQC7Wq+FWoMU977zH7igxt1pKt+TFHNEYSBC6aBAxJteAJn/k80ME957nSlkHrwfH82N7jzWDvnuPaleg+BtbJk576vVhpL1R/pXO4cvKbfzfZhuhpre5HrjgBkm++9BlWPu7Bs6j51FQVucTUS0b/SQtJP/GcKhkBog54zzdFyXOQKBgQClrubpVUmRuEIuz4/k+xIRednxzPR6nr4g2gBSaJZ5/4H3Ox3O/SooO8ngnO2BDZiivyMzZ7RSoGmOE7SsNWHyaqAQkPcC9APwYDLBJ53lY/g1Kf9pE8pZADewMz0x9xm3+fTLVu0KZA/bE652bMNKGmtYuyJyMDp/bf9rigFQbwKBgGY8F8CjyYb0hYdqiSocp6+4VqN+TO9unQJoMOKqGpuvjK+SQU93C9UA2t2Svh61MegRo/oVkQBV8oavvWMePovYi70KEDrpt3DnvYIogosamp2jXsCvx4VuFdzLdef+M+PFhVYPu7IfQsZacwlydbDUT8KbycaQLDJmUcP0a1+R; Chat2db-Organization-Id=23630; Chat2db-BS-TOKEN=NjY3MTM4MA==; _ga_HLJ1ZEFTZM=GS1.1.1726414686.5.0.1726414686.0.0.0; _ga_V8M4E5SF61=GS1.1.1726414690.4.1.1726414697.0.0.0";

const cookie=
"Chat2DB-Country=CN; _ga=GA1.1.1894398614.1725704903; Chat2db-Organization-Token=MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCL2U3hmDAxE/+n52DX+mwci2hZTN5TSAnhf3+HF14+tFkZbbIJjfgOxoWaTW3JoPC9c5nX0uJbfthbhitWrOIfkSHtT46AFMMpB1wQpoTOVsUS4n5QNHLm8DdjNXwXvJrTPzDIlu9DC6tXlIb2xIjuvoPf92+GazQT1WCDmrKHep/W4INqL8jmCNUnqQfAY4xYDLGI0efap0k0G2MZaUaxFQaT5oLA+ZktazExLDB66331FFJEE8x8zikeeswcglQtGlugx/TJTCSeqoxxwkoxyw7LIsaxecixpplyXkUf1Jpv4EkuYzMWamREQGNZ+iOi0jGFBIjXlfB8MGAo9F8fAgMBAAECggEAJbtBigZXqkYtCg4hUORd2u25/63/phSfpdmSfM5PPTfHelbgXDeTn9jsHw+Y+XeUvGi+Lz7Ul78HfNocQ0xtzfqIXtDCL8hqR12W918WId3DWi8FyXn9LlXNe9ToYDcgxrIb5WLjtwEk/4IxT88C6vc3+Wt3CZtO97LwUVGhrW+AKSObo6J81HOl01cXaYKirCCkjYYERauaW7Y6SjBvUr/SUyrcXF4gARBQ0jQ0/tUs/57L+4tz6oFHjMQ4bk79b9xUyRQPuEQpDMTGTYsz5PjVmVe/z7an69QxDTaZwVLMMR6+B75TXQ0ZJbh8R5xWerIzDG06tqjwRcc148cvMQKBgQC/UlGMogwLXyap+E7zTibBn2RD09QHlJrx+XydcARZr7otzMDGfdoqyqPy+xANAOd5owmhYeVLjmT3x6P5IJFp6LY75ByLRbuIAVV+NGD3lu6Rp7DyI9PVspX+woILXOxyl+wM1vQXtF+xR0knxaNpgtjNwTi2KQlgwO1FqNWo/QKBgQC7IFhXehKIo77lcdJSwDcdJePOtQqXOOACOV3aTSFDP4G/g5NtdIPCI2r9qTH0O/1NMPKxMnSzZvdlFTpqW8POKuJc3yTXkikTNHTGoIDzZSMpgs5iyv/OEgeHPLUQJxYsekv8FMWrXHm+GGveFEHoCL3cIDg/JxGon48H7ORhSwKBgQC7Wq+FWoMU977zH7igxt1pKt+TFHNEYSBC6aBAxJteAJn/k80ME957nSlkHrwfH82N7jzWDvnuPaleg+BtbJk576vVhpL1R/pXO4cvKbfzfZhuhpre5HrjgBkm++9BlWPu7Bs6j51FQVucTUS0b/SQtJP/GcKhkBog54zzdFyXOQKBgQClrubpVUmRuEIuz4/k+xIRednxzPR6nr4g2gBSaJZ5/4H3Ox3O/SooO8ngnO2BDZiivyMzZ7RSoGmOE7SsNWHyaqAQkPcC9APwYDLBJ53lY/g1Kf9pE8pZADewMz0x9xm3+fTLVu0KZA/bE652bMNKGmtYuyJyMDp/bf9rigFQbwKBgGY8F8CjyYb0hYdqiSocp6+4VqN+TO9unQJoMOKqGpuvjK+SQU93C9UA2t2Svh61MegRo/oVkQBV8oavvWMePovYi70KEDrpt3DnvYIogosamp2jXsCvx4VuFdzLdef+M+PFhVYPu7IfQsZacwlydbDUT8KbycaQLDJmUcP0a1+R; Chat2db-Organization-Id=23630; Chat2db-BS-TOKEN=NjY3MTM4MA==; _ga_V8M4E5SF61=GS1.1.1728484273.17.1.1728484873.0.0.0; Chat2DB-Country=CN; Chat2db-Organization-Id=23630; Chat2db-Organization-Token=MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCL2U3hmDAxE/+n52DX+mwci2hZTN5TSAnhf3+HF14+tFkZbbIJjfgOxoWaTW3JoPC9c5nX0uJbfthbhitWrOIfkSHtT46AFMMpB1wQpoTOVsUS4n5QNHLm8DdjNXwXvJrTPzDIlu9DC6tXlIb2xIjuvoPf92+GazQT1WCDmrKHep/W4INqL8jmCNUnqQfAY4xYDLGI0efap0k0G2MZaUaxFQaT5oLA+ZktazExLDB66331FFJEE8x8zikeeswcglQtGlugx/TJTCSeqoxxwkoxyw7LIsaxecixpplyXkUf1Jpv4EkuYzMWamREQGNZ+iOi0jGFBIjXlfB8MGAo9F8fAgMBAAECggEAJbtBigZXqkYtCg4hUORd2u25/63/phSfpdmSfM5PPTfHelbgXDeTn9jsHw+Y+XeUvGi+Lz7Ul78HfNocQ0xtzfqIXtDCL8hqR12W918WId3DWi8FyXn9LlXNe9ToYDcgxrIb5WLjtwEk/4IxT88C6vc3+Wt3CZtO97LwUVGhrW+AKSObo6J81HOl01cXaYKirCCkjYYERauaW7Y6SjBvUr/SUyrcXF4gARBQ0jQ0/tUs/57L+4tz6oFHjMQ4bk79b9xUyRQPuEQpDMTGTYsz5PjVmVe/z7an69QxDTaZwVLMMR6+B75TXQ0ZJbh8R5xWerIzDG06tqjwRcc148cvMQKBgQC/UlGMogwLXyap+E7zTibBn2RD09QHlJrx+XydcARZr7otzMDGfdoqyqPy+xANAOd5owmhYeVLjmT3x6P5IJFp6LY75ByLRbuIAVV+NGD3lu6Rp7DyI9PVspX+woILXOxyl+wM1vQXtF+xR0knxaNpgtjNwTi2KQlgwO1FqNWo/QKBgQC7IFhXehKIo77lcdJSwDcdJePOtQqXOOACOV3aTSFDP4G/g5NtdIPCI2r9qTH0O/1NMPKxMnSzZvdlFTpqW8POKuJc3yTXkikTNHTGoIDzZSMpgs5iyv/OEgeHPLUQJxYsekv8FMWrXHm+GGveFEHoCL3cIDg/JxGon48H7ORhSwKBgQC7Wq+FWoMU977zH7igxt1pKt+TFHNEYSBC6aBAxJteAJn/k80ME957nSlkHrwfH82N7jzWDvnuPaleg+BtbJk576vVhpL1R/pXO4cvKbfzfZhuhpre5HrjgBkm++9BlWPu7Bs6j51FQVucTUS0b/SQtJP/GcKhkBog54zzdFyXOQKBgQClrubpVUmRuEIuz4/k+xIRednxzPR6nr4g2gBSaJZ5/4H3Ox3O/SooO8ngnO2BDZiivyMzZ7RSoGmOE7SsNWHyaqAQkPcC9APwYDLBJ53lY/g1Kf9pE8pZADewMz0x9xm3+fTLVu0KZA/bE652bMNKGmtYuyJyMDp/bf9rigFQbwKBgGY8F8CjyYb0hYdqiSocp6+4VqN+TO9unQJoMOKqGpuvjK+SQU93C9UA2t2Svh61MegRo/oVkQBV8oavvWMePovYi70KEDrpt3DnvYIogosamp2jXsCvx4VuFdzLdef+M+PFhVYPu7IfQsZacwlydbDUT8KbycaQLDJmUcP0a1+R; Chat2db-BS-TOKEN=NjY3MTM4MA==; _ga_HLJ1ZEFTZM=GS1.1.1737166443.23.0.1737166443.0.0.0; CHAT2DB=707e0900-5408-4367-b76f-6a7e48dbf912"

    const table = "https://app.chat2db-ai.com/api/ai/magic/prompt/mapping/tables";
let tablePayload = {
    message: "查询农业银行的股票代码",
    dataSourceId: environmentData.dataSourceId,
    dataSourceCollectionId: environmentData.dataSourceCollectionId,
};
const tableResponse = {
    success: true,
    errorCode: null,
    errorMessage: null,
    traceId: null,
    errorDetail: null,
    solutionLink: null,
    data: [
        {
            dataSourceId: environmentData.dataSourceId,
            databaseName: "stockmarket",
            schemaName: null,
            tableName: "stock_amarket_industry",
            tableSchema:
                "CREATE TABLE `stockmarket`.`stock_amarket_industry` (\n\t`updateDate` DATE   NOT NULL    COMMENT '记录上市公司行业变更日期' ,\n\t`codeno` MEDIUMINT   NOT NULL    COMMENT '股票代码 定义为整型用于数据库关联检索' ,\n\t`symbol` CHAR(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL    COMMENT '股票代码' ,\n\t`stockcode` CHAR(9) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL    COMMENT '证券代码 [股票代码.市场]' ,\n\t`stockmarketarea` CHAR(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL    COMMENT '股票所属市场 例如:上证指数，深证指数，科创板，创业板' ,\n\t`stockmarketareacode` CHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL    COMMENT '股票所属编码 例如:sh_index,sz_index' ,\n\t`stockmarketareano` SMALLINT   NOT NULL    COMMENT '股票所属市场编号检索字段 例如:1上海，2深圳，3科创板，4创业板' ,\n\t`stockname` CHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL    COMMENT '股票名称' ,\n\t`industry` VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL    COMMENT '所属行业' ,\n\t`industryClassification` VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL    COMMENT '行业分类' ,\n\tPRIMARY KEY  (`updateDate`,`codeno`)  \n) ENGINE=InnoDB COLLATE=utf8mb4_general_ci COMMENT='A股市场行业分类';\n",
            type: "TABLE",
        },
    ],
};
const sql_generate =
    "https://app.chat2db-ai.com/api/ai/slash_magic/sql_generate";
let sql_generate_paload = {
    questionType: "NL_2_SQL",
    source: "DATASOURCE_CHAT",
    dataSourceId: environmentData.dataSourceId,
    message: "查询平安银行的股票代码",
    tableList: [
        {
            dataSourceId: environmentData.dataSourceId,
            databaseName: "stockmarket",
            schemaName: null,
            tableName: "stock_amarket_industry",
            tableSchema:
                "CREATE TABLE `stockmarket`.`stock_amarket_industry` (\n\t`updateDate` DATE   NOT NULL    COMMENT '记录上市公司行业变更日期' ,\n\t`codeno` MEDIUMINT   NOT NULL    COMMENT '股票代码 定义为整型用于数据库关联检索' ,\n\t`symbol` CHAR(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL    COMMENT '股票代码' ,\n\t`stockcode` CHAR(9) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL    COMMENT '证券代码 [股票代码.市场]' ,\n\t`stockmarketarea` CHAR(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL    COMMENT '股票所属市场 例如:上证指数，深证指数，科创板，创业板' ,\n\t`stockmarketareacode` CHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL    COMMENT '股票所属编码 例如:sh_index,sz_index' ,\n\t`stockmarketareano` SMALLINT   NOT NULL    COMMENT '股票所属市场编号检索字段 例如:1上海，2深圳，3科创板，4创业板' ,\n\t`stockname` CHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL    COMMENT '股票名称' ,\n\t`industry` VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL    COMMENT '所属行业' ,\n\t`industryClassification` VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL    COMMENT '行业分类' ,\n\tPRIMARY KEY  (`updateDate`,`codeno`)  \n) ENGINE=InnoDB COLLATE=utf8mb4_general_ci COMMENT='A股市场行业分类';\n",
            type: "TABLE",
        },
    ],
    dataSourceCollectionId: environmentData.dataSourceCollectionId,
};
const sql_gernrate_response = {
    token: "u69O/49lylxmpbb+wHH/N9Y3vOkiMumT3FgTiOFK0ss=",
    chatId: 21370,
};
const chat = (chatId: any, questionId: any, token: any) => {
    let ret = `https://api.chat2db-ai.com/api/ai/chat?chatId=${chatId}&questionId=${questionId}&token=${urlencode(
        token
    )}`;
    console.log("[chat]URL:", ret);
    return ret;
};

let chatPayload = {
    token: "zznUh75w8QNPBaTgOQLS9wNKHdzImFXynfIJm9Xiv1g=",
    chatId: 21370,
    questionId: 66143,
};
const chatResponse = `
id:202409161129132740a14709d345e4
data:{"role":"assistant","content":""}
retry:3000

id:202409161129132740a14709d345e4
data:{"role":"assistant","content":""}
retry:3000

id:202409161129132740a14709d345e4
data:{"role":"assistant","content":"\nSELECT"}
retry:3000

id:202409161129132740a14709d345e4
data:{"role":"assistant","content":" \`"}
retry:3000

id:202409161129132740a14709d345e4
data:{"role":"assistant","content":"stock"}
retry:3000

id:202409161129132740a14709d345e4
data:{"role":"assistant","content":"code"}
retry:3000

id:202409161129132740a14709d345e4
data:{"role":"assistant","content":"\`"}
retry:3000

id:202409161129132740a14709d345e4
data:{"role":"assistant","content":" FROM"}
retry:3000

id:202409161129132740a14709d345e4
data:{"role":"assistant","content":" \`"}
retry:3000

id:202409161129132740a14709d345e4
data:{"role":"assistant","content":"stock"}
retry:3000

id:202409161129132740a14709d345e4
data:{"role":"assistant","content":"market"}
retry:3000

id:202409161129132740a14709d345e4
data:{"role":"assistant","content":"\`.\`"}
retry:3000

id:202409161129132740a14709d345e4
data:{"role":"assistant","content":"stock"}
retry:3000

id:202409161129132740a14709d345e4
data:{"role":"assistant","content":"_basic"}
retry:3000

id:202409161129132740a14709d345e4
data:{"role":"assistant","content":"_"}
retry:3000

id:202409161129132740a14709d345e4
data:{"role":"assistant","content":"ash"}
retry:3000

id:202409161129132740a14709d345e4
data:{"role":"assistant","content":"\`"}
retry:3000

id:202409161129132740a14709d345e4
data:{"role":"assistant","content":" WHERE"}
retry:3000

id:202409161129132740a14709d345e4
data:{"role":"assistant","content":" \`"}
retry:3000

id:202409161129132740a14709d345e4
data:{"role":"assistant","content":"stock"}
retry:3000

id:202409161129132740a14709d345e4
data:{"role":"assistant","content":"name"}
retry:3000

id:202409161129132740a14709d345e4
data:{"role":"assistant","content":"\`"}
retry:3000

id:202409161129132740a14709d345e4
data:{"role":"assistant","content":" ="}
retry:3000

id:202409161129132740a14709d345e4
data:{"role":"assistant","content":" '"}
retry:3000

id:202409161129132740a14709d345e4
data:{"role":"assistant","content":"农业"}
retry:3000

id:202409161129132740a14709d345e4
data:{"role":"assistant","content":"银行"}
retry:3000

id:202409161129132740a14709d345e4
data:{"role":"assistant","content":"';\n"}
retry:3000

id:202409161129132740a14709d345e4
data:{"role":"assistant","content":""}
retry:3000

id:[DONE]
data:[DONE]
retry:3000


`;

const execute = "https://app.chat2db-ai.com/api/rdb/dml/execute";
let executePayload = {
    sql: "SELECT `stockcode` \nFROM `stockmarket`.`stock_basic_ash` \nWHERE `stockname` = '平安银行';",
    pageNo: 1,
    pageSize: 200,
    total: 0,
    hasNextPage: true,
    dataSourceId: environmentData.dataSourceId,
    dataSourceName: environmentData.dataSourceName, //"47.100.65.64",
    databaseType: "MYSQL",
    databaseName: "stockmarket",
    schemaName: "",
    status: "DRAFT",
    connectable: true,
    type: "MYSQL",
};
const executeResponse = {
    success: true,
    errorCode: null,
    errorMessage: null,
    data: [
        {
            sql: null,
            originalSql:
                "SELECT `stockcode` FROM `stockmarket`.`stock_basic_ash` WHERE `stockname` = '农业银行'",
            description: "执行成功",
            message: null,
            success: true,
            updateCount: null,
            headerList: [
                {
                    dataType: "CHAT2DB_ROW_NUMBER",
                    name: "行号",
                    primaryKey: null,
                    comment: null,
                    defaultValue: null,
                    autoIncrement: null,
                    nullable: null,
                    columnSize: null,
                    decimalDigits: null,
                },
                {
                    dataType: "STRING",
                    name: "stockcode",
                    primaryKey: false,
                    comment: "证券代码 [股票代码.市场]",
                    defaultValue: null,
                    autoIncrement: null,
                    nullable: 0,
                    columnSize: 9,
                    decimalDigits: 0,
                },
            ],
            dataList: [["1", "601288.SH"]],
            sqlType: "SELECT",
            hasNextPage: false,
            pageNo: 1,
            pageSize: 200,
            fuzzyTotal: "1",
            duration: 75,
            canEdit: true,
            tableName: "`stockmarket`.`stock_basic_ash`",
            extra: null,
            dataAccess: false,
            scriptAccess: false,
            noPermissionDetail: null,
        },
    ],
    traceId: null,
    errorDetail: null,
    solutionLink: null,
};
const list = `https://app.chat2db-ai.com/api/ai/data/collection/list?dataSourceId=43460&pageNo=1&pageSize=1000`;
// https://api.chat2db-ai.com/api/ai/chat?token=u69O%2F49lylxmpbb%2BwHH%2FN9Y3vOkiMumT3FgTiOFK0ss%3D&chatId=21370&questionId=66113

const config = {
    headers: {
        Cookie: cookie,
        "Content-Type": "application/json",
        Connection: "keep-alive",
    },
};
const mapResponse: any = {};

export async function POST(request: NextRequest) {
    let message = "",
        isforce = false;
    let step = 0;
    let trailMessage = "";//请将查询内容去重，并且返回中文。";
    //step 0
    try {
        const queryData = await request.json();
        console.log("[queryData]", queryData);
        message = queryData.message || "";
        isforce = queryData.isforce || false;
        step = queryData.step || 0;
    } catch (error: any) {
        console.log("[error]", error);
        return new NextResponse(
            JSON.stringify({
                error: error.message,
                success: false,
            }),
            {
                status: 200,
            }
        );
    }
    if (!message) {
        return new NextResponse(
            JSON.stringify({
                error: "请输入自然语言",
                success: false,
            }),
            {
                status: 200,
            }
        );
    }
    message = message.trim()+trailMessage;
    //如果message不为空，在进行下面的操作
    const callbackid = md5(message);

    mapResponse[callbackid] = isforce ? {} : mapResponse[callbackid] || {};

    const setp0 = async () => {
        return new NextResponse(
            JSON.stringify({
                message: "step1 ok",
                success: true,
            }),
            {
                status: 200,
            }
        );
    };
    //---------1、table------------
    //获取数据表结构

    const setp1 = async () => {
        let table_response = mapResponse[callbackid]["tableResponse"] || {};
        if (Object.keys(table_response).length == 0) {
            //获取用户传入的值
            tablePayload.message = message || tablePayload.message;
            table_response = await axiosinstance.post(
                table,
                tablePayload,
                config // Include the config object as the third argument
            );
            console.log("[table_response]", table_response.data);
            console.log(
                "[table_response]table_response.data.success",
                table_response.data.success
            );

            // const table_response_data = await table_response.join()
            // 获取失败则直接返回
            if (table_response.data.success == false) {
                return new NextResponse(JSON.stringify(table_response.data), {
                    status: 200,
                });
            } else {
                mapResponse[callbackid]["tableResponse"] = table_response.data;
            }
        }
        return new NextResponse(
            JSON.stringify(mapResponse[callbackid]["tableResponse"]),
            {
                status: 200,
            }
        );
    };

    // console.log("[table_response.data]",table_response.data)

    // return new NextResponse(
    //     JSON.stringify(mapResponse[callbackid]["tableResponse"]),
    //     {
    //         status: 200,
    //     }
    // );

    //---------2、sql_generate------------

    const setp2 = async () => {
        let sql_response = mapResponse[callbackid]["sqlResponse"] || {};
        if (Object.keys(sql_response).length == 0) {
            //获取1中的tableList
            sql_generate_paload.tableList =
                mapResponse[callbackid]["tableResponse"].data;
            sql_generate_paload.message = message;
            sql_response = await axiosinstance.post(
                sql_generate,
                sql_generate_paload,
                config // Include the config object as the third argument
            );
            console.log("[sql_response]", sql_response.data);
            console.log(
                "[sql_response]sql_response.data.success",
                sql_response.data.success
            );
            //获取失败则直接返回
            if (sql_response.data.success == false) {
                return new NextResponse(JSON.stringify(sql_response.data), {
                    status: 200,
                });
            } else {
                mapResponse[callbackid]["sqlResponse"] = sql_response.data;
            }
        }
        return new NextResponse(
            JSON.stringify(mapResponse[callbackid]["sqlResponse"]),
            {
                status: 200,
            }
        );
    };

    // fs.writeFileSync(
    //     path.join(__dirname, "../../../../../log.json"),
    //     JSON.stringify(mapResponse, null, 4)
    // );
    // return new NextResponse(
    //     JSON.stringify(mapResponse[callbackid]["sqlResponse"]),
    //     {
    //         status: 200,
    //     }
    // );

    //---------3、chat------------

    const setp3 = async () => {
        let chat_response = mapResponse[callbackid]["chatResponse"] || {};
        if (Object.keys(chat_response).length == 0) {
            //获取1中的tableList

            chatPayload.chatId =
                mapResponse[callbackid]["sqlResponse"].data.chatId;
            chatPayload.questionId =
                mapResponse[callbackid]["sqlResponse"].data.questionId;
            chatPayload.token =
                mapResponse[callbackid]["sqlResponse"].data.token;

            chat_response = await axiosinstance.get(
                chat(
                    chatPayload.chatId,
                    chatPayload.questionId,
                    chatPayload.token
                ),
                // chatPayload,
                config // Include the config object as the third argument
            );
            console.log("[chat_response]", chat_response.data);
            console.log(
                "[chat_response]chat_response.data.success",
                chat_response.data.success
            );
            //获取失败则直接返回
            if (chat_response.data.success == false) {
                return new NextResponse(JSON.stringify(chat_response.data), {
                    status: 200,
                });
            } else {
                mapResponse[callbackid]["chatResponse"] = chat_response.data;
            }
        }
        return new NextResponse(
            JSON.stringify(mapResponse[callbackid]["chatResponse"]),
            {
                status: 200,
            }
        );
    };

    //--------------4、execute------------

    const setp4 = async () => {
        let chatResponse = mapResponse[callbackid]["chatResponse"];
        let sql = filterSql(chatResponse);
        let tableResponse = mapResponse[callbackid]["tableResponse"];

        let databaseList = getDatabaseList(tableResponse);
        let database = getDatabase(sql, databaseList);

        let execute_response = mapResponse[callbackid]["executeResponse"] || {};

        if (Object.keys(execute_response).length == 0) {
            //获取1中的tableList

            executePayload.sql = sql;
            executePayload.databaseName = database;

            execute_response = await axiosinstance.post(
                execute,
                executePayload,
                config // Include the config object as the third argument
            );
            console.log("[execute_response]", execute_response.data);
            console.log(
                "[execute_response]execute_response.data.success",
                execute_response.data.success
            );
            //获取失败则直接返回
            if (execute_response.data.success == false) {
                return new NextResponse(JSON.stringify(execute_response.data), {
                    status: 200,
                });
            } else {
                mapResponse[callbackid]["executeResponse"] =
                    execute_response.data;
            }
        }
        return new NextResponse(
            JSON.stringify(mapResponse[callbackid]["executeResponse"]),
            {
                status: 200,
            }
        );
    };

    const setp5 = async () => {
        const dashboardGenerate =
            "https://app.chat2db-ai.com/api/ai/slash_magic/dashboard_generate";
        const dashboardGeneratePayload = {
            chatId: 22428,
            message: "中国与美国 1999年至今的GDP 对比折线图",
            source: "CHAT",
            tableList: [
                {
                    dataSourceId: 46845,
                    databaseName: "stockmarket",
                    schemaName: null,
                    tableName: "df_global_gdp",
                    tableSchema:
                        "CREATE TABLE `stockmarket`.`df_global_gdp` (\n\t`countrycode` CHAR(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL    COMMENT '国家编码 格式 [国标]' ,\n\t`year` CHAR(4) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL    COMMENT '年分 日期格式 [YYYY]' ,\n\t`countryname_cn` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL    COMMENT '国家中文名称' ,\n\t`countryname_en` VARCHAR(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL    COMMENT '国家英文名称' ,\n\t`indicatorname` VARCHAR(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL    COMMENT '指标名称' ,\n\t`indicatorcode` VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL    COMMENT '指标代码' ,\n\t`unit_en` VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL    COMMENT '计量单位英文' ,\n\t`unit_cn` VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL    COMMENT '计量单位中文' ,\n\t`gdp` DECIMAL(21,2)   NULL    COMMENT 'GDP值' ,\n\t`gdp_growth_ratio` DECIMAL(21,6)   NULL    COMMENT 'GDP年增长率' ,\n\tPRIMARY KEY  (`countrycode`,`year`)  \n) ENGINE=InnoDB COLLATE=utf8mb4_general_ci COMMENT='全球GDP数据';\n",
                    type: "TABLE",
                },
                {
                    dataSourceId: 46845,
                    databaseName: "stockmarket",
                    schemaName: null,
                    tableName: "df_global_gdp_pcap",
                    tableSchema:
                        "CREATE TABLE `stockmarket`.`df_global_gdp_pcap` (\n\t`countrycode` CHAR(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL    COMMENT '国家编码 格式 [国标]' ,\n\t`year` CHAR(4) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL    COMMENT '年分 日期格式 [YYYY]' ,\n\t`countryname_cn` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL    COMMENT '国家中文名称' ,\n\t`countryname_en` VARCHAR(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL    COMMENT '国家英文名称' ,\n\t`indicatorname` VARCHAR(14) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL    COMMENT '指标名称' ,\n\t`indicatorcode` VARCHAR(14) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL    COMMENT '指标代码' ,\n\t`unit_en` VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL    COMMENT '计量单位英文' ,\n\t`unit_cn` VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL    COMMENT '计量单位中文' ,\n\t`per_capita_gdp` DECIMAL(21,2)   NULL    COMMENT '人均GDP' ,\n\t`per_capita_gdp_growth_ratio` DECIMAL(21,6)   NULL    COMMENT '人均GDP年增长率' ,\n\tPRIMARY KEY  (`countrycode`,`year`)  \n) ENGINE=InnoDB COLLATE=utf8mb4_general_ci COMMENT='全球人均GDP数据';\n",
                    type: "TABLE",
                },
                {
                    dataSourceId: 46845,
                    databaseName: "stockmarket",
                    schemaName: null,
                    tableName: "df_foreigndirectinvestment_netflow",
                    tableSchema:
                        "CREATE TABLE `stockmarket`.`df_foreigndirectinvestment_netflow` (\n\t`countrycode` CHAR(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL    COMMENT '国家编码 格式 [国标]' ,\n\t`year` CHAR(4) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL    COMMENT '年分 日期格式 [YYYY]' ,\n\t`countryname_cn` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL    COMMENT '国家中文名称' ,\n\t`countryname_en` VARCHAR(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL    COMMENT '国家英文名称' ,\n\t`indicatorname_cn` VARCHAR(9) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL    COMMENT '指标名称' ,\n\t`indicatorname_en` VARCHAR(44) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL    COMMENT '指标名称' ,\n\t`indicatorcode` VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL    COMMENT '指标代码' ,\n\t`unit_en` VARCHAR(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL    COMMENT '计量单位英文' ,\n\t`unit_cn` VARCHAR(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL    COMMENT '计量单位中文' ,\n\t`total_investment_amount` DECIMAL(21,2)   NULL    COMMENT '人均GDP' ,\n\t`total_inv_growth_ratio` DECIMAL(21,6)   NULL    COMMENT '人均GDP年增长率' ,\n\tPRIMARY KEY  (`countrycode`,`year`)  \n) ENGINE=InnoDB COLLATE=utf8mb4_general_ci COMMENT='外国直接投资净流入';\n",
                    type: "TABLE",
                },
                {
                    dataSourceId: 46845,
                    databaseName: "stockmarket",
                    schemaName: null,
                    tableName: "df_central_gov_debt_total",
                    tableSchema:
                        "CREATE TABLE `stockmarket`.`df_central_gov_debt_total` (\n\t`countrycode` CHAR(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL    COMMENT '国家编码 格式 [国标]' ,\n\t`year` CHAR(4) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL    COMMENT '年分 日期格式 [YYYY]' ,\n\t`countryname_cn` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL    COMMENT '国家中文名称' ,\n\t`countryname_en` VARCHAR(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL    COMMENT '国家英文名称' ,\n\t`indicatorname_cn` VARCHAR(9) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL    COMMENT '指标名称' ,\n\t`indicatorname_en` VARCHAR(44) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL    COMMENT '指标名称' ,\n\t`indicatorcode` VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL    COMMENT '指标代码' ,\n\t`unit_en` VARCHAR(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL    COMMENT '计量单位英文' ,\n\t`unit_cn` VARCHAR(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL    COMMENT '计量单位中文' ,\n\t`total_gov_debt` DECIMAL(21,2)   NULL    COMMENT '政府总体债务' ,\n\t`total_gov_debt_ratio` DECIMAL(21,6)   NULL    COMMENT '政府总体债务率' ,\n\tPRIMARY KEY  (`countrycode`,`year`)  \n) ENGINE=InnoDB COLLATE=utf8mb4_general_ci COMMENT='中央政府债务(总额)';\n",
                    type: "TABLE",
                },
                {
                    dataSourceId: 46845,
                    databaseName: "stockmarket",
                    schemaName: null,
                    tableName: "ts_index_daily",
                    tableSchema:
                        "CREATE TABLE `stockmarket`.`ts_index_daily` (\n\t`indexcode` VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL    COMMENT '指数代码 格式 [指数代码.发布机构缩写]' ,\n\t`tradedate` DATE   NOT NULL    COMMENT '交易日期 （日期格式：YYYY-MM-DD）' ,\n\t`indexprefix` VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL    COMMENT '指数代码前缀' ,\n\t`indexsuffix` CHAR(4) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL    COMMENT '指数代码后缀' ,\n\t`indexshortname` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL    COMMENT '指数简称' ,\n\t`market` CHAR(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL    COMMENT '指数市场 (MSCI:明晟指数;CSI:    中证指数;SSE:上交所指数;SZSE:深交所指数;CICC中金指数;SW:申万指数;OTH:其他指数)' ,\n\t`publisher` VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL    COMMENT '指数发布方' ,\n\t`category` VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL    COMMENT '指数类别' ,\n\t`base_point` DECIMAL(9,4)   NULL    COMMENT '基点' ,\n\t`close` DECIMAL(11,4)   NULL    COMMENT '今日收盘点位' ,\n\t`open` DECIMAL(11,4)   NULL    COMMENT '今日开盘点位' ,\n\t`high` DECIMAL(11,4)   NULL    COMMENT '今日最高点位;' ,\n\t`low` DECIMAL(11,4)   NULL    COMMENT '今日最低点位' ,\n\t`pre_close` DECIMAL(11,4)   NULL    COMMENT '今日昨日收盘点' ,\n\t`change_point` DECIMAL(11,4)   NULL    COMMENT '今日涨跌点' ,\n\t`pct_chg` DECIMAL(11,4)   NULL    COMMENT '当日涨跌幅' ,\n\t`vol` DECIMAL(16,2)   NULL    COMMENT '当日成交量（手）' ,\n\t`amount` DECIMAL(16,5)   NULL    COMMENT '当日成交额（千元）' ,\n\tPRIMARY KEY  (`indexcode`,`tradedate`)  \n) ENGINE=InnoDB COLLATE=utf8mb4_general_ci COMMENT='指数日线行情';\n",
                    type: "TABLE",
                },
                {
                    dataSourceId: 43460,
                    databaseName: "stockmarket",
                    schemaName: null,
                    tableName: "ts_daily_befadjust",
                    tableSchema:
                        "CREATE TABLE `stockmarket`.`ts_daily_befadjust` (\n\t`stockcode` CHAR(9) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL    COMMENT 'ts证券代码 [股票代码.市场]' ,\n\t`tradedate` DATE   NOT NULL    COMMENT '交易日期' ,\n\t`symbol` CHAR(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL    COMMENT '股票代码' ,\n\t`stockname_cn` CHAR(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL    COMMENT '股票名称（中文）' ,\n\t`stockmarketarea` CHAR(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL    COMMENT '股票所属市场 例如:上证指数，深证指数' ,\n\t`stockmarketareacode` CHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL    COMMENT '股票所属编码 例如:sh,sz' ,\n\t`stockmarketareano` SMALLINT   NOT NULL    COMMENT '股票所属市场板块编号检索字段 例如:1上海，2深圳，3科创板，4创业板' ,\n\t`stockmarket` CHAR(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL    COMMENT '股票所属市场板块名称 例如:1上海，2深圳，3科创板，4创业板' ,\n\t`open` DECIMAL(11,4)   NULL    COMMENT '当日开盘价' ,\n\t`high` DECIMAL(11,4)   NULL    COMMENT '当日最高价' ,\n\t`low` DECIMAL(11,4)   NULL    COMMENT '当日最低价' ,\n\t`close` DECIMAL(11,4)   NULL    COMMENT '当日收盘价' ,\n\t`pre_close` DECIMAL(11,4)   NULL    COMMENT '昨日收盘价' ,\n\t`change_price` DECIMAL(11,4)   NULL    COMMENT '当日涨跌额' ,\n\t`pct_chg` DECIMAL(11,4)   NULL    COMMENT '当日涨跌幅' ,\n\t`vol` DECIMAL(11,2)   NULL    COMMENT '当日成交量' ,\n\t`amount` DECIMAL(16,5)   NULL    COMMENT '当日成交额' ,\n\t`turnover_rate` DECIMAL(8,2)   NULL    COMMENT '当日换手率' ,\n\t`turnover_rate_f` DECIMAL(8,2)   NULL    COMMENT '当日自由流通股换手率' ,\n\t`volume_ratio` DECIMAL(8,2)   NULL    COMMENT '量比' ,\n\t`pe` DECIMAL(10,4)   NULL    COMMENT '市盈率（总市值/净利润， 亏损的PE为空）' ,\n\t`pe_ttm` DECIMAL(10,4)   NULL    COMMENT '滚动市盈率（TTM，亏损的PE为空）最近报告的12个月(四个季度)的净利润或者每股收益为基础来计算' ,\n\t`pb` DECIMAL(10,4)   NULL    COMMENT '市净率（总市值/净资产）' ,\n\t`ps` DECIMAL(12,4)   NULL    COMMENT '市销率' ,\n\t`ps_ttm` DECIMAL(12,4)   NULL    COMMENT '滚动市销率（TTM）最近报告的12个月(四个季度)基础来计算' ,\n\t`dv_ratio` DECIMAL(10,4)   NULL    COMMENT '股息率 （%）' ,\n\t`dv_ttm` DECIMAL(10,4)   NULL    COMMENT '滚动股息率（TTM）' ,\n\t`total_share` BIGINT   NULL    COMMENT '总股本 （股）' ,\n\t`float_share` BIGINT   NULL    COMMENT '流通股本 （股）' ,\n\t`free_share` BIGINT   NULL    COMMENT '自由流通股本 （元）' ,\n\t`total_mv` DECIMAL(21,2)   NULL    COMMENT '总市值 （元）' ,\n\t`circ_mv` DECIMAL(21,2)   NULL    COMMENT '流通市值（元）' ,\n\tPRIMARY KEY  (`stockcode`,`tradedate`)  \n) ENGINE=InnoDB COLLATE=utf8mb4_general_ci COMMENT='日线行情(前复权) 与每日基础指标合并';\n",
                    type: "TABLE",
                },
            ],
        };

        
        const dashboard_response = await axiosinstance.get(
            chat(
                chatPayload.chatId,
                chatPayload.questionId,
                chatPayload.token
            ),
            // chatPayload,
            config // Include the config object as the third argument
        );

        const answer =
            "https://app.chat2db-ai.com/api/ai/chat/list/answer?questionId=73105";
        const updataAnswer =
            "https://app.chat2db-ai.com/api/ai/chat/update/answer";
        const updataAnswerPayload = {
            id: 69228,
            chatId: 22428,
            questionId: 73105,
            content:
                '[{"schema":"{\\"chartType\\":\\"Line\\",\\"xField\\":\\"year\\",\\"yField\\":\\"gdp\\"}","ddl":"SELECT year, gdp FROM df_global_gdp WHERE countryname_cn IN (\'中国\', \'美国\') AND year >= \'1999\' ORDER BY year;","dataSourceId":46845,"databaseName":"stockmarket","connectable":true,"name":"中国与美国GDP对比"}]',
            dashboardId: null,
            dashboard: null,
            type: "DASHBOARD",
            goodFeedback: false,
            badFeedback: false,
            noFeedBack: true,
            regenerate: false,
        };
        const execute = "https://app.chat2db-ai.com/api/rdb/dml/execute";
        const executePayload = {
            schema: '{"chartType":"Line","xField":"year","yField":"gdp"}',
            ddl: "SELECT year, gdp FROM df_global_gdp WHERE countryname_cn IN ('中国', '美国') AND year >= '1999' ORDER BY year;",
            dataSourceId: 46845,
            databaseName: "stockmarket",
            connectable: true,
            name: "中国与美国GDP对比",
            sql: "SELECT year, gdp FROM df_global_gdp WHERE countryname_cn IN ('中国', '美国') AND year >= '1999' ORDER BY year;",
        };

        let dashboard_generate =
            mapResponse[callbackid]["dashboardGenerate"] || {};
        if (Object.keys(dashboard_generate).length == 0) {
            //获取1中的tableList
            sql_generate_paload.tableList =
                mapResponse[callbackid]["tableResponse"].data;
            sql_generate_paload.message = message;
            dashboard_generate = await axiosinstance.post(
                sql_generate,
                sql_generate_paload,
                config // Include the config object as the third argument
            );
            console.log("[sql_response]", dashboard_generate.data);
            console.log(
                "[sql_response]sql_response.data.success",
                dashboard_generate.data.success
            );
            //获取失败则直接返回
            if (dashboard_generate.data.success == false) {
                return new NextResponse(
                    JSON.stringify(dashboard_generate.data),
                    {
                        status: 200,
                    }
                );
            } else {
                mapResponse[callbackid]["sqlResponse"] =
                    dashboard_generate.data;
            }
        }
        return new NextResponse(
            JSON.stringify(mapResponse[callbackid]["sqlResponse"]),
            {
                status: 200,
            }
        );
    };

    const setp6 = async () => {
        const qwenResponse =  await qwen( message);
        mapResponse[callbackid]["qwenResponse"] = qwenResponse;
        return new NextResponse(
            JSON.stringify(mapResponse[callbackid]["qwenResponse"]),
            {
                status: 200,
            }
        );

    };
    fs.writeFileSync(   
        path.join(__dirname, "../../../../../log.json"),
        JSON.stringify(mapResponse, null, 4)
    );
    // return new NextResponse(
    //     JSON.stringify(mapResponse[callbackid]["executeResponse"]),
    //     {
    //         status: 200,
    //     }
    // );

    switch (step) {
        case 0:
            return await setp0();
            break;
        case 1:
            return await setp1();
            break;
        case 2:
            return await setp2();
            break;

        case 3:
            return await setp3();
            break;

        case 4:
            return await setp4();
            break;
        case 5:
            return await setp5();
            break;
        case 6:
            return await setp6();
            break;
        default:
            break;
    }

    // getDatabase, filterSql,getDatabaseList

    // console.log("[sql_generate]", response.data);
    // const chatResponse = await chatFn(response.data);
    // return new NextResponse(JSON.stringify({}), {
    //     status: 200,
    // });
}

const tablesFn = async (data: any) => {};
const chatFn = async (data: any) => {
    const token = data.data.token;
    const chatId = data.data.chatId;
    const questionId = data.questionId;
    const response = await axiosinstance.get(
        chat + urlencode(token)
        // sql_generate_paload,
        // config // Include the config object as the third argument
    );
    console.log("[chat]", response.data);
    // const executeResponse = await executeFn(response.data);
};

const executeFn = async (data: any) => {
    const response = await axiosinstance.post(
        execute,
        executePayload,
        config // Include the config object as the third argument
    );
    console.log("[execute]", response.data);
    const listResponse = await listFn(response.data);
};
const listFn = async (data: any) => {
    const response = await axiosinstance.get(
        list,

        config // Include the config object as the third argument
    );
    console.log("[list]", response.data);
};
