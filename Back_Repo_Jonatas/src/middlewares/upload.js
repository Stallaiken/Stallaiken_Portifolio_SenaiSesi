import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pastaUploads = path.resolve(__dirname, "../../uploads");

fs.mkdirSync(pastaUploads, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, pastaUploads);
  },

  filename: (req, file, cb) => {
    const extensao = path.extname(file.originalname).toLowerCase();

    cb(null, `${randomUUID()}${extensao}`);
  },
});

// Aceita apenas imagens.
function filtrarArquivo(req, file, cb) {
  const tiposPermitidos = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  if (tiposPermitidos.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Formato de imagem não permitido."));
  }
}

const upload = multer({
  storage,
  fileFilter: filtrarArquivo,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default upload;
