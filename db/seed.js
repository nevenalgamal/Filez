import db from "#db/client";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  // TODO
  for (let i = 0; i < 3; i++) {
    const sql = `
   INSERT INTO folders (name)
   VALUES ($1)
   RETURNING *;
   `;
    const result = await db.query(sql, [`folder ${i}`]);
    const folder = result.rows[0];

    for (let j = 0; j < 5; j++) {
      const fileSql = `
      INSERT INTO files (name, size, folder_id)
       VALUES ($1, $2, $3);
       ;`;
      await db.query(fileSql, [`file ${j}`, 100, folder.id]);
    }
  }
}
