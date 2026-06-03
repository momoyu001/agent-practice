// import { askAgent } from "./common.ts";

// const getWeather = {
//     name: 'get-weather',
//     description: '获取指定城市的天气',
//     parameters: {
//         type: 'object',
//         "properties": {
//             "city": {"type": "string", "description": "城市名称，如 Beijing"}
//         },
//         "required": ["city"]
//     }
// }

// const functions = [getWeather];

// const userMsg = '今天上海的天气怎么样'

// const messages = [userMsg]

// const result = await askAgent({
//     messages,
//     functions
// })

// console.log('test - result: ', result)

// if (result.function_call) {

// }

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: "sk-895d545384fb4934b950713417bd9ea3",
  baseURL: "https://api.deepseek.com",
});

interface WeatherResult {
  temperature: string;
  condition: string;
}

interface ToolCall {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
}

const tools = [
  {
    type: "function" as const,
    function: {
      name: "get_weather",
      description: "获取指定城市的天气",
      parameters: {
        type: "object" as const,
        properties: {
          city: {
            type: "string" as const,
            description: "城市名称，如 Beijing",
          },
        },
        required: ["city"],
      },
    },
  },
];

const msgs: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
  { role: "user", content: "上海今天天气怎么样？" },
];

// 第一次调用，让模型决定是否调工具
const resp = await client.chat.completions.create({
  model: "deepseek-chat",
  messages: msgs,
  tools,
  tool_choice: "auto",
});

const msg = resp.choices[0].message;

if (msg.tool_calls && msg.tool_calls.length > 0) {
  const toolCall = msg.tool_calls[0] as ToolCall;
  const funcName = toolCall.function.name;
  const args = JSON.parse(toolCall.function.arguments) as { city: string };
  console.log(`要调用的函数: ${funcName}, 参数:`, args);

  // 模拟天气查询结果
  const result: WeatherResult = { temperature: "22°C", condition: "暴雨" };

  msgs.push(msg);
  msgs.push({
    role: "tool",
    tool_call_id: toolCall.id,
    content: JSON.stringify(result),
  });

  // 再次调用，让模型根据函数结果生成回答
  const final = await client.chat.completions.create({
    model: "deepseek-chat",
    messages: msgs,
  });
  console.log(final.choices[0].message.content);
}
