
import express from 'express';
import cors from 'cors';

import router from './routes/index.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', router);

app.get('/', (req, res) => {
    res.json({
        mensagem: 'API do Portfólio Escolar funcionando!'
    });
});

export default app;
