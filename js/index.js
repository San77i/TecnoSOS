const express = require("express");
const cors = require("cors");

const app = express();
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
  reels: { "1": 50, "2": 90, "3": 120, "4": 140 },
  flyers: { "1": 40, "2": 70, "3": 100, "4": 120 },
  portadas: { "1": 30, "2": 50, "3": 70, "4": 90 },
  pagina_web: { "1": 300, "2": 500, "3": 700, "4": 900 },
  embudo: 150,
  leads: 200,
  reuniones: 100,
  guiones: 80
};

app.post("/cotizar", (req, res) => {
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
  if (s.reuniones) total += precios.reuniones;
  if (s.guiones) total += precios.guiones;

  res.json({ total });
});

app.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto ${PORT}`);
});
