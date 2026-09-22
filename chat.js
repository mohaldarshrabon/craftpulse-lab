exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { 
      statusCode: 405, 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method Not Allowed" }) 
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply: "API Key configure kora hoyni. Please check Netlify settings." })
    };
  }

  try {
    const { message } = JSON.parse(event.body || "{}");

    const systemPrompt = `
      You are the official AI Sales Assistant for CraftPulse LAB.
      We sell: "4 Royalty-Free Music Bundle" containing 4 copyright-safe royalty-free tracks with full commercial monetization rights for YouTube, Facebook, Reels, Podcasts.
      Price: 99 BDT (৳ 99).
      Payment methods: bKash, Nagad, Rocket, Upay Personal Send Money to 01742609860.
      Delivery: Delivered via Google Drive access to buyer's Gmail within 15-30 minutes after submitting TrxID.
      Answer politely, concisely, and helpfully in English or Bengali depending on the user's language.

      User asked: ${message}
    `;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemPrompt }] }]
      })
    });

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I could not generate a response.";

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply })
    };
  } catch (error) {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply: "System busy. Apnar proshno thakle direct WhatsApp-e knock korun!" })
    };
  }
};