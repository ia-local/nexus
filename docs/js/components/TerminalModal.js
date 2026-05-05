/**
 * js/components/TerminalModal.js
 * @description Liaison avec le Continent (Groq) + Fallback Hors-Ligne
 */

class TerminalModal {
    static open() {
        if (document.getElementById('terminal-modal')) return;

        const overlay = document.createElement('div');
        overlay.id = 'terminal-modal';
        overlay.className = 'mac-modal-overlay draggable';
        
        overlay.innerHTML = `
            <div class="mac-window terminal-window">
                <div class="mac-title-bar">
                    <div class="close-box" onclick="document.getElementById('terminal-modal').remove()"></div>
                    <div class="stripes"></div>
                    <span class="title-text">TERMINAL GOUVERNEUR</span>
                    <div class="stripes"></div>
                </div>
                <div class="window-content terminal-body">
                    <div id="terminal-history" class="terminal-history">
                        <div class="sys-msg">>_ Canal ouvert. Système de monétisation UTMi activé.</div>
                    </div>
                    <div class="terminal-input-area">
                        <span class="prompt-symbol">USR></span>
                        <input type="text" id="terminal-input" autocomplete="off" placeholder="Rédigez un rapport..." autofocus>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        const inputField = document.getElementById('terminal-input');
        inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && inputField.value.trim() !== '') {
                this.sendTransmission(inputField.value.trim());
                inputField.value = '';
            }
        });
    }

    static async sendTransmission(text) {
        const history = document.getElementById('terminal-history');
        if (!history) return;

        history.insertAdjacentHTML('beforeend', `<div class="usr-msg">USR> ${text}</div>`);
        this.scrollToBottom();

        const loaderId = 'loader-' + Date.now();
        history.insertAdjacentHTML('beforeend', `<div id="${loaderId}" class="sys-msg">SYS> Évaluation de la valeur du rapport...</div>`);
        this.scrollToBottom();

        let aiResponse = "";

        try {
            const response = await fetch('/api/pi', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: text })
            });
            
            if (!response.ok) throw new Error("Serveur injoignable");
            
            const data = await response.json();
            aiResponse = data.result;
        } catch (error) {
            aiResponse = "[MODE AUTONOME] Le Continent est silencieux. Rapport validé localement. Fonds débloqués.";
        }

        const loaderEl = document.getElementById(loaderId);
        if (loaderEl) loaderEl.remove();

        const currentHistory = document.getElementById('terminal-history');
        if (!currentHistory) return;

        try {
            // 1. Calcul UTMi[cite: 10]
            const interactionData = { type: 'prompt', data: { text: text, wordCount: text.split(/\s+/).length } };
            const context = { userCvnuValue: window.CVNU.KERNEL.STATE.USER_CVNU.neutrality_score || 1.0 };
            
            const utmiResult = window.utmiCalculator.calculateUtmi(interactionData, context);
            const gains = utmiResult.utmi + 10; // +10 par défaut

            // 2. CORRECTION MAJEURE ICI : .SYSTEM (en majuscules)[cite: 2]
            if (window.CVNU && window.CVNU.SYSTEM) {
                window.CVNU.SYSTEM.addCVNUPoints(gains);
            }

            // 3. Affichage
            currentHistory.insertAdjacentHTML('beforeend', `<div class="ai-msg">CON> ${aiResponse}</div>`);
            currentHistory.insertAdjacentHTML('beforeend', `<div class="reward-msg">>>> SOLDE CRÉDITÉ : +${gains.toFixed(2)} Ꞓ <<<</div>`);
            
            if (window.CityEngine) window.CityEngine.refreshHUD();
            this.scrollToBottom();

        } catch (err) {
            console.error(err);
            currentHistory.insertAdjacentHTML('beforeend', `<div class="sys-msg">[ERREUR INTERNE] Échec de la monétisation.</div>`);
        }
    }

    static scrollToBottom() {
        const history = document.getElementById('terminal-history');
        if (history) history.scrollTop = history.scrollHeight;
    }
}