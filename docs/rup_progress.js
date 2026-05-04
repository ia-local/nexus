/**
 * MODULE: RUP_PROGRESSION_ENGINE
 * Rôle : Gère les 10 niveaux de sécurité et la montée en puissance exponentielle.
 */

const RUP_LEVELS_CONFIG = {
    0: { min_points: 0,    guaranteed_rup: 0,    label: "INITIATION" },
    1: { min_points: 750,  guaranteed_rup: 750,  label: "SEUIL_SURVIE" },   // Incompressible une fois atteint
    2: { min_points: 1500, guaranteed_rup: 1200, label: "SEUIL_PAUVRETE" }, // @Mickael : 1200€ sécurisés
    3: { min_points: 2500, guaranteed_rup: 1800, label: "AUTONOMIE" },
    // ... Progression jusqu'au niveau 10
    10: { min_points: 50000, guaranteed_rup: 7500, label: "EXCELLENCE" }    // Plafond de ressources
};

export const ProgressionManager = {
    /**
     * Calcule si l'utilisateur monte de niveau.
     * Applique le "Safety Lock" : le niveau ne peut que monter.
     */
    updateLevel(currentState) {
        const points = currentState.USER_CVNU.value_points;
        let newLevel = currentState.USER_CVNU.level;

        for (const [lvl, config] of Object.entries(RUP_LEVELS_CONFIG)) {
            if (points >= config.min_points && lvl > newLevel) {
                newLevel = parseInt(lvl);
                console.log(`🆙 LEVEL UP: Niveau ${newLevel} atteint. Revenu sécurisé.`);
            }
        }
        
        currentState.USER_CVNU.level = newLevel;
        // Le revenu garanti est désormais indexé sur le niveau atteint, pas sur la performance fluctuante
        currentState.USER_CVNU.guaranteed_income = RUP_LEVELS_CONFIG[newLevel].guaranteed_rup;
        
        return currentState;
    }
};