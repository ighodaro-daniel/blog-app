import express from "express";
import bodyParser from "body-parser";
import pg  from 'pg';


const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "worldDB",
  password: "daniel",
  port: 5432,
});
db.connect();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

async function allData(){
  const result = await db.query('SELECT * FROM todolist')
  items = result.rows
return items
}


let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async(req, res) => {

await allData()
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items
  });
});

app.post("/add",  async(req, res) => {
  const item = req.body.newItem
   await db.query('INSERT INTO todolist (title) VALUES($1)',[item])
  res.redirect('/')
});

app.post("/edit", async (req, res) => {
  const id = req.body.updatedItemId
  const item =req.body.updatedItemTitle
  await db.query('UPDATE todolist set title = $1 where id =$2',[item,id])
  res.redirect('/')
});

app.post("/delete", async(req, res) => {
  const id = req.body.deleteItemId
  await db.query('DELETE FROM todolist WHERE id = $1',[id])
  res.redirect('/')

});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
