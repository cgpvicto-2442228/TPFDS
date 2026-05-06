import pool from '../config/db_pg.js';

const getListeLivre = async () => {
    const requete = `SELECT id, bibliotheque_id, titre, auteur, isbn, description, date_ajout, disponible FROM livres`;

    try {
        const resultat = await pool.query(requete);
        return resultat.rows || null;
    } catch (erreur) {
        console.log(`Erreur PostgreSQL : ${erreur.code} : ${erreur.message}`);
        throw erreur;
    }
};

const getLivre = async (id) => {
    const requete = `SELECT id, bibliotheque_id, titre, auteur, isbn, description, date_ajout, disponible FROM livres WHERE id = $1 LIMIT 1`;
    const params = [id];

    try {
        const resultat = await pool.query(requete, params);
        return resultat.rows[0] || null;
    } catch (erreur) {
        console.log(`Erreur PostgreSQL : ${erreur.code} : ${erreur.message}`);
        throw erreur;
    }
};

const createLivre = async (bibliothequeId, requeteAjouterLivre) => {
    const {titre, auteur, isbn, description, date_ajout, disponible} = requeteAjouterLivre;
    
    const requete = `INSERT INTO livres (bibliotheque_id, titre, auteur, isbn, description, date_ajout, disponible) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`;
    const params = [bibliothequeId, titre, auteur, isbn, description || null, date_ajout || null, disponible];

    try {
        const resultat = await pool.query(requete, params);
        return resultat.rows[0].id;
    } catch (erreur) {
        console.log(`Erreur PostgreSQL : ${erreur.code} : ${erreur.message}`);
        throw erreur;
    }
};

const updateLivre = async (id, requeteModifierLivre) => {
    const {titre, auteur, isbn, description, date_ajout, disponible} = requeteModifierLivre;
    
    const requete = `UPDATE livres 
                 SET titre = $1, auteur = $2, isbn = $3, description = $4, date_ajout = $5, disponible = $6 
                 WHERE id = $7`;
    const params = [titre, auteur, isbn, description || null, date_ajout || null, disponible, id];

    try {
        const resultat = await pool.query(requete, params);
        return resultat.rowCount;
    } catch (erreur) {
        console.log(`Erreur PostgreSQL : ${erreur.code} : ${erreur.message}`);
        throw erreur;
    }
};

const updateStatusLivre = async (id, disponible) => {    
    const requete = `UPDATE livres 
                 SET disponible = $1
                 WHERE id = $2`;
    const params = [disponible, id];

    try {
        const resultat = await pool.query(requete, params);
        return resultat.rowCount;
    } catch (erreur) {
        console.log(`Erreur PostgreSQL : ${erreur.code} : ${erreur.message}`);
        throw erreur;
    }
};

const deleteLivre = async (id) => {    
    const requete = `DELETE FROM livres WHERE id = $1`;
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
    getListeLivre,
    getLivre,
    createLivre,
    updateLivre,
    updateStatusLivre,
    deleteLivre
};