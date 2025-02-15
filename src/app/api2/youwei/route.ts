import { tree } from "next/dist/build/templates/app-page";
import { NextRequest, NextResponse } from "next/server";

// export const revalidate = 60;

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const type: any = searchParams.get("type"); // 'xxx'
    const params: any =JSON.parse(searchParams.get("params")||'{}')
    
    // const data = await fetch(url);
    // const posts = await data.json();

    // return Response.json(posts);
   // $.get("https://upsort.com/all", function(resp){
        //     that.makeHtml(resp.data);
        //     that.heartBeat();
        // })

    let paramsStr = ""
    for(var key in params){
        paramsStr+=key+"="+params[key]+"&"
    }
    let url = "https://upsort.com/"+type+"?"+paramsStr
    const response = await fetch(url, {
        // body: params,
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            //   Authorization: `Bearer ${request.cookies.get('token')?.value}`,
        },
    });
    console.log("[][type]",type,url);
    // 除了 200-299 之间的状态码都会视为失败
    if (response.ok) {
        const data = await response.json();
        
        return NextResponse.json({ data, success: true}, { status: 200 });
    }
    return NextResponse.json({  success: false}, { status: 200 });
}
