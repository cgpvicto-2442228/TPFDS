import pool from '../config/db_pg.js';

const createPret = async (requeteAjouterPret) => {
    const {livre_id, emprunteur, date_debut, date_retour, en_cours} = requeteAjouterPret;
    
    const requete = `INSERT INTO prets (livre_id, emprunteur, date_debut, date_retour, en_cours) 
                 VALUES ($1, $2, $3, $4, $5) RETURNING id`;
    const params = [livre_id, emprunteur, date_debut, date_retour, en_cours];

    try {
        const resultat = await pool.query(requete, params);
        return resultat.rows[0].id;
    } catch (erreur) {
        console.log(`Erreur PostgreSQL : ${erreur.code} : ${erreur.message}`);
        throw erreur;
    }
};

const updatePret = async (id, requeteModifierPret) => {
    const {emprunteur, date_debut, date_retour, en_cours} = requeteModifierPret;
    
    const requete = `UPDATE prets 
                 SET emprunteur = $1, date_debut = $2, date_retour = $3, en_cours = $4
                 WHERE id = $5`;
    const params = [emprunteur, date_debut, date_retour, en_cours, id];

    try {
        const resultat = await pool.query(requete, params);
        return resultat.rowCount;
    } catch (erreur) {
        console.log(`Erreur PostgreSQL : ${erreur.code} : ${erreur.message}`);
        throw erreur;
    }
};

const updateStatusPret = async (id, enCours) => {    
    const requete = `UPDATE prets 
                 SET en_cours = $1
                 WHERE id = $2`;
    const params = [enCours, id];

    try {
        const resultat = await pool.query(requete, params);
        return resultat.rowCount;
    } catch (erreur) {
        console.log(`Erreur PostgreSQL : ${erreur.code} : ${erreur.message}`);
        throw erreur;
    }
};

const deletePret = async (id) => {    
    const requete = `DELETE FROM prets WHERE id = $1`;
    const params = [id];

    try {
        const resultat = await pool.query(requete, params);
        return resultat.rowCount;
    } catch (erreur) {
        console.log(`Erreur PostgreSQL : ${erreur.code} : ${erreur.message}`);
        throw erreur;
    }
};

export default {
    createPret,
    updatePret,
    updateStatusPret,
    deletePret
};