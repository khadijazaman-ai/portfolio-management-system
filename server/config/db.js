const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, 'db.json');

let db = null;

const saveDbToFile = () => {
  if (!db) return;
  try {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving mock database to file:', err);
  }
};

// Robust query matching helper
const matchesQuery = (item, query) => {
  if (!query) return true;
  for (const key of Object.keys(query)) {
    if (key === '$or') {
      const conditions = query[key];
      if (Array.isArray(conditions)) {
        const matchesOr = conditions.some(cond => matchesQuery(item, cond));
        if (!matchesOr) return false;
      }
      continue;
    }
    const val = query[key];
    const itemVal = item[key];
    
    if (val && typeof val === 'object' && !(val instanceof Date)) {
      if ('$ne' in val) {
        const neVal = val.$ne;
        if (itemVal && neVal && itemVal.toString() === neVal.toString()) return false;
        if (itemVal === neVal) return false;
      }
      if ('$regex' in val) {
        let pattern = val.$regex;
        let flags = val.$options || 'i';
        if (pattern instanceof RegExp) {
          if (!pattern.test(itemVal || '')) return false;
        } else {
          const regex = new RegExp(pattern, flags);
          if (Array.isArray(itemVal)) {
            if (!itemVal.some(v => regex.test(v))) return false;
          } else {
            if (!regex.test(itemVal || '')) return false;
          }
        }
      }
    } else {
      // Direct comparison
      if (val === undefined) continue;
      if (itemVal === undefined) return false;
      if (itemVal !== null && val !== null && (itemVal.toString() === val.toString())) {
        continue;
      }
      if (itemVal !== val) return false;
    }
  }
  return true;
};

const setupMockDBSystem = () => {
  if (fs.existsSync(dbPath)) {
    try {
      db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      console.log('Loaded mock database from local db.json successfully.');
    } catch (err) {
      console.error('Error parsing local db.json, seeding defaults.');
    }
  }

  if (!db) {
    db = {
      users: [],
      skills: [],
      projects: [],
      categories: [],
      activities: []
    };

    // Seed a public CV profile for Khadija Zaman (visible via public portfolio endpoint)
    const seededUserId = 'khadija_00001';
    db.users.push({
      _id: seededUserId,
      name: 'Khadija Zaman',
      email: 'khadijazaman.ai@gmail.com',
      password: '$2a$10$0fDb6CDtA4QnNxb.aOnGvuNfzCP4pBnDcHkhlqT1B5xrpirG56Kkq', // Khadija@123 hashed
      about: `Motivated Computer Science student with hands-on experience in front-end development and Python programming gained through industry internships. Actively developing full-stack web development skills and exploring AI/ML fundamentals. Committed to writing clean, functional code and delivering practical solutions.`,
      role: 'Front-End Developer & Full-Stack Engineer',
      tagline: 'Designing and building next-generation web applications with clean architecture',
      profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
      education: 'Bachelor of Science in Computer Science, COMSATS University (2023 - 2027)',
      careerGoals: 'To leverage my development skills to build robust, scalable SaaS solutions and integrate AI/ML algorithms to solve real-world problems.',
      interests: 'Full Stack Development, AI/ML, Open Source Contribution, UI/UX Design',
      location: 'Yarhussain, Swabi, KPK',
      phone: '0346-5586036',
      linkedin: 'https://linkedin.com/in/khadija-zaman',
      github: 'https://github.com/khadijazaman-ai',
      website: 'https://khadijazaman.dev',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Seed example categories
    db.categories.push({ _id: 'cat_1', user: seededUserId, name: 'Web Development', slug: 'web-development', createdAt: new Date(), updatedAt: new Date() });
    db.categories.push({ _id: 'cat_2', user: seededUserId, name: 'Mobile Development', slug: 'mobile-development', createdAt: new Date(), updatedAt: new Date() });
    db.categories.push({ _id: 'cat_3', user: seededUserId, name: 'AI/ML', slug: 'ai-ml', createdAt: new Date(), updatedAt: new Date() });
    db.categories.push({ _id: 'cat_4', user: seededUserId, name: 'Other', slug: 'other', createdAt: new Date(), updatedAt: new Date() });

    // Seed example activities
    db.activities.push({ _id: 'act_1', user: seededUserId, action: 'System Initialized', details: 'Local database seeded successfully.', createdAt: new Date() });

    // Seed example skills
    db.skills.push({ _id: 'skill_1', user: seededUserId, name: 'React.js', category: 'Frontend', level: 'Advanced', proficiency: 90, createdAt: new Date(), updatedAt: new Date() });
    db.skills.push({ _id: 'skill_2', user: seededUserId, name: 'HTML5 / CSS3', category: 'Frontend', level: 'Advanced', proficiency: 95, createdAt: new Date(), updatedAt: new Date() });
    db.skills.push({ _id: 'skill_3', user: seededUserId, name: 'JavaScript', category: 'Frontend', level: 'Advanced', proficiency: 88, createdAt: new Date(), updatedAt: new Date() });
    db.skills.push({ _id: 'skill_4', user: seededUserId, name: 'Node.js & Express', category: 'Backend', level: 'Intermediate', proficiency: 75, createdAt: new Date(), updatedAt: new Date() });
    db.skills.push({ _id: 'skill_5', user: seededUserId, name: 'Python', category: 'AI/ML', level: 'Intermediate', proficiency: 80, createdAt: new Date(), updatedAt: new Date() });
    db.skills.push({ _id: 'skill_6', user: seededUserId, name: 'MongoDB', category: 'Database', level: 'Intermediate', proficiency: 70, createdAt: new Date(), updatedAt: new Date() });
    db.skills.push({ _id: 'skill_7', user: seededUserId, name: 'Docker', category: 'DevOps', level: 'Beginner', proficiency: 45, createdAt: new Date(), updatedAt: new Date() });
    db.skills.push({ _id: 'skill_8', user: seededUserId, name: 'Git & GitHub', category: 'Tools', level: 'Advanced', proficiency: 90, createdAt: new Date(), updatedAt: new Date() });

    // Seed example projects
    db.projects.push({
      _id: 'proj_1',
      user: seededUserId,
      title: 'Personal Portfolio Website',
      description: 'A premium, responsive full-stack portfolio built with React, Node.js, and MongoDB featuring an admin dashboard, stats analytics, and dark/light modes.',
      technologies: ['React.js', 'Node.js', 'MongoDB', 'Tailwind CSS'],
      category: 'Web Development',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600',
      githubLink: 'https://github.com/khadijazaman-ai/portfolio-management-system',
      githubUrl: 'https://github.com/khadijazaman-ai/portfolio-management-system',
      liveLink: 'https://khadijazaman.dev',
      liveUrl: 'https://khadijazaman.dev',
      status: 'Completed',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    db.projects.push({
      _id: 'proj_2',
      user: seededUserId,
      title: 'Student Record Management System',
      description: 'Console-based C++ application using object-oriented programming (OOP) principles and file stream handling for secure student academic records storage.',
      technologies: ['C++', 'File Systems', 'OOP'],
      category: 'Other',
      imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600',
      githubLink: 'https://github.com/khadijazaman-ai/student-records',
      githubUrl: 'https://github.com/khadijazaman-ai/student-records',
      liveLink: '',
      liveUrl: '',
      status: 'Completed',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    db.projects.push({
      _id: 'proj_3',
      user: seededUserId,
      title: 'Mobile Attendance App',
      description: 'Flutter-based mobile app for classroom attendance management with automatic CSV export and barcode scanning capabilities.',
      technologies: ['Flutter', 'Dart', 'Firebase'],
      category: 'Mobile Development',
      imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=600',
      githubLink: 'https://github.com/khadijazaman-ai/attendance-app',
      githubUrl: 'https://github.com/khadijazaman-ai/attendance-app',
      liveLink: '',
      liveUrl: '',
      status: 'In Progress',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    db.projects.push({
      _id: 'proj_4',
      user: seededUserId,
      title: 'Visual Sentiment Classifier',
      description: 'A PyTorch-based neural network model for image-based sentiment prediction, trained on subset ImageNet dataset.',
      technologies: ['Python', 'PyTorch', 'CNN'],
      category: 'AI/ML',
      imageUrl: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?auto=format&fit=crop&q=80&w=600',
      githubLink: 'https://github.com/khadijazaman-ai/sentiment-classifier',
      githubUrl: 'https://github.com/khadijazaman-ai/sentiment-classifier',
      liveLink: '',
      liveUrl: '',
      status: 'Planned',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    saveDbToFile();
  }

  const generateId = () => Math.random().toString(36).substring(2, 11) + Math.random().toString(36).substring(2, 11);

  const cleanQuery = (query) => {
    if (typeof query === 'string') return { _id: query };
    return query || {};
  };

  class MockQuery {
    constructor(executeFn) {
      this.executeFn = executeFn;
      this._selectFields = [];
      this._sortObj = null;
      this._limitNum = null;
    }
    select(fields) { this._selectFields.push(fields); return this; }
    sort(sortObj) { this._sortObj = sortObj; return this; }
    limit(limitNum) { this._limitNum = limitNum; return this; }
    async then(resolve, reject) {
      try {
        let res = await this.executeFn(this._selectFields);
        if (this._sortObj && Array.isArray(res)) {
          const sortKey = Object.keys(this._sortObj)[0];
          const sortOrder = this._sortObj[sortKey];
          res.sort((a, b) => {
            let valA = a[sortKey];
            let valB = b[sortKey];
            
            if (valA && (valA instanceof Date || (typeof valA === 'string' && !isNaN(Date.parse(valA))))) {
              valA = new Date(valA).getTime();
            }
            if (valB && (valB instanceof Date || (typeof valB === 'string' && !isNaN(Date.parse(valB))))) {
              valB = new Date(valB).getTime();
            }
            
            if (typeof valA === 'string') valA = valA.toLowerCase();
            if (typeof valB === 'string') valB = valB.toLowerCase();
            
            if (valA < valB) return sortOrder === -1 ? 1 : -1;
            if (valA > valB) return sortOrder === -1 ? -1 : 1;
            return 0;
          });
        }
        if (this._limitNum !== null && Array.isArray(res)) {
          res = res.slice(0, this._limitNum);
        }
        return resolve(res);
      } catch (err) {
        return reject(err);
      }
    }
  }

  class MockModel {
    constructor(data, collectionName) {
      if (db) {
        db[collectionName] = db[collectionName] || [];
      }
      this._data = { ...(data || {}) };
      this._collectionName = collectionName;
      if (!this._data._id) this._data._id = generateId();
    }
    get _id() { return this._data._id; }
    toJSON() { return this._data; }
    async save() {
      this._data.updatedAt = new Date();
      this._data.createdAt = this._data.createdAt || new Date();
      if (db) {
        db[this._collectionName] = db[this._collectionName] || [];
      }
      const collection = db[this._collectionName];
      const idx = collection.findIndex(item => item._id.toString() === this._id.toString());
      if (idx !== -1) collection[idx] = this._data; else collection.push(this._data);
      saveDbToFile();
      return this;
    }
  }

  const createMockModelClass = (modelName, collectionName) => {
    const Class = class extends MockModel {
      constructor(data) {
        if (db) {
          db[collectionName] = db[collectionName] || [];
        }
        super(data, collectionName);
        if (data) {
          Object.keys(data).forEach(key => {
            if (!(key in this)) {
              Object.defineProperty(this, key, {
                get() { return this._data[key]; },
                set(val) { this._data[key] = val; },
                configurable: true,
                enumerable: true
              });
            }
          });
        }
      }

      static find(query) {
        if (db) db[collectionName] = db[collectionName] || [];
        return new MockQuery(async (selectFields) => {
          const results = db[collectionName];
          const filtered = results.filter(item => matchesQuery(item, cleanQuery(query)));
          return filtered.map(item => new Class({ ...item }));
        });
      }

      static findOne(query) {
        if (db) db[collectionName] = db[collectionName] || [];
        return new MockQuery(async (selectFields) => {
          const results = db[collectionName];
          const result = results.find(item => matchesQuery(item, cleanQuery(query)));
          if (!result) return null;
          const data = { ...result };
          selectFields.forEach(sel => { if (sel.includes('-password')) delete data.password; });
          return new Class(data);
        });
      }

      static findById(id) {
        if (db) db[collectionName] = db[collectionName] || [];
        return new MockQuery(async (selectFields) => {
          if (!id) return null;
          const result = db[collectionName].find(item => item._id.toString() === id.toString());
          if (!result) return null;
          const data = { ...result };
          selectFields.forEach(sel => {
            if (sel.includes('-password')) delete data.password;
            if (sel.includes('-email')) delete data.email;
            if (sel.includes('-phone')) delete data.phone;
          });
          return new Class(data);
        });
      }

      static findByIdAndUpdate(id, update, options) {
        if (db) db[collectionName] = db[collectionName] || [];
        return new MockQuery(async (selectFields) => {
          if (!id) return null;
          const resultIdx = db[collectionName].findIndex(item => item._id.toString() === id.toString());
          if (resultIdx === -1) return null;
          const current = db[collectionName][resultIdx];
          let updates = update.$set || update;
          const updated = { ...current, ...updates, updatedAt: new Date() };
          db[collectionName][resultIdx] = updated;
          saveDbToFile();
          const data = { ...updated };
          selectFields.forEach(sel => { if (sel.includes('-password')) delete data.password; });
          return new Class(data);
        });
      }

      static findByIdAndDelete(id) {
        if (db) db[collectionName] = db[collectionName] || [];
        return new MockQuery(async (selectFields) => {
          if (!id) return null;
          const resultIdx = db[collectionName].findIndex(item => item._id.toString() === id.toString());
          if (resultIdx === -1) return null;
          const deleted = db[collectionName].splice(resultIdx, 1)[0];
          saveDbToFile();
          return new Class(deleted);
        });
      }

      static updateMany(query, update) {
        if (db) db[collectionName] = db[collectionName] || [];
        return new MockQuery(async () => {
          let collection = db[collectionName];
          let updates = update.$set || update;
          let count = 0;
          collection.forEach((item, idx) => {
            if (matchesQuery(item, cleanQuery(query))) {
              collection[idx] = { ...item, ...updates, updatedAt: new Date() };
              count++;
            }
          });
          if (count > 0) {
            saveDbToFile();
          }
          return { nModified: count };
        });
      }

      static countDocuments(query) {
        if (db) db[collectionName] = db[collectionName] || [];
        return new MockQuery(async () => {
          const results = db[collectionName];
          const filtered = results.filter(item => matchesQuery(item, cleanQuery(query)));
          return filtered.length;
        });
      }
    };
    return Class;
  };

  const mockModels = {
    User: createMockModelClass('User', 'users'),
    Skill: createMockModelClass('Skill', 'skills'),
    Project: createMockModelClass('Project', 'projects'),
    Category: createMockModelClass('Category', 'categories'),
    Activity: createMockModelClass('Activity', 'activities'),
    Notification: createMockModelClass('Notification', 'notifications')
  };

  mongoose.connect = async () => {
    console.log('MOCK MongoDB Connected (In-Memory Mock Database Enabled)');
    return { connection: { host: 'mock-in-memory-db' } };
  };

  mongoose.model = (name, schema) => {
    if (mockModels[name]) return mockModels[name];
    const collectionName = name.toLowerCase() + 's';
    db[collectionName] = db[collectionName] || [];
    mockModels[name] = createMockModelClass(name, collectionName);
    return mockModels[name];
  };
};

const connectDB = async () => {
  const useLocalDB = process.env.USE_LOCAL_DB !== 'false';
  
  if (useLocalDB) {
    console.log('Using Local Persistent JSON Database (db.json) for speed and offline development.');
    setupMockDBSystem();
    return;
  }

  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portfolio';
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 1500 });
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    return;
  } catch (err) {
    console.warn('MongoDB connection error:', err.message || err);
    console.warn('Falling back to local persistent mock database.');
    setupMockDBSystem();
  }
};

module.exports = connectDB;
