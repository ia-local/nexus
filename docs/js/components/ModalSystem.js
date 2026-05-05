/**
 * js/components/ModalSystem.js
 * @description Générateur de fenêtres modales 1-Bit (Mac OS '84)
 */

class ModalSystem {
    static open(title, contentHTML, buttons = []) {
        // 1. Création de l'overlay tramé
        const overlay = document.createElement('div');
        overlay.className = 'mac-modal-overlay';
        
        // 2. Création de la fenêtre
        const modal = document.createElement('div');
        modal.className = 'mac-window modal-window';
        
        // 3. Barre de titre
        const titleBar = document.createElement('div');
        titleBar.className = 'mac-title-bar';
        titleBar.innerHTML = `
            <div class="close-box" onclick="this.closest('.mac-modal-overlay').remove()"></div>
            <div class="stripes"></div>
            <span class="title-text">${title}</span>
            <div class="stripes"></div>
        `;
        
        // 4. Contenu
        const content = document.createElement('div');
        content.className = 'window-content modal-body';
        content.innerHTML = contentHTML;

        // 5. Boutons d'action
        const actionArea = document.createElement('div');
        actionArea.className = 'modal-actions';
        
        buttons.forEach(btn => {
            const buttonEl = document.createElement('button');
            buttonEl.className = 'build-item'; // Réutilisation du style 1-bit
            buttonEl.innerText = btn.label;
            buttonEl.onclick = () => {
                btn.action();
                if (btn.closeOnClick !== false) overlay.remove();
            };
            actionArea.appendChild(buttonEl);
        });

        if (buttons.length > 0) content.appendChild(actionArea);

        modal.appendChild(titleBar);
        modal.appendChild(content);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }
}