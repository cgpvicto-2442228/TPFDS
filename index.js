import express from 'express';
import dotenv from 'dotenv';
import authentification from './src/middlewares/authentification.middleware.js';
import livreRouter from './src/routes/livres.route.js';
import pretRouter from './src/routes/prets.route.js';
import bibliothequeRouter from './src/routes/bibliotheques.route.js';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import cors from 'cors';

const swaggerDocument = JSON.parse(fs.readFileSync('./src/config/documentation.json', 'utf8'));

const swaggerOptions = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Bibliothèque API"
};

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

app.use('/api/livre', authentification, livreRouter);
app.use('/api/pret', authentification, pretRouter);
app.use('/api/bibliotheque', bibliothequeRouter);

app.use('/api/docs',
        swaggerUi.serve,
        swaggerUi.setup(swaggerDocument, swaggerOptions));

app.listen(process.env.PORT || 3000, () => {
    console.log(`Le serveur tourne sur le port ${process.env.PORT}`);
});