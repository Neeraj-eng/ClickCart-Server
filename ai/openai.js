import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function generateResponse(prompt) {
  const response = await client.responses.create({
    model: "gpt-4.1",
    input: prompt
  });

  return response.output[0].content[0].text;
}

export async function takeinfo(req, res) {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        message: "Prompt is not defined",
      });
    }

    const reply = await generateResponse(prompt);

    return res.status(200).json({
      success: true,
      data: reply,
    });

  } catch (error) {
    console.error("Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}