import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createConnection } from './db.js';
import { format } from 'date-fns'; // Import date-fns for formatting dates
import multer from 'multer'; // For handling image uploads

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, '../src/components/images')));

// Setup multer for image uploads
const storage = multer.diskStorage({
  destination: path.join(__dirname, '../src/components/images'),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// Serve static files from the Vite build directory
app.use(express.static(path.join(__dirname, 'dist'))); // Ensure this points correctly

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html')); // Ensure this points correctly
});

const connection = createConnection();

// Route to create a new patient (with an image)
app.post('/api/patients', upload.single('image'), (req, res) => {
  const {
    employee_number = '*', // Set default value to '*'
    first_name = '*',
    last_name = '*',
    birth_date = '*',
    gender = '*',
    email = '*',
    house_num = '*',
    street = '*',
    barangay = '*',
    city = '*',
    activeness = 'Active'
  } = req.body;

  // If an image is uploaded, set the image path; otherwise, set it to '*'
  const image = req.file ? req.file.filename : '*';

  const query = `
    INSERT INTO faculty_info (employee_number, first_name, last_name, 
                              birth_date, gender, email, 
                              house_num, street, barangay, city, activeness, image)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  connection.query(
    query,
    [employee_number, first_name, last_name, birth_date, gender, email, house_num, street, barangay, city, activeness, image],
    (error, results) => {
      if (error) {
        console.error('Error inserting new patient:', error.sqlMessage || error.message);
        res.status(500).json({ error: 'Error creating new patient. Please try again later.' });
        return;
      }
      console.log('New patient added successfully:', results);
      res.json({ message: 'New patient added successfully', patientId: results.insertId });
    }
  );
});
app.get('/api/patients', (req, res) => {
  const query = 'SELECT * FROM faculty_info';
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching patients:', error.sqlMessage || error.message);
      res.status(500).json({ error: 'Error fetching patients. Please try again later.' });
      return;
    }
    const patients = results.map(patient => ({
      ...patient,
      image: `/src/components/images/${patient.image}`, // Adjusted image path
    }));
    res.json(patients);
  });
});

// Route to get a specific patient by ID
app.get('/api/patients/:id', (req, res) => {
  const { id } = req.params;
  const query = `
  SELECT *, DATE_FORMAT(birth_date, '%Y-%m-%d') AS birth_date 
  FROM faculty_info 
  WHERE id = ?
`;
  connection.query(query, [id], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error fetching patient details. Please try again later.' });
      return;
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Patient not found.' });
    }
    const patient = {
      ...results[0],
      image: `/src/components/images/${results[0].image}`
    };
    res.json(patient);
  });
});

app.put('/api/patients/:id', (req, res) => {
  const { id } = req.params;
  console.log('Received update request for patient ID:', id);
  console.log('Request body:', req.body);

  const {
    employee_number,
    first_name,
    last_name,
    birth_date,
    gender,
    email,
    house_num,
    street,
    barangay,
    city,
    activeness,
    surgicalHistory,
    surgeryDetails,
    weight,
    height,
    diagnosis,
    allergies,
    medications
  } = req.body;

  const query = 
    'UPDATE faculty_info SET employee_number = ?, first_name = ?, last_name = ?, birth_date = ?, gender = ?, email = ?, house_num = ?, street = ?, barangay = ?, city = ?, activeness = ?, surgicalHistory = ?, surgeryDetails = ?, weight = ?, height = ?, diagnosis = ?, allergies = ?, medications = ? WHERE id = ?'
  ;

  connection.query(
    query,
    [employee_number, first_name, last_name, birth_date, gender, email, 
     house_num, street, barangay, city, activeness, surgicalHistory, surgeryDetails, weight, height, diagnosis, allergies, medications, id],
    (error, results) => {
      if (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Error updating patient. Please try again later.', details: error.message });
        return;
      }
      console.log('Query results:', results);
      if (results.affectedRows === 0) {
        console.log('No rows affected. Patient not found.');
        return res.status(404).json({ error: 'Patient not found.' });
      }
      console.log('Patient updated successfully');
      res.json({ message: 'Patient updated successfully' });
    }
  );
});

// Route to delete a patient by ID
app.delete('/api/patients/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM faculty_info WHERE id = ?';
  connection.query(query, [id], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error deleting patient. Please try again later.' });
      return;
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Patient not found.' });
    }
    res.json({ message: 'Patient deleted successfully' });
  });
});



app.get('/api/appointments', (req, res) => {
  connection.query('SELECT * FROM appointments', (err, results) => {
    if (err) {
      res.status(500).send({ error: 'Error fetching appointments', appointments: [] });
    } else {
      res.send({ appointments: results });
    }
  });
});

app.post('/api/appointments', (req, res) => {
  const { title, start, end } = req.body;
  connection.query('INSERT INTO appointments (title, start, end) VALUES (?, ?, ?)', [title, start, end], (err, results) => {
    if (err) {
      res.status(500).send({ message: 'Error creating appointment' });
    } else {
      res.send({ message: 'Appointment created successfully' });
    }
  });
});

app.delete('/api/appointments/:id', (req, res) => {
  const id = req.params.id;
  connection.query('DELETE FROM appointments WHERE id = ?', [id], (err, results) => {
    if (err) {
      res.status(500).send({ message: 'Error deleting appointment' });
    } else {
      res.send({ message: 'Appointment deleted successfully' });
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
