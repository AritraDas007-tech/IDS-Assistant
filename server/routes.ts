
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes"; // Import from shared/routes!
import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Initialize Gemini
  // We'll check for the key lazily or just log a warning if missing
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  let genAI: GoogleGenerativeAI | null = null;
  let model: any = null;

  if (GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-pro" });
  } else {
    console.warn("GEMINI_API_KEY is not set. Chatbot will respond with a placeholder.");
  }

  const SYSTEM_PROMPT = `
You are SentinelBot, an advanced AI assistant for an Intrusion Detection System (IDS).
Your role is to assist security analysts and administrators.

Responsibilities:
1. Explain security alerts, logs, and reports in the dashboard.
2. Define and explain cyber threats (e.g., Brute Force, SQL Injection, DDoS, Port Scanning).
3. Provide actionable troubleshooting steps for security incidents.
4. Assist with configuring the IDS rules (hypothetically).

Security & Ethics:
- YOU MUST NOT provide instructions on how to perform cyberattacks, exploit vulnerabilities, or bypass security controls.
- If asked to do something illegal or unethical, firmly refuse and state that you are a defensive security assistant.
- Provide only defensive and remediation guidance.

Tone: Professional, precise, and authoritative yet helpful.
`;

  app.post(api.chat.send.path, async (req, res) => {
    try {
      const input = api.chat.send.input.parse(req.body);
      
      // Store user message
      await storage.createMessage({ content: input.message, isBot: false });

      let replyText = "";

      if (model) {
        try {
          const chat = model.startChat({
            history: [
              {
                role: "user",
                parts: [{ text: SYSTEM_PROMPT }],
              },
              {
                role: "model",
                parts: [{ text: "Understood. I am SentinelBot, ready to assist with IDS tasks." }],
              },
            ],
            generationConfig: {
              maxOutputTokens: 500,
            },
          });

          const result = await chat.sendMessage(input.message);
          const response = await result.response;
          replyText = response.text();
        } catch (error: any) {
          console.error("Gemini API Error:", error);
          replyText = "Error communicating with AI service. Please check server logs.";
        }
      } else {
        replyText = "SentinelBot is offline. Please set the GEMINI_API_KEY environment variable to enable AI features.";
      }

      // Store bot reply
      await storage.createMessage({ content: replyText, isBot: true });

      res.json({ reply: replyText });

    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid input" });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.get(api.chat.history.path, async (req, res) => {
    const history = await storage.getMessages();
    res.json(history);
  });

  return httpServer;
}
