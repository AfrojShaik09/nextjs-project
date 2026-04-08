import express from "express";

import cors from "cors";

import puppeteer from "puppeteer";

import OpenAI from "openai";

import dotenv from "dotenv";

import type { Request, Response } from "express";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

const openai = new OpenAI({

  apiKey: process.env.OPENAI_API_KEY,

});

app.post("/analyze", async (req: Request, res: Response) => {

  try {

    const { url } = req.body;

    if (!url) {

      return res.status(400).json({ error: "URL is required" });

    }

    // 🌐 Scrape website

    const browser = await puppeteer.launch({

      headless: true,

    });

    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "domcontentloaded" });

    const title = await page.title();

    const description = await page.$eval(

      'meta[name="description"]',

      (el) => el.getAttribute("content") || ""

    ).catch(() => "");

    await browser.close();

    let aiData;

    try {

      // 🤖 AI Analysis

      const response = await openai.chat.completions.create({

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

            - Performance tips`,

          },

        ],

      });

      aiData = response.choices[0].message.content;

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

    return res.json({

      title,

      description,

      ai: aiData,

    });

  } catch (error: unknown) {

    console.error("SERVER ERROR:", error?.message || error);

    return res.status(500).json({

      error: "Analysis failed. Try again.",

    });

  }

});

app.listen(5000, () => {

  console.log("🚀 Server running on http://localhost:5000");

});
 