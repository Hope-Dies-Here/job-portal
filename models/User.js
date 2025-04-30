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
    const [rows] = await pool.execute(
      "INSERT INTO users (first_name, last_name, email, password) values(?, ?, ?, ?)",
      [first_name, last_name, email, password]
    );
    return rows;
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

const Experiance = {
  async findAll(userId) {
    const [rows] = await pool.execute(
      "SELECT * FROM experiences WHERE user_id = ?",
      [userId]
    );
    return rows;
  },

  async create(experience) {
    const { title, description, user_id } = experience;
    const [rows] = await pool.execute(
      "INSERT INTO experiences (title, description, user_id) values(?, ?, ?)",
      [title, description, user_id]
    );
    return rows;
  },

  async update(experience) {},

  async delete(experience) {},
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
    const { title, description, user_id } = education;
    const [rows] = await pool.execute(
      "INSERT INTO educations (title, description, user_id) values(?, ?, ?)",
      [title, description, user_id]
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

export default User;
