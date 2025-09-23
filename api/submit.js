// api/submit.js — Vercel Serverless Function

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const webhookUrl = "https://n8n-skalia-u41651.vm.elestio.app/webhook/525f3f8f-cab0-439b-b881-2348796bbbd7";

    // (optionnel) log pour debug dans Vercel
    console.log("📩 Données reçues:", req.body);

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("n8n non-OK:", response.status, text);
      return res.status(502).json({ error: "n8n a renvoyé une erreur", status: response.status, body: text });
    }

    let data = {};
    try { data = await response.json(); } catch { data = { message: "OK (pas de JSON depuis n8n)" }; }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("❌ Erreur proxy → n8n:", error);
    return res.status(500).json({ error: "Erreur interne lors de l'envoi vers n8n" });
  }
}
