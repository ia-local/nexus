'use strict';

const CityEngine = {
    selectedBuild: null,
    mapWidth: 64,
    mapHeight: 20,
    islandMap: [],

    init() {
        console.log("🚀 Initialisation de l'Île (System 1)...");

        if (!window.CVNU) {
            this.log("❌ ERREUR : Kernel CVNU non détecté.");
            return;
        }

        try {
            this.generateVirginIsland();
            this.updateViewport();
            this.refreshHUD();
            this.setupInteractions();
            this.log("Système Gouverneur initialisé. L'île est prête.");
        } catch (e) {
            console.error(e);
        }
    },

    generateVirginIsland() {
        this.islandMap = [];
        for (let y = 0; y < this.mapHeight; y++) {
            let row = [];
            for (let x = 0; x < this.mapWidth; x++) {
                const dx = x - this.mapWidth / 2;
                const dy = (y - this.mapHeight / 2) * 2;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const noise = Math.random() * 4;
                
                if (distance + noise < 16) {
                    row.push('▒'); // Terre dense, très visible
                } else {
                    row.push('.'); // Eau (évite que le navigateur n'efface les espaces)
                }
            }
            this.islandMap.push(row);
        }
        // QG de départ
        this.islandMap[Math.floor(this.mapHeight/2)][Math.floor(this.mapWidth/2)] = '⌂';
    },

updateViewport() {
        const viewport = document.getElementById('ascii-canvas');
        if (!viewport) return;

        let htmlRender = "";
        
        // Ligne du haut forcée dans un bloc div
        htmlRender += `<div>╔${"═".repeat(this.mapWidth)}╗</div>`;
        
        // Génération ligne par ligne
        for (let y = 0; y < this.mapHeight; y++) {
            let rowLine = this.islandMap[y].join('');
            // On remplace les espaces vides par des espaces insécables HTML pour éviter l'écrasement
            rowLine = rowLine.replace(/ /g, '&nbsp;');
            htmlRender += `<div>║${rowLine}║</div>`;
        }
        
        // Ligne du bas
        htmlRender += `<div>╚${"═".repeat(this.mapWidth)}╝</div>`;
        
        // On injecte du vrai code HTML (DIV) au lieu de texte brut
        viewport.innerHTML = htmlRender;
    },

    setupInteractions() {
        const viewport = document.getElementById('ascii-canvas');
        if (!viewport) return;

        viewport.addEventListener('mousedown', (e) => {
            if (!this.selectedBuild) {
                this.log("⚠️ Opération annulée. Aucun plan architectural sélectionné.");
                return;
            }

            const rect = viewport.getBoundingClientRect();
            const xPercent = (e.clientX - rect.left) / rect.width;
            const yPercent = (e.clientY - rect.top) / rect.height;
            
            // Calcul des coordonnées basé sur la grille 64x20 (avec +2 pour les bordures ║)
            const x = Math.floor(xPercent * (this.mapWidth + 2)) - 1;
            const y = Math.floor(yPercent * (this.mapHeight + 2)) - 1;

            console.log(`[DEBUG CLICK] X: ${x}, Y: ${y} | Case: ${this.islandMap[y] ? this.islandMap[y][x] : 'Hors carte'}`);

            if (x >= 0 && x < this.mapWidth && y >= 0 && y < this.mapHeight) {
                this.executeBuild(x, y);
            } else {
                this.log("⚠️ Clic en dehors des limites de l'île.");
            }
        });
    },
    refreshHUD() {
        const state = window.CVNU.KERNEL.STATE;
        const user = state.USER_CVNU;

        const levelElem = document.getElementById('city-level');
        const balanceElem = document.getElementById('balance-utmi');
        if (levelElem) levelElem.textContent = `LVL ${user.level.toString().padStart(2, '0')}`;
        if (balanceElem) balanceElem.textContent = `${user.value_points.toFixed(2)} Ꞓ`;
    },

    selectBuild(type) {
        this.selectedBuild = type.toUpperCase();
        
        document.querySelectorAll('.build-item').forEach(btn => {
            btn.style.background = 'var(--bg)';
            btn.style.color = 'var(--fg)';
        });
        const activeBtn = event.currentTarget;
        activeBtn.style.background = 'var(--fg)';
        activeBtn.style.color = 'var(--bg)';

        this.log(`Plan : ${this.selectedBuild}. Cliquez sur la terre (▒).`);
    },
    executeBuild(x, y) {
        if (this.islandMap[y][x] !== '▒') {
            this.log("⚠️ Terrain non constructible.");
            return;
        }

        const cost = 50; 
        const user = window.CVNU.KERNEL.STATE.USER_CVNU;

        if (user.value_points >= cost) {
            // CORRECTION ICI : SYSTEM en majuscules[cite: 2]
            window.CVNU.SYSTEM.addCVNUPoints(-cost);

            const glyphMap = { 'HOUSE': '🏘️', 'BANK': '🏦', 'FACTORY': '🏭', 'ROAD': '═' };
            this.islandMap[y][x] = glyphMap[this.selectedBuild] || 'X';
            
            this.updateViewport();
            this.refreshHUD();
            this.log(`🏗️ Construction achevée en (${x},${y}) : -${cost}Ꞓ.`);
        } else {
            // Vérification de l'existence de ModalSystem avant appel
            if(typeof ModalSystem !== 'undefined') {
                ModalSystem.open("ERREUR DE FONDS", "Vous manquez d'UTMi. Ouvrez le Terminal.", [{label: "FERMER", action: () => {}}]);
            } else {
                this.log("⚠️ UTMi insuffisants.");
            }
        }
    },

    log(message) {
        const output = document.getElementById('log-output');
        if (output) {
            const time = new Date().toLocaleTimeString('fr-FR', { hour12: false });
            const newLog = document.createElement('div');
            newLog.textContent = `[${time}] ${message}`;
            output.appendChild(newLog);
            output.scrollTop = output.scrollHeight;
        }
    }
};

window.selectBuild = function(type) {
    CityEngine.selectBuild(type);
};

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (window.CVNU) CityEngine.init();
    }, 500); 
});