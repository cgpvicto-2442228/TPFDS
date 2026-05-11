import bibliothequesModel from '../models/bibliotheques.model.js';
import bcrypt from 'bcrypt';

const inscrire = async (req, res) => {
    const { nom, courriel, mot_de_passe } = req.body;

    if (!nom || !courriel || !mot_de_passe) {
        return res.status(400).json({ erreur: "Tous les champs sont obligatoires" });
    }

    try {
        const existeDeja = await bibliothequesModel.findParCourriel(courriel);
        if (existeDeja) return res.status(400).json({ erreur: "Ce courriel est déjà utilisé" });

        const hash = await bcrypt.hash(mot_de_passe, 10);
        const cleApi = crypto.randomUUID();

        await bibliothequesModel.createBibliotheque(nom, courriel, hash, cleApi);

        res.status(201).json({ 
            message: "La bibliothèque a été créée", 
            cle_api: cleApi 
        });
    } catch (erreur) {
        console.error(erreur);
        res.status(500).json({ 
            erreur: "Erreur lors de la création"
        });
    }
};

const recupererCle = async (req, res) => {
    const { courriel, mot_de_passe } = req.body;
    const genererNouvelle = req.query.nouvelle;

    if (!courriel || !mot_de_passe) {
        return res.status(400).json({ erreur: "Tous les champs sont obligatoires" });
    }

    try {
        const user = await bibliothequesModel.findParCourriel(courriel);
        if (!user || !(await bcrypt.compare(mot_de_passe, user.password))) {
            return res.status(401).json({ erreur: "Identifiants invalides" });
        }

        let cleARetourner = user.cle_api;

        if (genererNouvelle === "1") {
            cleARetourner = crypto.randomUUID();
            await bibliothequesModel.updateCleApi(user.id, cleARetourner);
        }

        res.json({ cle_api: cleARetourner });
    } catch (erreur) {
        console.error(erreur);
        res.status(500).json({ 
            erreur: "Erreur serveur" 
        });
    }
};

export { 
    inscrire, 
    recupererCle 
};