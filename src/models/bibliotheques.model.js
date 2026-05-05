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

const createLivre = async (requeteNouveauLivre) => {
    const {titre, auteur, isbn, description, date_ajout, disponible} = requeteNouveauLivre;
    
    const requete = `INSERT INTO livres (titre, auteur, isbn, description, date_ajout, disponible) 
                 VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`;
    const params = [titre, auteur, isbn, description || null, date_ajout || null, disponible];

    try {
        const resultat = await pool.query(requete, params);
        return resultat.rows[0].id;
    } catch (erreur) {
        console.log(`Erreur PostgreSQL : ${erreur.code} : ${erreur.message}`);
        throw erreur;
    }
};

const updatePokemon = async (id, requeteModifiePokemon) => {
    const {nom, type_primaire, type_secondaire, pv, attaque, defense} = requeteModifiePokemon;
    
    const requete = `UPDATE pokemon 
                 SET nom = $1, type_primaire = $2, type_secondaire = $3, pv = $4, attaque = $5, defense = $6 
                 WHERE id = $7`;
    const params = [nom, type_primaire, type_secondaire || null, pv, attaque, defense, id];

    try {
        const resultat = await pool.query(requete, params);
        // Retourne le nombre de ligne affectées.
        return resultat.rowCount;
    } catch (erreur) {
        console.log(`Erreur PostgreSQL : ${erreur.code} : ${erreur.message}`);
        throw erreur;
    }
};

const deletePokemon = async (id) => {    
    const requete = `DELETE FROM pokemon WHERE id = $1`;
    const params = [id];

    try {
        const resultat = await pool.query(requete, params);
        // Retourne le nombre de ligne affectées.
        return resultat.rowCount;
    } catch (erreur) {
        console.log(`Erreur PostgreSQL : ${erreur.code} : ${erreur.message}`);
        throw erreur;
    }
};

export default {
    getListeLivre,
    getLivre,
    createLivre
};