// api/submit.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    // ✅ Webhook N8N actif (workflow activé, sans -test)
    const webhookUrl = "https://n8n-skalia-u41651.vm.elestio.app/webhook/525f3f8f-cab0-439b-b881-2348796bbbd7";

    // 🔍 Log côté Vercel pour debug
    console.log("📩 Données reçues du formulaire:", req.body);

    // 📤 Envoi vers N8N
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      throw new Error(`Erreur N8N: ${response.status} ${response.statusText}`);
    }

    // 🔎 Essayer de lire la réponse de N8N
    let data = {};
    try {
      data = await response.json();
    } catch {
      data = { message: "Pas de JSON retourné par N8N (c'est normal si ton workflow ne renvoie rien)" };
    }

    // ✅ Succès → réponse envoyée au frontend
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("❌ Erreur proxy vers N8N:", error);
    res.status(500).json({ error: "Erreur lors de l'envoi vers N8N" });
  }
}
