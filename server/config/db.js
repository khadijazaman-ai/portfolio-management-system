const mongoose = require('mongoose');

// Attempt real MongoDB connection, otherwise fall back to an in-memory mock.
const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portfolio';
  try {
    await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    return;
  } catch (err) {
    console.warn('MongoDB connection error:', err.message || err);
    console.warn('Falling back to in-memory mock database for development.');
  }

  // --- In-memory mock DB fallback ---
  const db = {
    users: [],
    skills: [],
    projects: []
  };

  // Seed a public CV profile for Khadija Zaman (visible via public portfolio endpoint)
  const seededUserId = 'khadija_00001';
  db.users.push({
    _id: seededUserId,
    name: 'Khadija Zaman',
    email: 'huzaifakhan35357@gmail.com',
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

  const generateId = () => Math.random().toString(36).substring(2, 11) + Math.random().toString(36).substring(2, 11);

  const cleanQuery = (query) => {
    if (typeof query === 'string') return { _id: query };
    return query || {};
  };

  class MockQuery {
    constructor(executeFn) {
      this.executeFn = executeFn;
      this._selectFields = [];
    }
    select(fields) { this._selectFields.push(fields); return this; }
    then(resolve, reject) { return this.executeFn(this._selectFields).then(resolve, reject); }
  }

  class MockModel {
    constructor(data, collectionName) {
      this._data = { ...(data || {}) };
      this._collectionName = collectionName;
      if (!this._data._id) this._data._id = generateId();
    }
    get _id() { return this._data._id; }
    toJSON() { return this._data; }
    async save() {
      this._data.updatedAt = new Date();
      this._data.createdAt = this._data.createdAt || new Date();
      const collection = db[this._collectionName];
      const idx = collection.findIndex(item => item._id.toString() === this._id.toString());
      if (idx !== -1) collection[idx] = this._data; else collection.push(this._data);
      return this;
    }
  }

  const createMockModelClass = (modelName, collectionName) => {
    const Class = class extends MockModel {
      constructor(data) { super(data, collectionName); if (data) Object.keys(data).forEach(key => {
        if (!(key in this)) {
          Object.defineProperty(this, key, {
            get() { return this._data[key]; },
            set(val) { this._data[key] = val; },
            configurable: true,
            enumerable: true
          });
        }
      }); }

      static find(query) {
        return new MockQuery(async (selectFields) => {
          let results = db[collectionName];
          if (!query) return results.map(item => new Class({ ...item }));
          
          results = results.filter(item => {
            // Check user
            if (query.user && item.user && item.user.toString() !== query.user.toString()) {
              return false;
            }
            // Check category
            if (query.category) {
              const itemCat = (item.category || '').toLowerCase();
              const qCat = query.category.toLowerCase();
              if (itemCat !== qCat && !itemCat.includes(qCat) && !qCat.includes(itemCat)) {
                return false;
              }
            }
            // Check status
            if (query.status && item.status !== query.status) {
              return false;
            }
            // Check $or (used for search)
            if (query.$or && Array.isArray(query.$or)) {
              const matchesOr = query.$or.some(condition => {
                return Object.keys(condition).some(key => {
                  const val = condition[key];
                  const itemVal = item[key];
                  if (val && typeof val === 'object' && val.$regex) {
                    const regex = new RegExp(val.$regex, val.$options || 'i');
                    if (Array.isArray(itemVal)) {
                      return itemVal.some(v => regex.test(v));
                    }
                    return regex.test(itemVal || '');
                  }
                  return itemVal === val;
                });
              });
              if (!matchesOr) return false;
            }
            return true;
          });
          
          return results.map(item => new Class({ ...item }));
        });
      }

      static findOne(query) {
        return new MockQuery(async (selectFields) => {
          const q = cleanQuery(query);
          let result;
          if (q.email) result = db[collectionName].find(item => item.email === q.email);
          else if (q._id) result = db[collectionName].find(item => item._id.toString() === q._id.toString());
          else result = db[collectionName][0];
          if (!result) return null;
          const data = { ...result };
          selectFields.forEach(sel => { if (sel.includes('-password')) delete data.password; });
          return new Class(data);
        });
      }

      static findById(id) {
        return new MockQuery(async (selectFields) => {
          if (!id) return null;
          const result = db[collectionName].find(item => item._id.toString() === id.toString());
          if (!result) return null;
          const data = { ...result };
          selectFields.forEach(sel => { if (sel.includes('-password')) delete data.password; if (sel.includes('-email')) delete data.email; if (sel.includes('-phone')) delete data.phone; });
          return new Class(data);
        });
      }

      static findByIdAndUpdate(id, update, options) {
        return new MockQuery(async (selectFields) => {
          if (!id) return null;
          const resultIdx = db[collectionName].findIndex(item => item._id.toString() === id.toString());
          if (resultIdx === -1) return null;
          const current = db[collectionName][resultIdx];
          let updates = update.$set || update;
          const updated = { ...current, ...updates, updatedAt: new Date() };
          db[collectionName][resultIdx] = updated;
          const data = { ...updated };
          selectFields.forEach(sel => { if (sel.includes('-password')) delete data.password; });
          return new Class(data);
        });
      }

      static findByIdAndDelete(id) {
        return new MockQuery(async (selectFields) => {
          if (!id) return null;
          const resultIdx = db[collectionName].findIndex(item => item._id.toString() === id.toString());
          if (resultIdx === -1) return null;
          const deleted = db[collectionName].splice(resultIdx, 1)[0];
          return new Class(deleted);
        });
      }
    };
    return Class;
  };

  const mockModels = {
    User: createMockModelClass('User', 'users'),
    Skill: createMockModelClass('Skill', 'skills'),
    Project: createMockModelClass('Project', 'projects')
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

module.exports = connectDB;
