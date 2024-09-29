import mysql from 'mysql2';

const createConnection = () => {
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Default XAMPP MySQL username
    password: '', 
    database: 'clinic_portal', // Your database name
  });

  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL as id ' + connection.threadId);
  });

  return connection;
};

export { createConnection };
