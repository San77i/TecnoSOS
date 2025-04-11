const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/cotizar", (req, res) => {
    const {
        redes_sociales, reels, feeds, portadas,
        embudo, leads, reuniones, guiones, pagina_web
    } = req.body;

    // Lógica de precios (oculta al frontend)
    const precios = {
        redes_sociales: {
            instagram: 100,
            facebook: 100,
            whatsapp: 100,
            linkedin: 100,
            "instagram+facebook": 180,
            "instagram+whatsapp": 180,
            "instagram+linkedin": 180,
            "facebook+whatsapp": 180,
            "facebook+linkedin": 180,
            "whatsapp+linkedin": 180,
            todas: 300,
        },
        reels: 50,
        feeds: 40,
        portadas: 25,
        embudo: 200,
        leads: 150,
        reuniones: 100,
        guiones: 120,
        pagina_web: 300
    };

    let total = 0;
    if (precios.redes_sociales[redes_sociales]) total += precios.redes_sociales[redes_sociales];
    if (reels) total += parseInt(reels) * precios.reels;
    if (feeds) total += parseInt(feeds) * precios.feeds;
    if (portadas) total += parseInt(portadas) * precios.portadas;
    if (embudo) total += precios.embudo;
    if (leads) total += precios.leads;
    if (reuniones) total += precios.reuniones;
    if (guiones) total += precios.guiones;
    if (pagina_web) total += parseInt(pagina_web) * precios.pagina_web;

    res.json({ total });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
