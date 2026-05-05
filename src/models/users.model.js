import pool from '../config/db_pg.js';

const createUser = async (nom, courriel, passwordHash, cleApi) => {
    const requete = `INSERT INTO bibliotheque (nom, courriel, cle_api, password) VALUES ($1, $2, $3, $4) RETURNING id`;
    const params = [nom, courriel, cleApi, passwordHash];
    const resultat = await pool.query(requete, params);
    return resultat.rows[0].id;
};

const findByEmail = async (courriel) => {
    const lignes = await pool.query("SELECT * FROM bibliotheque WHERE courriel = $1", [courriel]);
    return lignes.rows[0];
};

const findByApiKey = async (cleApi) => {
    const lignes = await pool.query("SELECT * FROM bibliotheque WHERE cle_api = $1", [cleApi]); 
    return lignes.rows[0];
};

const updateApiKey = async (userId, newApiKey) => {
    await pool.query("UPDATE bibliotheque SET cle_api = $1 WHERE id = $2", [newApiKey, userId]);
};

export default { 
    createUser, 
    findByEmail, 
    findByApiKey, 
    updateApiKey 
};