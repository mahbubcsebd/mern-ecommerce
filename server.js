const connectToDatabase = require('./api/config/db');
const app = require('./app');
const { port } = require('./secrete');


// Listening Server
app.listen(port, async () => {
    console.log(`server is listening at http://localhost:${port}`);
    await connectToDatabase({
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});