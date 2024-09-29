import mysql from 'mysql2';

const createConnection = () => {
  const connection = mysql.createConnection({
    host: 'dpg-crsivcu8ii6s73edu6u0-a',
    user: 'clinic_portal_user', // Default XAMPP MySQL username
    port: '5432',
    password: 'OTsT9YaLHF1bz6jU8OKNltntIv5MzcPE', 
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
