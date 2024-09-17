let str = `id:202409162123366b1e60490ae743fc
data:{"role":"assistant","content":""}
retry:3000

id:202409162123366b1e60490ae743fc
data:{"role":"assistant","content":""}
retry:3000

id:202409162123366b1e60490ae743fc
data:{"role":"assistant","content":"\nSELECT"}
retry:3000

id:202409162123366b1e60490ae743fc
data:{"role":"assistant","content":" \`"}
retry:3000

id:202409162123366b1e60490ae743fc
data:{"role":"assistant","content":"stock"}
retry:3000

id:202409162123366b1e60490ae743fc
data:{"role":"assistant","content":"code"}
retry:3000

id:202409162123366b1e60490ae743fc
data:{"role":"assistant","content":"\`"}
retry:3000

id:202409162123366b1e60490ae743fc
data:{"role":"assistant","content":" FROM"}
retry:3000

id:202409162123366b1e60490ae743fc
data:{"role":"assistant","content":" \`"}
retry:3000

id:202409162123366b1e60490ae743fc
data:{"role":"assistant","content":"stock"}
retry:3000

id:202409162123366b1e60490ae743fc
data:{"role":"assistant","content":"market"}
retry:3000

id:202409162123366b1e60490ae743fc
data:{"role":"assistant","content":"\`.\`"}
retry:3000

id:202409162123366b1e60490ae743fc
data:{"role":"assistant","content":"stock"}
retry:3000

id:202409162123366b1e60490ae743fc
data:{"role":"assistant","content":"_basic"}
retry:3000

id:202409162123366b1e60490ae743fc
data:{"role":"assistant","content":"_"}
retry:3000

id:202409162123366b1e60490ae743fc
data:{"role":"assistant","content":"ash"}
retry:3000

id:202409162123366b1e60490ae743fc
data:{"role":"assistant","content":"\`"}
retry:3000

id:202409162123366b1e60490ae743fc
data:{"role":"assistant","content":" WHERE"}
retry:3000

id:202409162123366b1e60490ae743fc
data:{"role":"assistant","content":" \`"}
retry:3000

id:202409162123366b1e60490ae743fc
data:{"role":"assistant","content":"stock"}
retry:3000

id:202409162123366b1e60490ae743fc
data:{"role":"assistant","content":"name"}
retry:3000

id:202409162123366b1e60490ae743fc
data:{"role":"assistant","content":"\`"}
retry:3000

id:202409162123366b1e60490ae743fc
data:{"role":"assistant","content":" ="}
retry:3000

id:202409162123366b1e60490ae743fc
data:{"role":"assistant","content":" '"}
retry:3000

id:202409162123366b1e60490ae743fc
data:{"role":"assistant","content":"农业"}
retry:3000

id:202409162123366b1e60490ae743fc
data:{"role":"assistant","content":"银行"}
retry:3000

id:202409162123366b1e60490ae743fc
data:{"role":"assistant","content":"';\n"}
retry:3000

id:202409162123366b1e60490ae743fc
data:{"role":"assistant","content":""}
retry:3000

id:[DONE]
data:[DONE]
retry:3000

`;
const filterSql = (str: string) => {
    let ret = str.split("\n").map((item) => {
        if (item) {
            return item
                .replace(/^id\:.*$/g, "")
                .replace(/^retry\:.*$/g, "")
                .replace(/data\:/g, "")
                .replace(/\[DONE\]/g, "");
        }
    });

    ret = ret.filter((item) => {
        return item;
    });

    let newRet: any = ret.join("").split("}{");
    newRet = newRet.map((item: any, index: any) => {
        if (index == 0) {
            return JSON.parse(item + "}").content;
        } else if (index == newRet.length - 1) {
            return JSON.parse("{" + item).content;
        } else {
            return JSON.parse("{" + item + "}").content;
        }
    });

    newRet = newRet.join("");
    console.log("[sql]",newRet);
    return newRet;
};
// export {
//     filterSql
// }
const tableResponse = {
    success: true,
    errorCode: null,
    errorMessage: null,
    traceId: null,
    errorDetail: null,
    solutionLink: null,
    data: [
        {
            dataSourceId: 43460,
            databaseName: "stockmarket",
            schemaName: null,
            tableName: "stock_amarket_industry",
            tableSchema:
                "CREATE TABLE `stockmarket`.`stock_amarket_industry` (\n\t`updateDate` DATE   NOT NULL    COMMENT '记录上市公司行业变更日期' ,\n\t`codeno` MEDIUMINT   NOT NULL    COMMENT '股票代码 定义为整型用于数据库关联检索' ,\n\t`symbol` CHAR(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL    COMMENT '股票代码' ,\n\t`stockcode` CHAR(9) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL    COMMENT '证券代码 [股票代码.市场]' ,\n\t`stockmarketarea` CHAR(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL    COMMENT '股票所属市场 例如:上证指数，深证指数，科创板，创业板' ,\n\t`stockmarketareacode` CHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL    COMMENT '股票所属编码 例如:sh_index,sz_index' ,\n\t`stockmarketareano` SMALLINT   NOT NULL    COMMENT '股票所属市场编号检索字段 例如:1上海，2深圳，3科创板，4创业板' ,\n\t`stockname` CHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL    COMMENT '股票名称' ,\n\t`industry` VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL    COMMENT '所属行业' ,\n\t`industryClassification` VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL    COMMENT '行业分类' ,\n\tPRIMARY KEY  (`updateDate`,`codeno`)  \n) ENGINE=InnoDB COLLATE=utf8mb4_general_ci COMMENT='A股市场行业分类';\n",
            type: "TABLE",
        },
    ],
};
const getDatabaseList = (tableResponse: any) => {
    let databaseObj: any = {};
    tableResponse.data.forEach((item: any) => {
        console.log(item.databaseName);
        databaseObj[item.databaseName] = 1;
    });

    const databaseList = Object.keys(databaseObj);
    console.log("[databaseList]",databaseList);
    return databaseList;
};

const getDatabase = (databaseList:any, sql:any) => {
    // const databaseList = getDatabaseList(tableResponse);
    // console.log(databaseList);
    // const sql = filterSql(str);
    // console.log(sql);
    let ret = "";
    for (let index = 0; index < databaseList.length; index++) {
        const item = databaseList[index];
        // console.log(item);
        // console.log(sql.includes(item));
        if (sql.includes(item)) {
            // console.log(item);
            ret = item;
            break;
        }
    }
    console.log("[database]",ret);
    return ret;
};
// getDatabase();
export {
    getDatabase,
    getDatabaseList,
    filterSql
}