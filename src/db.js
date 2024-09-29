import mysql from 'mysql2';

const createConnection = () => {
  const connection = mysql.createConnection({
    host: 'sql308.infinityfree.com',
    user: 'if0_37410039', // Default XAMPP MySQL username
    port: '5432',
    password: 'jSdnW8afXnebJ', 
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
