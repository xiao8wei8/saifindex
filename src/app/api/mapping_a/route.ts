
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import urlencode from "urlencode";
export const dynamic = "force-dynamic";
import mysql from "mysql2/promise";
// import mockData from './mock'

let input = ""//"请查询平安银行的股票代码。做为数据库专家，请优化查询到的SQL语句";
const token = "sk-LEWwEyfUgRH8E4ASUeQ7hsz5MQG1KMu48_c8Ngya8Oo";
const urlmapping_a = "https://app.chat2db-ai.com/api/ai/rest/mapping_a";
const urlprompt_a = "https://api.chat2db-ai.com/api/ai/rest/prompt_a";
const urlchat_a = "https://api.chat2db-ai.com/api/ai/rest/chat_a";
const config = {
    headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    },
};

const axiosinstance = axios.create({
    timeout: 600000,
});
let after=""//";请优化前面查询到的sql"
export async function POST(request: NextRequest) {
    const { input } = await request.json()
    // const { messages = [] }: Partial<{ messages: Array<any> }> = await request.json();
    // input = messages//[messages.length-1]?.content||"";
    console.log("[input]", input);
    // const data = await response.json();
    // return NextResponse.json({
    //     output:{
    //         text: "hello world",
    //     }
    // });

    // return new NextResponse(JSON.stringify({outpu:{
    //     text:"this is server::"+messages[0].content
    // }}), {
    //     status: 200,
    // });
    let data = {
        // input: {
        //     messages: [
        //       {
        //         role: 'system',
        //         content: 'You are a helpful assistant.',
        //       },
        //       ...messages,
        //     ],
        //   },
        input: input+after,
        tableSize: "100",
        dataSourceCollectionId: 2839,
    };
    const mockData1={
        data:123}
    // return new NextResponse(JSON.stringify(mockData), {
    //     status: 200,
    // });

    //1、获取mapping
    try {
        const response = await axiosinstance.post(
            urlmapping_a,
            data,
            config // Include the config object as the third argument
        );

        if (!response.data.data) {
            console.log("[urlmapping_a error]", response.data);
            return new NextResponse(JSON.stringify(response));
        } else {
            const dataprompt_a = await getPrompt_a(response.data.data);
            console.log("[dataprompt_a]",dataprompt_a)
            return new NextResponse(JSON.stringify(dataprompt_a), {
                status: 200,
            });
        }
    } catch (error: any) {
        return new NextResponse(
            JSON.stringify({
                error: error.message,
            }),
            { status: 200 }
        );
    }
}

const getPrompt_a = async (tableSchemas: []) => {
    let table: any = [];
    let item: any = "";
    const end = () => {
        return table;
    };
    //2、循环tableSchemas，获取token

    if (tableSchemas.length) {
        item = tableSchemas.shift();
    } else {
        return end();
    }
    const itemFn = async (cb: any) => {
        let schema: any = await loopTableSchemas(item, () => {});
        const databaseName = item.databaseName;
        // console.log("[schema]", schema);
        let token: any = {};
        let sql: any = "";

        if (schema.success) {
            token = await loopTokens(schema.data.token, (token: any) => {});
            console.log("[token]", token.success, token);

            if (token.success === false) {
                console.error("[token error]", token);
            } else {
                console.log("[token]", token);
                sql = token
                    .split("\n")[1]
                    .trim()
                    .replaceAll(/\n/g, "")
                    .replaceAll(/\n\n/g, "")
                    .replaceAll(/data/g, '"data"')
                    .replaceAll(/data:/g, "")
                    .replaceAll(/"data":/g, "");

                console.log("[sql]origin", sql);
                let flag = true;
                try {
                    sql = JSON.parse(sql);
                } catch (error) {
                    console.log("[JSON.parse]error:", error)
                    flag = false
                }
                if (flag) {
                    //         // res.status(200).json(response.data);
                    console.log("[sql]", sql);
                    if (sql.content) {
                        const sqlStr = sql.content;
                        console.log("[sqlStr]", sqlStr);
                        table = await loopTable(sqlStr, databaseName);
                        console.log("[table]", table);
                    } else {
                        console.error("[sql.content] is empty");
}
                }

            }
        } else {
            console.error("[schema error]", schema);
        }
        return cb();
         
    };
    const run = () => {
        return itemFn(() => {
            if (tableSchemas.length) {
                if (table.length) {
                    return end();
                } else {
                    item = tableSchemas.shift();
                    return run();
                }
            } else {
                return end();
            }
        });
    };
    return run();
};

const loopTableSchemas = async (item: any, fn: any) => {
    let data = {
        questionType: "NL_2_SQL",
        input: input+after,
        databaseType: "MYSQL",
        tableSchemas: [item], // [(tableSchemas as any)[0],(tableSchemas as any)[tableSchemas.length-1]],
        language: "en",
    };
    // console.log(data);
    const ret = await axiosinstance.post(
        urlprompt_a,
        data,
        config // Include the config object as the third argument
    );
    return ret.data;
};
const loopTokens = async (token: any, fn: any) => {
    const encodedString = urlencode(token);
    const url = urlchat_a + `?token=${encodedString}&stream=false&timeout=300`;
    // console.log("url", url);
    const ret = await axiosinstance.get(url, config);
    return ret.data;
};
let poolMap:any = {

}

const loopTable = async (query: string, database: string) => {
    try {
        // const pool = mysql.createPool({
        //     host: "47.100.65.64",
        //     user: "si_readonly",
        //     password: "SXS]p4Gr^g#pq*x4",
        //     database: database,
        //     port: 3306,
        // });
      
        // let poolCache = poolMap[database]
        // if(poolCache){
        //     poolMap[database] = poolCache = mysql.createPool({
        //         host: "47.100.65.64",
        //         user: "si_readonly",
        //         password: "SXS]p4Gr^g#pq*x4",
        //         database: database,
        //         port: 3306,
        //     });
        // }
        let poolCache  = mysql.createPool({
            host: "47.100.65.64",
            user: "si_readonly",
            password: "SXS]p4Gr^g#pq*x4",
            database: database,
            port: 3306,
        });
        const connection = await poolCache.getConnection();
        // console.log("[connection]",connection,query)
        // ... some query
        const [rows, fields] = await connection.query(query);
        connection.release();
        return rows;
    } catch (err) {
        console.log(err);
        return err;
    }
};
