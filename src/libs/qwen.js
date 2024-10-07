import OpenAI from "openai";
const DASHSCOPE_API_KEY = `sk-2230430882b44c8cb02e602d474f95b7`
const openai = new OpenAI(
    {
        apiKey: DASHSCOPE_API_KEY,
        baseURL:"https://dashscope.aliyuncs.com/compatible-mode/v1"
    }
);

async function main(msg) {
  const completion = await openai.chat.completions.create({
    messages: [
      {role: "system", content: "You are a helpful assistant." },
      {role: "user", content: msg||"" }
    ],
    model: "qwen-turbo-latest",
  });
  const ret = completion.choices[0]['message']['content'];
  console.log(ret);
  return ret;
}

// main();
export default main