process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // For local testing only, not recommended for production
import { NextResponse } from "next/server";

import puppeteer from "puppeteer";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL required" }, { status: 400 });
    }

    // 🚀 Launch browser

    const browser = await puppeteer.launch({
      headless: true,

      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "domcontentloaded" });

    // 📊 Extract data

    const title = await page.title();

    const description = await page

      .$eval(
        'meta[name="description"]',
        (el: Element) => (el as HTMLMetaElement).content,
      )

      .catch(() => "No description");

    const headings = await page.$$eval("h1, h2", (els) =>
      els.map((el) => el.textContent || ""),
    );

    const imageCount = await page.$$eval("img", (imgs) => imgs.length);

    const screenshot = await page.screenshot({
      encoding: "base64",

      fullPage: true,
    });

    await browser.close();

    // 🤖 AI Prompt

    const prompt = `

    Analyze this website:

    Title: ${title}

    Description: ${description}

    Headings: ${headings.join(",")}

    Images: ${imageCount}

    Give JSON format:

    {

      "seo": [],

      "ux": [],

      "performance": [],

      "improvements": []

    }

    `;

    const aiRes = await openai.chat.completions.create({
      model: "gpt-4o-mini",

      messages: [{ role: "user", content: prompt }],
    });

    let aiData;

    try {
      aiData = JSON.parse(aiRes.choices[0].message.content || "{}");
    } catch {
      aiData = { improvements: ["AI parsing failed"] };
    }

    // 📊 Simple Score

    let seoScore = 0;

    if (description !== "No description") seoScore += 30;

    if (headings.length > 0) seoScore += 30;

    if (title.length > 10) seoScore += 20;

    if (imageCount > 0) seoScore += 20;

    return NextResponse.json({
      title,

      description,

      headings,

      imageCount,

      screenshot,

      seoScore,

      ai: aiData,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
