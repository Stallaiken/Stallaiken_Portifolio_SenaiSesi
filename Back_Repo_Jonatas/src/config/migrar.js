import { DataTypes } from "sequelize";
import sequelize from "./database.js";

// Colunas adicionadas depois da primeira versão do banco.
const colunasNovas = {
  projetos_desenvolvidos: DataTypes.TEXT,
  codigos_produzidos: DataTypes.TEXT,
  videos: DataTypes.TEXT,
  relatorios_tecnicos: DataTypes.TEXT,
  aprendizagens_construidas: DataTypes.TEXT,
  competencias_desenvolvidas: DataTypes.TEXT,
  imagens: DataTypes.TEXT,
};

// Atualiza um banco antigo SEM apagar nada: só cria as colunas que faltam.
export default async function migrar() {
  const consulta = sequelize.getQueryInterface();
  const existentes = await consulta.describeTable("registros");

  for (const [nome, tipo] of Object.entries(colunasNovas)) {
    if (!existentes[nome]) {
      await consulta.addColumn("registros", nome, { type: tipo, allowNull: true });
      console.log(`Coluna adicionada em registros: ${nome}`);
    }
  }
}
