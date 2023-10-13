const express = require ('express');
const app = express();
const port = 3000;

const { getJoyas, HATEOAS, getJoyasFiltros } = require("./consultas")

app.use((req,res,next)=>{
    const parametros = req.params
    const url = req.url
    console.log(
        `
        Hoy ${new Date()}
        Se ha recibido una consulta en la ruta ${url}
        con los parametros: `, 
        parametros
    );
    return next();
});

app.get('/joyas/:id', async(req,res) => {
    try {
        const query = req.query;
        const joyas = await getJoyas(query);
        const hateoas = HATEOAS(joyas);
        res.json(hateoas);

    } catch (error) {
        res.status(500).json(error.message);
    }
});

app.get("/joyas/filtros", async(req,res) => {
try {
    const query = req.query;
    const joyas = await getJoyasFiltros(query);
    res.json(joyas);

} catch (error) {
    res.status(500).json(error.message);
}
})

app.listen(port, console.log(`server UP en puerto: ${port}`));