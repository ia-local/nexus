# 🏙️ CVNU: Urban Nexus | City Builder 1-Bit

[![Version](https://img.shields.io/badge/Version-1.0.0--Beta-27ae60.svg)](#)
[![License](https://img.shields.io/badge/License-GNU--GPL-white.svg)](#)
[![Protocol](https://img.shields.io/badge/Protocol-CVNU--RUP-blue.svg)](#)

**CVNU: Urban Nexus** est un jeu de simulation de gestion urbaine (City Builder) minimaliste en 1-bit, directement propulsé par le noyau économique **CVNU** (Cadre de Valeur Numérique Universel). 

Contrairement aux jeux classiques, votre budget de construction provient de la valeur réelle générée par vos interactions numériques, vos compétences et votre activité au sein de l'écosystème **RUP** (Revenu Universel Progressif).

---

## 🕹️ Concept & Gameplay

### 💎 L'Économie Réelle (Backend Logic)
Le jeu est synchronisé avec les fichiers `utms_calculator.js` et `circular_tax_engine.js`. 
- **Génération de Ressources :** Vos messages, codes et analyses produisent des **UTMi** (1 UTMi = 1 EUR).
- **Financement RUP :** Une **Taxe IA de 6.8%** est prélevée sur vos gains pour alimenter le fonds de développement de votre cité.
- **Objectif :** Passer du stade de "Cité de Survie" (750€/mois) à "Métropole Souveraine" (7500€/mois) en un cycle de 28 jours.

### 🏗️ Construction & Urbanisme (1-Bit Rendering)
Le rendu utilise le dictionnaire `/ascii` du `CORE_SYSTEM_CVNU.js` pour transformer des données brutes en une cité visuelle :
- **Zones Résidentielles (`🏘️`) :** Augmentent la population et le score de neutralité.
- **Banques & Trésoreries (`🏦`) :** Optimisent la synchronisation RIB et les flux de TVA.
- **Zones Industrielles (`🏭`) :** Accélèrent la production d'UTMi mais nécessitent une gestion stricte de la circularité.
- **Infrastructures (`═`) :** Connectent les nœuds de valeur pour maximiser les bonus de proximité.

---

## 🛠️ Architecture Technique

Le projet repose sur une architecture **Full-Stack Décentralisée** :

- **Kernel :** `CORE_SYSTEM_CVNU.js` (Gestion de l'état, niveaux 1-10, et logique métier).
- **Engine :** `city_engine.js` (Moteur de rendu ASCII et gestion du Viewport).
- **Smart Contracts :** `CVNU.sol` & `TVA_RIB_Synchronizer.sol` (Garantie de la transparence des flux financiers).
- **Frontend :** HTML5/CSS3 en mode **1-bit High-Tech** (Noir/Blanc/Vert).

---

## 🚀 Installation & Lancement

1. Clonez le répertoire :
   ```bash
   git clone [https://github.com/votre-compte/cvnu-urban-nexus.git](https://github.com/votre-compte/cvnu-urban-nexus.git)