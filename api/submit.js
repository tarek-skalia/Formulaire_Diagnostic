// api/submit.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    // 🔗 Ton webhook N8N
    const webhookUrl = "https://n8n-skalia-u41651.vm.elestio.app/webhook-test/525f3f8f-cab0-439b-b881-2348796bbbd7";

    // 📩 Envoi des données reçues au webhook
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      throw new Error(`Erreur N8N: ${response.statusText}`);
    }

    // 🔎 Essaie de parser la réponse JSON de N8N (si elle existe)
    let data = {};
    try {
      data = await response.json();
    } catch {
      data = { message: "Pas de JSON retourné par N8N" };
    }

    // ✅ Réponse au frontend
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Erreur proxy vers N8N:", error);
    res.status(500).json({ error: "Erreur lors de l'envoi" });
  }
}
