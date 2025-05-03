import { pool } from "../db/db.js";

const User = {
  async findAll() {
    const [rows] = await pool.execute("SELECT * FROM users");
    return rows;
  },
  async findById(id) {
    const [rows] = await pool.execute(
      `
      SELECT * 
      FROM users as user
      JOIN address ON address.user_id = user.id 
      WHERE user.id = ?`,
      [id]
    );
    return rows[0];
  },

  async getUserDataOnly(id) {
    const [rows] = await pool.execute("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0];
  },

  async findByEmail(email) {
    const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return rows[0];
  },

  async create(user) {
    const { first_name, last_name, email, password } = user;
    const picture = "/images/emp.png";

    const [rows] = await pool.execute(
      "INSERT INTO users (first_name, last_name, email, password, picture) values(?, ?, ?, ?, ?)",
      [first_name, last_name, email, password, picture]
    );
    return rows;
  },

  async findByIdAndUpdate(id, user) {
    const { first_name, last_name, email, birth_date, phone, bio } = user;
    const [rows] = await pool.execute(
      "UPDATE users SET first_name = ?, last_name = ?, email = ?, birth_date = ?, phone = ?, bio = ? WHERE id = ?",
      [first_name, last_name, email, birth_date, phone, bio, id]
    );

    const [rows2] = await pool.execute(
      "UPDATE address SET country = ?, region = ?, zone = ?, city = ? WHERE user_id = ?",
      [user.country, user.region, user.zone, user.city, id]
    )
    return {...rows, ...rows2};
  },
  async update(user) {},

  async delete(user) {},
};

// skills method
const Skill = {
  async findAll(userId) {
    const [rows] = await pool.execute(
      "SELECT * FROM skills WHERE user_id = ?",
      [userId]
    );
    return rows;
  },

  async create(skill) {
    const { name, user_id } = skill;
    const [rows] = await pool.execute(
      "INSERT INTO skills (name, user_id) values(?, ?)",
      [name, user_id]
    );
    return rows;
  },

  async update(skill) {},

  async delete(skill) {},
};

const Experience = {
  async findAll(userId) {
    const [rows] = await pool.execute(
      "SELECT * FROM experiences WHERE user_id = ?",
      [userId]
    );
    return rows;
  },

  async create(experience) {
    const { title, company, location, type, start_date, end_date, description, user_id } = experience;
    const [rows] = await pool.execute(
      "INSERT INTO experiences (title, company, location, type, start_date, end_date, description, user_id) values(?, ?, ?, ?, ?, ?, ?, ?)",
      [title, company, location, type, start_date, end_date, description, user_id]
    );
    return rows;
  },

  async update(experience) {},

  async delete(id) {
    try {
      const [rows] = await pool.execute(
        "DELETE FROM experiences WHERE id = ?",
        [id]
      );
      if (rows.affectedRows === 0) {
        return { error: "Experience not found" };
      }
      return { message: "Experience deleted successfully" };
    } catch (error) {
      console.log(error);
      return { error: error.message };
    }
  },
};

const Education = {
  async findAll(userId) {
    const [rows] = await pool.execute(
      "SELECT * FROM educations WHERE user_id = ?",
      [userId]
    );
    return rows;
  },

  async create(education) {
    // columns 
    // id	institution	degree field_of_study	location	start_year	end_year	grade	description	user_id	

    const { institution, degree, field_of_study, location, start_year, end_year, grade, description, user_id } = education;
    const [rows] = await pool.execute(
      "INSERT INTO educations (institution, degree, field_of_study, location, start_year, end_year, grade, description, user_id) values(?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [institution, degree, field_of_study, location, start_year, end_year, grade, description, user_id]
    );
    return rows;
  },

  async update(education) {},

  async delete(education) {},
};

const Resume = {
  async findAll(userId) {
    const [rows] = await pool.execute(
      "SELECT * FROM resumes WHERE user_id = ?",
      [userId]
    );
    return rows;
  },

  async create(resume) {
    const { title, description, user_id } = resume;
    const [rows] = await pool.execute(
      "INSERT INTO resumes (title, description, user_id) values(?, ?, ?)",
      [title, description, user_id]
    );
    return rows;
  },

  async update(resume) {},

  async delete(resume) {},
};

export { User, Skill, Experience, Education, Resume };
