const express = require("express");
const cors = require("cors");

const app = express(); // Esta línea tiene que ir antes de usar `app`
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const precios = {
  redes_sociales: {
    "instagram": 100,
    "facebook": 100,
    "whatsapp": 100,
    "linkedin": 100,
    "instagram+facebook": 180,
    "instagram+whatsapp": 180,
    "instagram+linkedin": 180,
    "facebook+whatsapp": 180,
    "facebook+linkedin": 180,
    "whatsapp+linkedin": 180,
    "todas": 300
  },
  reels: { "10": 300, "20": 600, "30": 900, "40": 1200 },
  flyers: { "10": 150, "2": 300, "3": 450, "4": 600 },
  portadas: { "1": 20, "2": 40, "3": 60, "4": 80 },
  pagina_web: { "1": 400, "2": 800, "3": 1200, "4": 1600 },
  embudo: 200,
  leads: 15,
  guiones: 30
};

app.post("/cotizador", (req, res) => {
  const s = req.body;
  let total = 0;

  if (s.redes_sociales && precios.redes_sociales[s.redes_sociales]) {
    total += precios.redes_sociales[s.redes_sociales];
  }
  if (s.reels && precios.reels[s.reels]) {
    total += precios.reels[s.reels];
  }
  if (s.feeds && precios.flyers[s.feeds]) {
    total += precios.flyers[s.feeds];
  }
  if (s.portadas && precios.portadas[s.portadas]) {
    total += precios.portadas[s.portadas];
  }
  if (s.pagina_web && precios.pagina_web[s.pagina_web]) {
    total += precios.pagina_web[s.pagina_web];
  }
  if (s.embudo) total += precios.embudo;
  if (s.leads) total += precios.leads;
  if (s.guiones) total += precios.guiones;

  res.json({ total });
});

app.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto ${PORT}`);
});
