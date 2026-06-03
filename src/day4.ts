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

const system1 = "你是一个资深数据库工程师。给出清晰的解释后再输出最终SQL。"
const few_shot1 = `范例1：
输入：找出所有工资大于8000的员工姓名
输出：SELECT name FROM employees WHERE salary > 8000
范例2：
输入：统计每个部门的平均薪资
输出：SELECT department, AVG(salary) FROM employees GROUP BY department
`
const prompt1 = `${few_shot1}\n现在处理：列出购买次数超过3次的客户邮箱`

const result1 =  await askAgent([prompt1], system1)

console.log('test - result', result1);
