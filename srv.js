const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'docs')));


const PORT = process.env.PORT || 2018;
app.listen(PORT, () => {
    console.log(`╔══════════════════════════════════════════════════════════╗`);
    console.log(`║          SERVEUR plc-resilience-plastique                ║`);
    console.log(`╠══════════════════════════════════════════════════════════╣`);
    console.log(`║  Status : NOYAU SEGMENTÉ & OPÉRATIONNEL                  ║`);
    console.log(`║  ROOT : http://localhost:${PORT}                        ║`);
    console.log(`╚══════════════════════════════════════════════════════════╝\n`);
});