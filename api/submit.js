// api/submit.js
// Proxy Vercel → envoie les données du formulaire vers ton webhook n8n

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    // Récupération des données envoyées par le formulaire
    const data = req.body;

    // Envoi vers ton webhook n8n
    const response = await fetch(
      "https://n8n-skalia-u41651.vm.elestio.app/webhook-test/525f3f8f-cab0-439b-b881-2348796bbbd7",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(`Erreur côté n8n : ${response.status}`);
    }

    // Réponse succès
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Erreur proxy:", err);
    return res
      .status(500)
      .json({ error: "Erreur interne lors de l'envoi au webhook" });
  }
}
