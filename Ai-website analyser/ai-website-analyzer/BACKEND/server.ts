import express from "express";

import cors from "cors";

import puppeteer from "puppeteer";

import OpenAI from "openai";

import dotenv from "dotenv";

import type { Request, Response } from "express";

dotenv.config();

const app = express();

// ✅ Middleware

app.use(
  cors({
    origin: "*", // allow all (you can restrict later)
  }),
);

app.use(express.json());

// ✅ OpenAI Setup

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ API Route

app.post("/analyze", async (req: Request, res: Response) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    // 🌐 Launch Puppeteer (Render compatible)

    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],

      headless: true,
    });

    const page = await browser.newPage();

    await page.goto(url, {
      waitUntil: "domcontentloaded",

      timeout: 30000,
    });

    // 📄 Extract Data

    const title = await page.title();

    const description = await page

      .$eval('meta[name="description"]', (el) => el.getAttribute("content"))

      .catch(() => "No description found");

    await browser.close();

    let aiData: any;

    try {
      // 🤖 AI Analysis

      const aiResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",

        messages: [
          {
            role: "user",

            content: `Analyze this website:

Title: ${title}

Description: ${description}

Give:

- SEO suggestions

- UX improvements

- Performance tips

- Improvements`,
          },
        ],
      });

      aiData = aiResponse.choices[0]?.message?.content;
    } catch (err) {
      console.log("AI ERROR:", err);

      // 🔥 Fallback

      aiData = {
        seo: ["Unable to analyze SEO"],

        ux: ["AI temporarily unavailable"],

        performance: ["Try again later"],

        improvements: ["AI service issue"],
      };
    }

    // ✅ Response

    return res.json({
      title,

      description,

      ai: aiData,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("SERVER ERROR:", error.message);
    } else {
      console.error("SERVER ERROR:", error);
    }

    return res.status(500).json({
      error: "Analysis failed. Try again.",
    });
  }
});

// ✅ Health check (IMPORTANT for Render)

app.get("/", (req: Request, res: Response) => {
  res.send("Backend is running 🚀");
});

// ✅ PORT FIX (RENDER)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
