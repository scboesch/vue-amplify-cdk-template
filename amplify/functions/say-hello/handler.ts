// Removing type checking for hanlders.ts to bypass the vue build issue. 
// @ts-nocheck
import type { Schema } from "../../data/resource"
import { env } from '$amplify/env/say-hello';
import { GoogleGenerativeAI } from "@google/generative-ai";

export const handler: Schema["sayHello"]["functionHandler"] = async (event) => {
  // arguments typed from `.arguments()`
  const { name } = event.arguments;
  let message = env.MESSAGE;
  let API_KEY = env.API_KEY;
  // return typed from `.returns()`
  
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = name;
  let prompt_reply = "No result";
  try {
    const result = await model.generateContent(prompt);
    prompt_reply = result.response.text(); // Handle the response data
  } catch (error) {
    prompt_reply = "Error calling google API" + error;
    //console.error('Error calling google API', error);
  }
  
  let jsonResponse = {
    "prompt_reply": prompt_reply,
    "name": name,
    "message": message,
  }
  const response = {
      statusCode: 200,
      body: jsonResponse,
  };
  return response;
}