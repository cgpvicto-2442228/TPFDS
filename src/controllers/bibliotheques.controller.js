import bibliothequesModel from "../models/bibliotheques.model.js";

const listeLivre = async (req, res) => {
    try {
        const livre = await bibliothequesModel.getListeLivre();
        /*res.status(200).json({
            "pokemons": pokemon[0],
            "type": pokemon[1],
            "nombrePokemonTotal": pokemon[2],
            "page": pokemon[3],
            "totalPage": pokemon[4]
        });*/

        res.send(livre);

    } catch (erreur) {
        console.log('Erreur : ', erreur);
        res.status(500)
        res.send({
            message: "Echec lors de la récupération de la liste des livres"
        });
    };
};

const trouverLivre = async (req, res) => {
    if(!req.params.id || parseInt(req.params.id) <= 0){
        res.status(400);
        res.send({
            message: "L'id du livre est obligatoire et doit être supérieur à 0"
        });
        return;
    }

    try {
        const livre = await bibliothequesModel.getLivre(req.params.id);
        res.send(livre);
    } catch (erreur) {
        console.log('Erreur : ', erreur);
        res.status(500)
        res.send({
            message: "Erreur lors de la récupération du livre avec l'id " + req.params.id
        });
    };
};

const ajouterLivre = async (req, res) => {
    const champsObligatoires = ["titre", "auteur", "isbn", "disponible"];
    const champsManquants = [];

    // Vérification des champs présents dans le req.body
    champsObligatoires.forEach(champ => {
        if (req.body[champ] === undefined || req.body[champ] === "") {
            champsManquants.push(champ);
        }
    });

    if (champsManquants.length > 0) {
        return res.status(400).json({
            erreur: "Le format des données est invalide",
            champs_manquants: champsManquants
        });
    }

    try {
        const livreId = await bibliothequesModel.createLivre(req.body);

        // Réponse 201 Succès
        res.status(201).json({
            message: `Le livre ${req.body.titre} a été ajouté avec succès`,
            livre: {
                id: livreId,
                ...req.body // On "étale" les données reçues pour reconstruire l'objet
            }
        });

    } catch (erreur) {
        res.status(500).json({
            erreur: `Echec lors de la création du livre ${req.body.nom || 'inconnu'}`
        });
    }
};

const modifierPokemon = async (req, res) => {
    const id = req.params.id;
    const champsObligatoires = ["nom", "type_primaire", "pv", "attaque", "defense"];
    const champsManquants = [];

    // Validation 400 : Vérifier si le JSON contient tous les champs
    champsObligatoires.forEach(champ => {
        if (req.body[champ] === undefined || req.body[champ] === "") {
            champsManquants.push(champ);
        }
    });

    if (champsManquants.length > 0) {
        return res.status(400).json({
            erreur: "Le format des données est invalide",
            champs_manquants: champsManquants
        });
    }

    try {
        const affectedRows = await pokemonsModel.updatePokemon(id, req.body);

        // Validation 404 : Si aucune ligne n'a été mise à jour, l'ID n'existe pas
        if (affectedRows === 0) {
            return res.status(404).json({
                erreur: `Le pokemon id ${id} n'existe pas dans la base de données`
            });
        }

        // Succès 200
        res.status(200).json({
            message: `Le pokemon id ${id} a été modifié avec succès`
        });

    } catch (erreur) {
        res.status(500).json({
            erreur: `Echec lors de la modification du pokemon ${req.body.nom || 'inconnu'}`
        });
    }
};

const supprimerPokemon = async (req, res) => {
    const id = req.params.id;

    try {
        const affectedRows = await pokemonsModel.deletePokemon(id);

        // Validation 404 : Si aucune ligne n'a été mise à jour, l'ID n'existe pas
        if (affectedRows === 0) {
            return res.status(404).json({
                erreur: `Le pokemon id ${id} n'existe pas dans la base de données`
            });
        }

        // Succès 200
        res.status(200).json({
            message: `Le pokemon id ${id} a été supprimé avec succès`
        });

    } catch (erreur) {
        res.status(500).json({
            erreur: `Echec lors de la suppression du pokemon ${req.body.nom || 'inconnu'}`
        });
    }
};

export default {
    listeLivre,
    trouverLivre,
    ajouterLivre
}