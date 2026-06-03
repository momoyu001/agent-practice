import OpenAI from "openai";

const client = new OpenAI({
  apiKey: "sk-895d545384fb4934b950713417bd9ea3",
  baseURL: "https://api.deepseek.com",
});

interface AgentOptions {
  messages: string[];
  system?: string;
  temperature?: number;
  functions?: any[];
}

interface MessageType {
  role: string;
  content: string;
}

export const askAgent = async (agentOptions: AgentOptions) => {
  const {
    messages = [],
    system,
    temperature = 0.3,
    functions = [],
  } = agentOptions;

  const allMessage: MessageType[] = [];

  if (system) {
    Object.assign(allMessage, {
      // system 系统提示词 --- 最高优先级的指令，定义 AI 的角色、边界、行为规范
      role: "system" as const,
      content: system,
    });
  }

  const userMessages: MessageType[] = messages.map((message) => ({
    // user 用户输入，定义用户的问题或任务
    role: "user" as const,
    content: message,
  }));

  allMessage.push(...userMessages);

  const chatOptions = {
    model: "deepseek-chat",
    temperature: temperature,
    messages: [...allMessage] as any,
  };

  if (functions.length) {
    Object.assign(chatOptions, { functions, function_call: "auto" });
  }

  console.log('test - chatOptions ', chatOptions);

  const response = await client.chat.completions.create(chatOptions);
  return response.choices[0].message;
};
