import { NextResponse } from "next/server";

import puppeteer from "puppeteer";

import OpenAI from "openai";

// ⚠️ Fix SSL issue (dev only)

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 🧠 Helper: Fix URL

function normalizeUrl(url: string): string {
  if (!url.startsWith("http")) {
    return "https://" + url;
  }

  return url;
}

export async function POST(req: Request) {
  try {
    let { url } = await req.json();

    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },

        { status: 400 },
      );
    }

    url = normalizeUrl(url);

    // 🚀 Launch Puppeteer

    const browser = await puppeteer.launch({
      headless: true,

      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    await page.goto(url, {
      waitUntil: "domcontentloaded",

      timeout: 30000,
    });

    // 📊 Extract Data

    const title = await page.title();

    const description = await page

      .$eval(
        'meta[name="description"]',
        (el: Element) => (el as HTMLMetaElement).content,
      )

      .catch(() => "No description");

    const headings = await page.$$eval("h1, h2", (els) =>
      els.map((el) => el.textContent?.trim() || ""),
    );

    const imageCount = await page.$$eval("img", (imgs) => imgs.length);

    // 📱 Mobile Check

    const hasViewport = await page

      .$eval('meta[name="viewport"]', () => true)

      .catch(() => false);

    // ⚡ Performance Check

    const largeImages = await page.$$eval(
      "img",
      (imgs) => imgs.filter((img) => img.width > 1000).length,
    );

    // 📸 Screenshot

    const screenshot = await page.screenshot({
      encoding: "base64",

      fullPage: true,
    });

    await browser.close();

    // 📊 SEO Breakdown

    const seo = {
      titleScore: title.length > 10 ? 30 : 10,

      descScore: description !== "No description" ? 30 : 10,

      headingScore: headings.length > 0 ? 20 : 5,

      imageScore: imageCount > 0 ? 20 : 5,
    };

    const totalSEO =
      seo.titleScore + seo.descScore + seo.headingScore + seo.imageScore;

    // 📱 Mobile Result

    const mobile = {
      hasViewport,

      status: hasViewport ? "Mobile Friendly" : "Not Mobile Optimized",
    };

    // ⚡ Performance Result

    const performance = {
      imageCount,

      largeImages,

      suggestion:
        largeImages > 5
          ? "Too many large images. Optimize images for faster loading."
          : "Images look optimized",
    };

    // 🤖 AI Prompt (STRICT JSON)

    const prompt = `

You are an SEO analyzer.

Analyze this website:

Title: ${title}

Description: ${description}

Headings: ${headings.join(", ")}

Images: ${imageCount}

IMPORTANT:

- Return ONLY valid JSON

- No explanation

- No text outside JSON

FORMAT:

{

  "seo": ["..."],

  "ux": ["..."],

  "performance": ["..."],

  "improvements": ["..."],

  "betterMetaDescription": "..."

}

`;

    let aiData = {
      seo: [],

      ux: [],

      performance: [],

      improvements: ["AI temporarily unavailable"],
    };

    try {
      const aiRes = await openai.chat.completions.create({
        model: "gpt-4o-mini",

        messages: [{ role: "user", content: prompt }],
      });
      console.log("AI RAW RESPONSE:", aiRes);
      const content = aiRes?.choices?.[0]?.message?.content;

      if (content) {
        try {
          aiData = JSON.parse(content);
        } catch {
          aiData.improvements = [content];
        }
      }
    } catch (err) {
      console.log("AI ERROR:", err);
    }

    // 🎯 Final Response

    return NextResponse.json({
      title,

      description,

      headings,

      imageCount,

      screenshot,

      seo: {
        ...seo,

        total: totalSEO,
      },

      mobile,

      performance,

      ai: aiData,
    });
  } catch (error) {
    console.error("API ERROR:", error);

    return NextResponse.json(
      { error: "Analysis failed" },

      { status: 500 },
    );
  }
}
