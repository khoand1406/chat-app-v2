import express from 'express';
import './database/config.ts'
const app= express();
const PORT= 3000;
app.use(express.json());

app.listen(PORT, ()=> {
    console.log(`Server is listening at: http://localhost:${PORT}`);
})