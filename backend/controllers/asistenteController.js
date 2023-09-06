const pool = require("../config/bd");
//const {MarcacionesModel} = require("../models/Marcaciones")



/////////////////////////////////         ITEM              /////////////////////////////////////////////
exports.obtenerMenuPrimero= async (req, res) => {      
  
  try {
    const consultaSql = "SELECT * FROM primero WHERE estado=1"; 
    const [rows] = await pool.promise().query(consultaSql);
  //console.log(rows);
  res.send(rows);
  } catch (err) {
	throw err;
  } 
}

