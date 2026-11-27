import multer from "multer";

// Os arquivos ficam na memória e o controller grava no banco (tabela "imagens").
const tiposPermitidos = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (tiposPermitidos.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Formato de imagem não permitido."));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default upload;
