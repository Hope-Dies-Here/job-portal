import { pool } from "../db/db.js";

const Job = {
  async findAll() {
    const [rows] = await pool.execute(`
      SELECT 
        jobs.*, companies.name AS company_name, companies.logo AS company_logo,
        GROUP_CONCAT(categories.name SEPARATOR ', ') AS categories
        FROM jobs
        LEFT JOIN job_categories ON jobs.id = job_categories.job_id
        LEFT JOIN categories ON job_categories.cat_id = categories.id
        LEFT JOIN companies ON jobs.company = companies.id
        
        GROUP BY jobs.id
    `);

    console.log("RPWS", rows)
    return rows;
  },
  async findById(id) {
    const [rows] = await pool.execute("SELECT jobs.*, companies.name as company_name, companies.logo as company_logo, companies.industry as company_industry, companies.location as company_location, companies.size as company_size, companies.description as company_description, companies.website as company_website, companies.email as company_email, companies.phone as company_phone FROM jobs JOIN companies ON jobs.company = companies.id WHERE jobs.id = ?", [id]);
    return rows[0];
  },

  async findSimilarJobs(jobId) {
    const [rows] = await pool.execute(
      `SELECT DISTINCT j.*
        FROM job_categories jc1
        JOIN job_categories jc2 ON jc1.cat_id = jc2.cat_id
        JOIN jobs j ON jc2.job_id = j.id
        WHERE jc1.job_id = ? AND jc2.job_id != ?`, [jobId, jobId]
    );
    
  return rows;
  },
  async create(job) {
      const { title, type, description, company, location, salary, responsibilities, end_date, posted_date } = job;

    const [rows] = await pool.execute(
      "INSERT INTO jobs (title, type, location, salary, description, responsibilities, posted_date, end_date, company) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [title, type, location, salary, description, responsibilities, posted_date, end_date, company]
    );
    
    return rows;
  },
};

const Category = {
  async findAll() {
    const [rows] = await pool.execute("SELECT * FROM categories");
    return rows;
  },
  async findById(id) {
    const [rows] = await pool.execute(
      "SELECT * FROM categories WHERE id = ?",
      [id]
    );
    return rows[0];
  }
}

const JobCategory = {
  async findAll() {
    const [rows] = await pool.execute("SELECT * FROM job_categories");
    return rows;
  },
  async findByJobId(id) {
    const [rows] = await pool.execute("SELECT * FROM job_categories WHERE job_id = ?", [
      id,
    ]);
    return rows[0];
  },

  async create(tag) {
    const { job_id, cat_id } = tag;
    const [rows] = await pool.execute(
      "INSERT INTO job_categories (job_id, cat_id) VALUES (?, ?)",
      [job_id, cat_id]
    );
    return rows;
  }
}

export { Job, Category, JobCategory };
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
