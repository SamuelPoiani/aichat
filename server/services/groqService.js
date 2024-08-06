import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });


export async function getGroqChatCompletion(messages) {
  const completion = await groq.chat.completions.create({
    model: "llama3-8b-8192",
    "messages": [
        {
          "role": "user",
          "content": `${messages}`
        }
      ],
      "temperature": 1,
      "max_tokens": 1024,
      "top_p": 1,
      "stream": false,
      "stop": null
  });
  return completion.choices[0].message.content
}

export default groq;