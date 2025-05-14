import { pool } from "../db/db.js";

const Company = {
  // COMPANY COLUMNS
  // 	id	name	email	password	website	phone	logo	industry	location	size	description	 
  async create(company) {
    const { name, email, website, phone = null, logo = null, industry = null, location = null, size = null, description = null } = company;
    const password = 1234
    const [rows] = await pool.execute(
      "INSERT INTO companies (name, email, password, website, phone, logo, industry, location, size, description) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [name, email, password, website, phone, logo, industry, location, size, description]
    );
    return rows;
  },

  async update(company) {},
  async findAll() {
    const [rows] = await pool.execute("SELECT * FROM companies");
    return rows;
  },
  async findById(id) {
    const [rows] = await pool.execute("SELECT * FROM companies WHERE id = ?", [
      id,
    ]);
    return rows[0];
  },
};

export default Company;