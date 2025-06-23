import express from 'express';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = './data.json';

app.use(express.json());

// Helper function untuk baca & tulis data
function readData() {
  const data = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(data);
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// ✅ Tampilkan seluruh isi data.json saat mengakses "/"
app.get('/', (req, res) => {
  try {
    const data = readData();
    res.json(data);
  } catch (err) {
    res.status(500).send('Internal Server Error');
  }
});

// GET semua users
app.get('/users', (req, res) => {
  try {
    const data = readData();
    res.json(data);
  } catch (err) {
    res.status(500).send('Internal Server Error');
  }
});

// GET user berdasarkan ID
app.get('/users/:id', (req, res) => {
  try {
    const data = readData();
    const user = data.find(u => u._id === req.params.id);
    if (!user) return res.status(404).send('User not found');
    res.json(user);
  } catch (err) {
    res.status(500).send('Internal Server Error');
  }
});

// POST buat user baru
app.post('/users', (req, res) => {
  try {
    const data = readData();
    const newUser = {
      _id: uuidv4(),
      ...req.body
    };
    data.push(newUser);
    writeData(data);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).send('Internal Server Error');
  }
});

// PUT update user by ID
app.put('/users/:id', (req, res) => {
  try {
    const data = readData();
    const index = data.findIndex(u => u._id === req.params.id);
    if (index === -1) return res.status(404).send('User not found');

    data[index] = { ...data[index], ...req.body };
    writeData(data);
    res.json(data[index]);
  } catch (err) {
    res.status(500).send('Internal Server Error');
  }
});

// DELETE hapus user by ID
app.delete('/users/:id', (req, res) => {
  try {
    let data = readData();
    const index = data.findIndex(u => u._id === req.params.id);
    if (index === -1) return res.status(404).send('User not found');

    const deletedUser = data.splice(index, 1);
    writeData(data);
    res.json({ message: 'User deleted', user: deletedUser[0] });
  } catch (err) {
    res.status(500).send('Internal Server Error');
  }
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});