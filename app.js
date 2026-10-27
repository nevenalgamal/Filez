import express from "express";
import  db from "#db/client";
const app = express();
export default app;

app.use(express.json());


// Get files
app.get("/files", async(req, res)=> {
    const sql = `
    SELECT  files.*,
    folders.name AS folder_name
    FROM files
    JOIN folders ON files.folder_id = folders.id;    
    `;
  const result = await db.query(sql)
  const files = result.rows;
  res.send(files);
});

// Get folders
app.get("/folders", async(req, res)=> {
   const sql = `
   SELECT  * FROM  folders
   `;
   const result = await db.query(sql)
    res.send(result.rows); 
});

//Get folders/id 

app.get("/folders/:id", async(req, res)=> {
    const sql = `
    SELECT folders.*,
    json_agg(files) AS files
    FROM folders
    LEFT JOIN  files ON  files.folder_id = folders.id
    WHERE  folders.id = $1
    GROUP BY folders.id 
    `;

  const { id } = req.params;
  const result = await db.query(sql, [id])
  const folder = result.rows[0];
 
  if(!folder) {
    res.status(404).send("Folder does not exist")
    return;
  }
  res.send(folder)
});

// Post folder 

app.post("/folders/:id/files", async(req, res) => {
    const sql = `
     SELECT * FROM folders 
      WHERE folders.id = $1 
    `;
    const { id } = req.params;
    const result = await db.query(sql, [id])
    const folder = result.rows[0]
    if (!folder){
       return res.status(404).send("Folder does not exist.")
    }
    if (!req.body){
        return res.status(400).send("Body is not provided.")
    }
    if (req.body.name == null || req.body.size == null ){
        return res.status(400).send(" Missing  arequired fields")
    }
    const fileSql =`
    INSERT INTO files (name, size, folder_id)
    VALUES ($1,$2, $3)
    RETURNING *
    `;
    const fileResult = await db.query(fileSql, [req.body.name, req.body.size, id ])
    const  newFile = fileResult.rows[0]
    res.status(201).send(newFile)
})






app.use( (err,  req, res , next)=>{
    console.error(err);
    res.status(500).send("Something went wrong");
})