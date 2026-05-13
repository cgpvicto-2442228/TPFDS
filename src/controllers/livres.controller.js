import livresModel from "../models/livres.model.js";
import bibliothequesModel from '../models/bibliotheques.model.js';

const listeLivre = async (req, res) => {
    const afficherTous = req.query.afficher_tous;

    if (afficherTous !== undefined && afficherTous !== "0" && afficherTous !== "1") {
        res.status(400).send({
            erreur: "Le champ afficher_tous doit être soit 0 ou 1"
        });
        return;
    }

    try {
        let livre
        if (afficherTous === "1") {
            livre = await livresModel.getListeLivre();
        } else {
            livre = await livresModel.getListeLivreDisponible();
        }
        res.send(livre);
    } catch (erreur) {
        console.log('Erreur : ', erreur);
        res.status(500)
        res.send({
            erreur: "Echec lors de la récupération de la liste des livres"
        });
    };
};

const trouverLivre = async (req, res) => {
    const id = req.params.id;

    if(!id || parseInt(id) <= 0){
        res.status(400);
        res.send({
            erreur: "L'id du livre est obligatoire et doit être supérieur à 0"
        });
        return;
    }

    try {
        const livre = await livresModel.getLivre(id);
        let prets = await livresModel.getPretLivre(id);
        if (prets === undefined || prets.length === 0) {
            prets = "Aucun prêts associé à ce livre pour le moment.";
        }
        res.send({
            livre: livre,
            prets: prets
        });

        
    } catch (erreur) {
        console.log('Erreur : ', erreur);
        res.status(500)
        res.send({
            erreur: "Erreur lors de la récupération du livre avec l'id " + req.params.id
        });
    };
};

const ajouterLivre = async (req, res) => {
    const cleApi = req.headers.authorization.split(' ')[1];
    const isbnRegex = /^(978|979)-\d{1}-\d{4}-\d{4}-\d{1}$/;
    const dateRegex = /^\d{4}-[0-1]\d-[0-4]\d$/;
    const champsObligatoires = ["titre", "auteur"];
    let erreur = ``;

    champsObligatoires.forEach(champ => {
        if (req.body[champ] === undefined || req.body[champ] === "") {
            erreur += `Le champ ${champ} est vide.\n`
        }
    });

    if (req.body.disponible === undefined || req.body.disponible !== true && req.body.disponible !== false) {
        erreur += `Le champ disponible doit être "true" ou "false".\n`
    }

    if (req.body.isbn === undefined || !req.body.isbn.match(isbnRegex)) {
        erreur += `Le champ isbn doit être au format 978|979-X-XXXX-XXXX-X où X est un chiffre.\n`
    }

    if (req.body.date_ajout !== undefined && !req.body.date_ajout.match(dateRegex)) {
        erreur += `Le champ date_ajout doit être au format aaaa-mm-jj.\n`
    }

    if (erreur.length > 0) {
        return res.status(400).json({
            erreur: erreur,
        });
    }

    try {
        const bibliothequeId = await bibliothequesModel.findIdParCleApi(cleApi);
        const livreId = await livresModel.createLivre(bibliothequeId, req.body);

        // Réponse 201 Succès
        res.status(201).json({
            message: `Le livre ${req.body.titre} a été ajouté avec succès`,
            livre: {
                id: livreId,
                ...req.body // étale les données reçues pour reconstruire le livre
            }
        });

    } catch (erreur) {
        res.status(500).json({
            erreur: `Echec lors de la création du livre ${req.body.titre || 'inconnu'}`
        });
    }
};

const modifierLivre = async (req, res) => {
    const id = req.params.id;
    const isbnRegex = /^(978|979)-\d{1}-\d{4}-\d{4}-\d{1}$/;
    const dateRegex = /^\d{4}-[0-1]\d-[0-4]\d$/;
    const champsObligatoires = ["titre", "auteur"];
    let erreur = ``;

    champsObligatoires.forEach(champ => {
        if (req.body[champ] === undefined || req.body[champ] === "") {
            erreur += `Le champ ${champ} est vide.\n`
        }
    });

    if (req.body.disponible === undefined || req.body.disponible !== true && req.body.disponible !== false) {
        erreur += `Le champ disponible doit être "true" ou "false".\n`
    }

    if (req.body.isbn === undefined || !req.body.isbn.match(isbnRegex)) {
        erreur += `Le champ isbn doit être au format 978|979-X-XXXX-XXXX-X où X est un chiffre.\n`
    }

    if (req.body.date_ajout !== undefined && !req.body.date_ajout.match(dateRegex)) {
        erreur += `Le champ date_ajout doit être au format aaaa-mm-jj.\n`
    }

    if (erreur.length > 0) {
        return res.status(400).json({
            erreur: erreur,
        });
    }

    try {
        const affectedRows = await livresModel.updateLivre(id, req.body);

        if (affectedRows === 0) {
            return res.status(404).json({
                erreur: `Le livre id ${id} n'existe pas dans la base de données`
            });
        }

        res.status(200).json({
            message: `Le livre id ${id} a été modifié avec succès`
        });

    } catch (erreur) {
        res.status(500).json({
            erreur: `Echec lors de la modification du livre ${req.body.titre || 'inconnu'}`
        });
    }
};

const modifierStatusLivre = async (req, res) => {
    const id = req.params.id;
    const disponible = req.body.disponible;

    if(!id || parseInt(id) <= 0){
        res.status(400);
        res.send({
            erreur: "L'id du livre est obligatoire et doit être supérieur à 0"
        });
        return;
    }

    if (disponible === undefined || disponible !== true && disponible !== false) {
        return res.status(400).json({
            erreur: `Le champ disponible doit être "true" ou "false".`,
        });
    }

    try {
        const affectedRows = await livresModel.updateStatusLivre(id, disponible);

        if (affectedRows === 0) {
            return res.status(404).json({
                erreur: `Le livre id ${id} n'existe pas dans la base de données`
            });
        }

        // Succès 200
        res.status(200).json({
            message: `Le status du livre id ${id} a été modifié avec succès`
        });

    } catch (erreur) {
        res.status(500).json({
            erreur: `Echec lors de la modification du status du livre id ${id}`
        });
    }
};

const supprimerLivre = async (req, res) => {
    const id = req.params.id;

    if(!id || parseInt(id) <= 0){
        res.status(400);
        res.send({
            erreur: "L'id du livre est obligatoire et doit être supérieur à 0"
        });
        return;
    }

    try {
        const affectedRows = await livresModel.deleteLivre(id);

        if (affectedRows === 0) {
            return res.status(404).json({
                erreur: `Le livre id ${id} n'existe pas dans la base de données`
            });
        }

        res.status(200).json({
            message: `Le livre id ${id} a été supprimé avec succès`
        });

    } catch (erreur) {
        res.status(500).json({
            erreur: `Echec lors de la suppression du livre`
        });
    }
};

export default {
    listeLivre,
    trouverLivre,
    ajouterLivre,
    modifierLivre,
    modifierStatusLivre,
    supprimerLivre
}