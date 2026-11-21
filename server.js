const express = require('express');
const cors = require('cors');
const { sequelize, User, Village, Volunteer } = require('./models');
const surveyRoutes = require('./routes/surveyRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/surveys', surveyRoutes);

app.post('/api/login', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const userByName = await User.findOne({ where: { username, role } });
    if (!userByName) {
      return res.status(401).json({ success: false, reason: 'Incorrect username.' });
    }
    if (userByName.password !== password) {
      return res.status(401).json({ success: false, reason: 'Incorrect password.' });
    }
    res.json({ success: true, user: userByName });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, reason: 'Server error' });
  }
});

const PORT = 5000;

sequelize.sync({ alter: true }).then(async () => {
  console.log('✅ Database tables successfully updated!');

  await User.findOrCreate({
    where: { username: 'Rishabh', role: 'Admin' },
    defaults: { password: 'password123' }
  });
  await User.findOrCreate({
    where: { username: 'officer_01', role: 'Officer' },
    defaults: { password: 'survey2026' }
  });

  if (Village && Volunteer) {
    await Village.findOrCreate({ where: { id: 1 }, defaults: { name: 'Default Village' } });
    await Volunteer.findOrCreate({ where: { id: 1 }, defaults: { name: 'Default Volunteer' } });
    console.log('✅ Dummy Village and Volunteer ensured.');
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('❌ Database Sync Error:', err);
});