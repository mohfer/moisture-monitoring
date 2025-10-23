require('dotenv').config();
const { connectDB } = require('./src/config/db');
const app = require('./src/app');

connectDB();

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`✅ Server running at http://localhost:${port}`);
});
