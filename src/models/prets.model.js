import pool from '../config/db_pg.js';

const createPret = async (requeteAjouterPret) => {
    const {emprunteur, date_debut, date_retour, en_cours} = requeteAjouterPret;
    
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

export default {
    createPret
};