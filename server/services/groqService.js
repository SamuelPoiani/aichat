import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function* getGroqChatCompletion(messages) {
  const chatCompletion = await groq.chat.completions.create({
    messages: messages,
    model: "llama-3.1-70b-versatile",
    temperature: 1,
    max_tokens: 1024,
    top_p: 1,
    stream: true,
    stop: null
  });

  for await (const chunk of chatCompletion) {
    yield chunk;
  }
}

export default groq;