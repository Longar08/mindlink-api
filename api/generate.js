import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Only POST allowed" });
    }

    const { address, beds, baths, price, city } = req.body || {};

    if (!address || !beds || !baths || !price || !city) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["address", "beds", "baths", "price", "city"]
      });
    }

    const prompt = `
You are the top luxury real estate marketer in ${city}.

Property:
Address: ${address}
Beds: ${beds}
Baths: ${baths}
Price: $${price}

Produce EXACTLY in this order and clearly labeled:

1. 240-word emotional MLS description
2. Ideal buyer avatar (desires, fears, objections)
3. 20 Instagram carousel captions
4. 15 TikTok hooks
5. 3 paid ad variations
6. 5-email seller nurture sequence
7. Top 10 objections + precise rebuttals
8. 60-second video script
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    });

    return res.status(200).json({
      success: true,
      output: completion.choices[0].message.content
    });

  } catch (err) {
    console.error("AI ERROR:", err);
    return res.status(500).json({
      error: "Generation failed",
      details: err.message
    });
  }
}
