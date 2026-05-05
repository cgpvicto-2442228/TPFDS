import express from 'express';
import dotenv from 'dotenv';
import authentification from './src/middlewares/authentification.middleware.js';
import bibliothequeRouter from './src/routes/bibliotheques.route.js';
import usersRouter from './src/routes/users.route.js';
// Importation du module swagger-ui-express
import swaggerUi from 'swagger-ui-express';
// Le fichier qui contient la documentation au format JSON, ajustez selon votre projet
import fs from 'fs';
const swaggerDocument = JSON.parse(fs.readFileSync('./src/config/documentation.json', 'utf8'));

// Options le l'interface, changez le titre "Demo API" pour le nom de votre projet 
const swaggerOptions = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Bibliothèque API"
};

const app = express();
dotenv.config();

// Middleware
app.use(express.json());

// Routes
app.use('/api/bibliotheques', authentification, bibliothequeRouter);
app.use('/api/users', usersRouter);

// La route à utiliser pour accéder au rendu visuel de la documentation
app.use('/api/docs',
        swaggerUi.serve,
        swaggerUi.setup(swaggerDocument, swaggerOptions));

app.listen(process.env.PORT || 3000, () => {
    console.log(`Le serveur tourne sur le port ${process.env.PORT}`);
});