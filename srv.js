/**
 * server.js
 * @version 1.0.0
 * @role Serveur Hôte CVNU (NODE_BAVENT_01)
 * @description Sert les fichiers statiques (docs/) et gère le pont API Groq Llama-3.1
 */

const express = require('express');
const path = require('path');
const cors = require('cors');
const { Groq } = require('groq-sdk');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3145; // Port défini dans le KERNEL CVNU[cite: 2]

// Initialisation du client Groq
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// Middlewares
app.use(cors());
app.use(express.json());

// --------------------------------------------------------------------------
// 1. SERVEUR STATIQUE
// --------------------------------------------------------------------------
// On sert tout le contenu du répertoire 'docs' à la racine de l'URL
app.use(express.static(path.join(__dirname, 'docs')));

// --------------------------------------------------------------------------
// 2. PONT COGNITIF (API ROUTING)
// --------------------------------------------------------------------------
// Cette route correspond exactement à la fonction callLlama() du CORE_SYSTEM_CVNU.js[cite: 2]
app.post('/api/pi', async (req, res) => {
    try {
        const { prompt, systemRole } = req.body;
        
        // Modèle optimisé imposé par le cahier des charges
        const targetModel = "llama-3.1-8b-instant"; 

        console.log(`\n[AGI ROUTING] Requête entrante...`);
        console.log(`> Rôle   : ${systemRole || 'System'}`);
        console.log(`> Prompt : ${prompt.substring(0, 50)}...`);

        // Appel à l'API Groq
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: systemRole || "Tu es l'Architecte AGI du protocole CVNU, un assistant gouvernant une île dans un jeu de gestion City Builder 1-bit (style Macintosh 1984). Tes réponses doivent être brèves, techniques, froides mais aidantes, formatées en texte brut ou ASCII."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: targetModel,
            temperature: 0.5, // Température basse pour des réponses plus déterministes et "système"
            max_tokens: 1024,
        });

        const resultText = chatCompletion.choices[0]?.message?.content || "Erreur de flux cognitif.";
        
        // Retourne le JSON attendu par le frontend[cite: 2]
        res.json({ result: resultText });

    } catch (error) {
        console.error("❌ [ERREUR KERNEL] Connexion au modèle Groq échouée:", error.message);
        res.status(500).json({ result: "⚠️ Erreur de liaison AGI : Le sous-système Groq ne répond pas." });
    }
});

// --------------------------------------------------------------------------
// 3. FALLBACK DE SÉCURITÉ
// --------------------------------------------------------------------------
// Si une route inconnue est demandée, on renvoie l'index.html de la Single Page App
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'docs', 'index.html'));
});

// --------------------------------------------------------------------------
// 4. BOOT SEQUENCE
// --------------------------------------------------------------------------
app.listen(PORT, () => {
    console.log(`\n╔════════════════════════════════════════════════════════════╗`);
    console.log(`║ [NODE_BAVENT_01] HOST SYSTEM EN LIGNE                      ║`);
    console.log(`╠════════════════════════════════════════════════════════════╣`);
    console.log(`║ 📡 Port d'écoute  : http://localhost:${PORT}               ║`);
    console.log(`║ 📁 Répertoire Web : /docs                                  ║`);
    console.log(`║ 🧠 Moteur IA      : llama-3.1-8b-instant (Groq)            ║`);
    console.log(`╚════════════════════════════════════════════════════════════╝\n`);
});