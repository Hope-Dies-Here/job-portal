import { pool } from "../db/db.js";

const Application = {
    async create(body) {
        const { job_id, user_id, resume } = body;
        const [rows] = await pool.execute(`
                INSERT INTO applications (job_id, user_id, resume) VALUES (?,?,?)
        `, [job_id, user_id, resume])

        return rows;
    },
    async findExistingApplication(user, job) {
        const [rows] = await pool.execute(`SELECT * FROM applications WHERE user_id = ? AND job_id = ?`, [user, job])
        return rows;
    },

    async findByUserId(userId) {
        const [rows] = await pool.execute(`SELECT * FROM applications WHERE user_id = ?`, [userId]);
        return rows;
    },

    async findAll(userId) {
        const [rows] = await pool.execute(`SELECT applications.*, jobs.*, companies.* FROM applications JOIN jobs ON applications.job_id = jobs.id JOIN companies ON jobs.company = companies.id WHERE applications.user_id = ?`, [userId]);
        return rows;
    }
}

export { Application }