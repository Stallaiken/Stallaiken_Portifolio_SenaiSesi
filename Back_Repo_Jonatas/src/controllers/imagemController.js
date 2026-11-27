import { Imagem } from "../models/index.js";

// GET /api/imagens/:id  -> devolve a imagem guardada no banco.
export async function mostrar(req, res) {
  const imagem = await Imagem.findByPk(req.params.id);

  if (!imagem) {
    return res.status(404).json({ erro: "Imagem não encontrada." });
  }

  res.set("Content-Type", imagem.mime);
  res.set("Cache-Control", "public, max-age=31536000");
  return res.send(imagem.dados);
}
