import { pool } from "../db/db";

const Company = {
  async create(company) {
    const { name, email, password } = company;
    const [rows] = await pool.execute(
      "INSERT INTO companies (name, email, password) values(?, ?, ?)",
      [name, email, password]
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
