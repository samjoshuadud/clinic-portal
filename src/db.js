import mysql from 'mysql2';

const createConnection = () => {
  const connection = mysql.createConnection({
    host: 'sql12.freesqldatabase.com',
    user: 'sql12734324',
    password: 'RR7zfNYTLK', 
    database: 'sql12734324', // Your database name
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
