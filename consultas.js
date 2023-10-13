const {Pool} = require('pg');
const format = require('pg-format');

const obj = {
    host: 'localhost',
    user: 'postgres',
    password: 'postgres',
    database: 'joyas',
    allowExitOnIdle: true
};

const pool = new Pool(obj);
const getJoyas = async({
    limits = 10,
    order_by = "id_ASC",
    page = 1
    }) => {

        const [campo, direccion] = order_by.split("_");
        const offset = (page - 1) * limits;
        const queryFormateada = format(
            "SELECT * FROM inventario ORDER BY %s %s LIMIT %s OFFSET %s",
            campo,
            direccion,
            limits,
            offset
            );
        const { rows: joyas } = await pool.query(queryFormateada);
        return joyas;

};

const HATEOAS = (joyas) => {
    const result = joyas.map((joya) => {
        return{
            name: joya.nombre,
            href: `/joyas/joya/${joya.id}`,
        };
    });
    const totalJoyas = joyas.length
    const stockTotal = joyas.reduce((total,i)=> total + i.stock,0);
    const HATEOAS ={
        totalJoyas,
        stockTotal,
        result
    }
    return HATEOAS;
};

const getJoyasFiltros = async ({
    precio_max,
    precio_min,
    categoria,
    metal
    }) => {
const filtros = []
const values = []
const agregarFiltro = (campo, comparador, valor) => {
    values.push(valor);
    const { length } = filtros;
    filtros.push(`${campo} ${comparador} $${length + 1}`);
};

if(precio_max)agregarFiltro("precio", "=<", precio_max)
if(precio_min)agregarFiltro("precio",">=", precio_min)
if(categoria)agregarFiltro("categoria", "=", categoria)
if(metal)agregarFiltro("metal", "=", metal)

let consulta = "SELECT * FROM  inventario"
if(filtros.lenght > 0){
    const whereClouse = filtros.join("AND")
    consulta += `WHERE ${whereClause}`;
}
const {rows: joyas} = await pool.query(consulta, values)
return joyas; 
};

module.exports ={ getJoyas, HATEOAS, getJoyasFiltros };