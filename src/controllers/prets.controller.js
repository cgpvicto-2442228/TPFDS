import pretsModel from "../models/prets.model.js";

const ajouterPret = async (req, res) => {
    const dateRegex = /^\d{4}-[0-1]\d-[0-4]\d$/;
    let erreur = ``;

    if (req.body.emprunteur === undefined || req.body.emprunteur === "") {
        erreur += `Le champ emprunteur est vide.\n`
    }

    if (req.body.en_cours !== true && req.body.en_cours !== false) {
        erreur += `Le champ en_cours doit être "true" ou "false".\n`
    }

    if (req.body.date_debut !== null && req.body.date_debut.match(dateRegex)) {
        erreur += `Le champ date_debut doit être au format aaaa-mm-jj.\n`
    }

    if (req.body.date_retour !== null && req.body.date_retour.match(dateRegex)) {
        erreur += `Le champ date_retour doit être au format aaaa-mm-jj.\n`
    }

    if (erreur.length > 0) {
        return res.status(400).json({
            erreur: erreur,
        });
    }

    try {
        const pretId = await pretsModel.createLivre(req.body);

        // Réponse 201 Succès
        res.status(201).json({
            message: `Le livre ${req.body.titre} a été ajouté avec succès`,
            livre: {
                id: pretId,
                ...req.body // On "étale" les données reçues pour reconstruire l'objet
            }
        });

    } catch (erreur) {
        res.status(500).json({
            erreur: `Echec lors de la création du livre ${req.body.titre || 'inconnu'}`
        });
    }
};

export default {
    ajouterPret
}