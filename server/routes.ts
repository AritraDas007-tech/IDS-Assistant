import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import Groq from "groq-sdk";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Initialize Groq
  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  let groq: Groq | null = null;

  if (GROQ_API_KEY) {
    groq = new Groq({ apiKey: GROQ_API_KEY });
  } else {
    console.warn("GROQ_API_KEY is not set. Chatbot will respond with a placeholder.");
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

  // CHAT API
  app.post(api.chat.send.path, async (req, res) => {
    try {
      const input = api.chat.send.input.parse(req.body);

      // Store user message
      await storage.createMessage({ content: input.message, isBot: false });

      let replyText = "";

      if (groq) {
        try {
          const completion = await groq.chat.completions.create({
          model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
          messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: input.message },
        ],
        max_tokens: 500,
        temperature: 0.7,
      });


          replyText =
            completion.choices[0]?.message?.content ||
            "No response generated.";
        } catch (error: any) {
          console.error("Groq API Error:", error);
          replyText =
            "Error communicating with Groq AI service. Please check server logs.";
        }
      } else {
        replyText =
          "SentinelBot is offline. Please set the GROQ_API_KEY environment variable to enable AI features.";
      }

      // Store bot reply
      await storage.createMessage({ content: replyText, isBot: true });

      res.json({ reply: replyText });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid input" });
      } else {
        console.error("Internal Server Error:", err);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // HISTORY API
  app.get(api.chat.history.path, async (req, res) => {
    const history = await storage.getMessages();
    res.json(history);
  });

  return httpServer;
}
