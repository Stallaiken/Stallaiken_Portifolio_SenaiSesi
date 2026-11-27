# Portfólio digital — SESI & SENAI 

## Como rodar

Na raiz do projeto:

```bash
npm run install:all   # instala tudo (raiz, back e front)
npm run seed          # (opcional) cria os dados de src/seed/dados.js no banco
npm run dev           # sobe back (porta 3000) e front (porta 5173)
```

Abra **http://localhost:5173**.

Ou, se preferir, em dois terminais:

```bash
cd Back_Repo_Jonatas && npm install && npm run dev
cd Front_Repo_jonatas && npm install && npm run dev
```

## Painel de administração

Abra **/admin** direto no navegador (não há login nem senha). Por lá você cadastra:

1. **Dados do aluno** (nome, série, turma, itinerário) — aparecem em "Quem sou eu?"
2. **Matérias** (SESI ou SENAI) — viram as abas das páginas SESI/SENAI
3. **Registros**
   - **SESI:** Conteúdo, Participação ou Projeto, por bimestre (1 a 4), com imagens opcionais.
   - **SENAI:** cada registro é uma atividade com os tópicos: projetos desenvolvidos, códigos produzidos,
     registros fotográficos (várias imagens), vídeos (links, um por linha), relatórios técnicos,
     aprendizagens construídas, competências desenvolvidas e autoavaliação.
4. **Reflexões anuais** — aparecem em "Quem sou eu?"

## Páginas do site

| Rota | O que mostra |
| --- | --- |
| `/` | Apresentação (saudação e atalhos) |
| `/quem-sou-eu` | Dados do aluno e reflexões |
| `/sesi` | Registros do SESI: abas por matéria, filtros por tipo e bimestre |
| `/senai` | Registros do SENAI: abas por matéria, filtro por tipo |
| `/admin` | Painel de gerenciamento |

## API (Back_Repo_Jonatas)

- `/api/alunos`, `/api/materias`, `/api/registros`, `/api/reflexoes` — CRUD (sem autenticação)
- `GET /api/imagens/:id` — devolve uma imagem guardada no banco

