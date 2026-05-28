import OpenAI from "openai";

const client = new OpenAI({
	apiKey: "sk-895d545384fb4934b950713417bd9ea3",
	baseURL: "https://api.deepseek.com",
});

const askAgent = async (
	messages: string[],
	system: string,
	temperature: number = 0.3
) => {
	const systemMessage = {
		// system 系统提示词 --- 最高优先级的指令，定义 AI 的角色、边界、行为规范
		role: "system" as const,
		content: system,
	};

	const userMessages = messages.map((message) => ({
		// user 用户输入，定义用户的问题或任务
		role: "user" as const,
		content: message,
	}));

	const allMessages = [systemMessage, ...userMessages];

	console.log("allMessages:", allMessages);
	console.log("--------------------------------");

	const response = await client.chat.completions.create({
		model: "deepseek-chat",
		temperature: temperature,
		messages: allMessages,
	});
	return response.choices[0].message.content;
};

const systemPrompt = `你是一名技术问题分类专家，你的输出格式必须为 JSON。
    请遵循以下思维链：
    1. 识别问题所属技术领域（前端、后端、DevOps、AI/ML）
    2. 判断问题的紧急程度（low/medium/high）
    3. 给出分类理由

    示例：
        Q: "生产环境登录接口突然返回 502，影响了所有用户"
        A: {"field": "后端", "urgency": "high", "reason": "502 通常表示网关错误，属于服务不可用，影响面大"}

    现在开始对用户输入进行分类，请对以下每个问题进行分类，用换行符分隔。
`;

const result = await askAgent(
	[
		"接口响应非常慢，影响了所有用户",
		"React 页面在 Safari 上白屏，Firefox 正常",
	],
	systemPrompt,
	0.1
);

console.log("test:", result);
