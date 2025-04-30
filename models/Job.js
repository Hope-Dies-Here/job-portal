import { pool } from "../db/db";

const Job = {
  async findAll() {
    const [rows] = await pool.execute("SELECT * FROM jobs");
    return rows;
  },
  async findById(id) {
    const [rows] = await pool.execute("SELECT * FROM jobs WHERE id = ?", [id]);
    return rows[0];
  },
  async create(job) {
    const { title, description, categories, company } = job;
    const [rows] = await pool.execute("", [
      title,
      description,
      categories,
      company,
    ]);
    return rows;
  },
};

const query = `CREATE TABLE IF NOT EXISTS jobs (
    id INT PRIMARY KEY,
    title VARCHAR(255),
    company VARCHAR(255),
    logo VARCHAR(255),
    location VARCHAR(255),
    duty_station VARCHAR(255),
    type VARCHAR(100),
    posted_date DATE,
    posted_time VARCHAR(100),
    deadline DATE,
    description TEXT,
    categories JSON,
    responsibilities JSON,
    requirements JSON,
    featured BOOLEAN,
    premium BOOLEAN,
    easy_apply BOOLEAN
  );`;

await pool.execute(query);
