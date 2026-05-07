import pretsModel from "../models/prets.model.js";

const ajouterPret = async (req, res) => {
    const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2]\d|3[0-1])$/;
    let erreur = ``;

    if (req.body.livre_id === undefined || parseInt(req.body.livre_id) <= 0) {
        erreur += `L'id du pret est obligatoire et doit être supérieur à 0.\n`
    }

    if (req.body.emprunteur === undefined || req.body.emprunteur === "") {
        erreur += `Le champ emprunteur est vide.\n`
    }

    if (req.body.en_cours === undefined || req.body.en_cours !== true && req.body.en_cours !== false) {
        erreur += `Le champ en_cours doit être "true" ou "false".\n`
    }

    if (req.body.date_debut === undefined || !req.body.date_debut.match(dateRegex)) {
        erreur += `Le champ date_debut doit être au format aaaa-mm-jj.\n`
    }

    if (!req.body.date_retour.match(dateRegex)) {
        erreur += `Le champ date_retour doit être au format aaaa-mm-jj.\n`
    }

    if (erreur.length > 0) {
        return res.status(400).json({
            erreur: erreur,
        });
    }

    try {
        const pretId = await pretsModel.createPret(req.body);

        // Réponse 201 Succès
        res.status(201).json({
            message: `Le pret pour ${req.body.emprunteur} a été ajouté avec succès`,
            pret: {
                id: pretId,
                ...req.body // On "étale" les données reçues pour reconstruire l'objet
            }
        });

    } catch (erreur) {
        res.status(500).json({
            erreur: `Echec lors de la création du pret`
        });
    }
};

const modifierPret = async (req, res) => {
    const id = req.params.id;
    const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2]\d|3[0-1])$/;
    let erreur = ``;

    if(!id || parseInt(id) <= 0){
        res.status(400);
        res.send({
            message: "L'id du pret est obligatoire et doit être supérieur à 0"
        });
        return;
    }

    if (req.body.emprunteur === undefined || req.body.emprunteur === "") {
        erreur += `Le champ emprunteur est vide.\n`
    }

    if (req.body.en_cours === undefined || req.body.en_cours !== true && req.body.en_cours !== false) {
        erreur += `Le champ en_cours doit être "true" ou "false".\n`
    }

    if (req.body.date_debut === undefined || !req.body.date_debut.match(dateRegex)) {
        erreur += `Le champ date_debut doit être au format aaaa-mm-jj.\n`
    }

    if (req.body.date_retour === undefined || !req.body.date_retour.match(dateRegex)) {
        erreur += `Le champ date_retour doit être au format aaaa-mm-jj.\n`
    }

    if (erreur.length > 0) {
        return res.status(400).json({
            erreur: erreur,
        });
    }

    try {
        const affectedRows = await pretsModel.updatePret(id, req.body);

        if (affectedRows === 0) {
            return res.status(404).json({
                erreur: `Le pret id ${id} n'existe pas dans la base de données`
            });
        }

        // Succès 200
        res.status(200).json({
            message: `Le pret id ${id} a été modifié avec succès`
        });

    } catch (erreur) {
        res.status(500).json({
            erreur: `Echec lors de la modification du pret de ${req.body.emprunteur || 'inconnu'}`
        });
    }
};

const modifierStatusPret = async (req, res) => {
    const id = req.params.id;
    const enCours = req.body.en_cours;

    if(!id || parseInt(id) <= 0){
        res.status(400);
        res.send({
            message: "L'id du pret est obligatoire et doit être supérieur à 0"
        });
        return;
    }

    if (enCours === undefined || enCours !== true && enCours !== false) {
        return res.status(400).json({
            erreur: `Le champ enCours doit être "true" ou "false".`,
        });
    }

    try {
        const affectedRows = await pretsModel.updateStatusPret(id, enCours);

        if (affectedRows === 0) {
            return res.status(404).json({
                erreur: `Le pret id ${id} n'existe pas dans la base de données`
            });
        }

        // Succès 200
        res.status(200).json({
            message: `Le status du pret id ${id} a été modifié avec succès`
        });

    } catch (erreur) {
        res.status(500).json({
            erreur: `Echec lors de la modification du status du pret id ${id}`
        });
    }
};

const supprimerPret = async (req, res) => {
    const id = req.params.id;

    if(!id || parseInt(id) <= 0){
        res.status(400);
        res.send({
            message: "L'id du pret est obligatoire et doit être supérieur à 0"
        });
        return;
    }

    try {
        const affectedRows = await pretsModel.deletePret(id);

        if (affectedRows === 0) {
            return res.status(404).json({
                erreur: `Le pret id ${id} n'existe pas dans la base de données`
            });
        }

        res.status(200).json({
            message: `Le pret id ${id} a été supprimé avec succès`
        });

    } catch (erreur) {
        res.status(500).json({
            erreur: `Echec lors de la suppression du pret`
        });
    }
};

export default {
    ajouterPret,
    modifierPret,
    modifierStatusPret,
    supprimerPret
}