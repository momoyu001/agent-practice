import OpenAI from "openai";

const client = new OpenAI({
	apiKey: "sk-895d545384fb4934b950713417bd9ea3",
	baseURL: "https://api.deepseek.com",
});

const askAgent = async (messages: string[], system: string, temperature: number = 0.3) => {
    const systemMessage = {
        // system 系统提示词 --- 最高优先级的指令，定义 AI 的角色、边界、行为规范
        role: 'system' as const,
        content: system
    }

    const userMessages = messages.map(message => ({
        // user 用户输入，定义用户的问题或任务
        role: 'user' as const,
        content: message
    }))

    const response = await client.chat.completions.create({
        model: "deepseek-chat",
        temperature: temperature,
        messages: [
            systemMessage,
            ...userMessages
        ],
    });
    return response.choices[0].message.content;
}

const result0 = await askAgent([
    '用一句话形容人工智能',
], '你是一个严谨的技术助手', 0.3);

console.log('test0:', result0);

console.log('--------------------------------');


const result1 = await askAgent([
    '用一句话形容人工智能',
], '你是一个严谨的技术助手', 0.3);

console.log('test1:', result1);

console.log('--------------------------------');

const result2 = await askAgent([
    '用一句话形容人工智能',
], '你是一个严谨的技术助手', 1.3);

console.log('test2:', result2);

