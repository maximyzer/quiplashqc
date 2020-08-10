const {Client} = require('pg')
const express = require('express')
const app = express();
app.use(express.json())


// use the express-static middleware
app.use(express.static("public"))

// define the first route
app.get("/", function (req, res) {
  res.send(`
  <h1>test1</h1>
  <h2 id="currentQuestion"></h2>
  <script>
      getQuestions() ;
      async function getQuestions() {
          try {
              const currentQuestionH2 = document.getElementById("currentQuestion");
              const questions = await fetch('http://localhost:5000/questions', {method: "GET"}).then(a => a.json());
              currentQuestionH2.innerText = questions[0].question;   
          } catch(ex) {
              console.log("Error");
          }
      }
  </script>`)
})

// start the server listening for requests
app.listen(process.env.PORT || 3000, 
	() => console.log("Server is running..."));

app.get("/", (req, res) => res.sendFile(`https://quiplash.herokuapp.com/index.html`))
app.get("/questions", async (req,res) => {
  const rows = await execute()
  res.setHeader("content-type","application/json")
  res.send(JSON.stringify(rows))
})

app.post("/questions", async (req,res) => {

  let result = {}
  try {

    const reqJson = req.body;
    await executeInsert(reqJson)
    result.success = true

  } catch (e) {
    result.success = false
  } finally  {
    res.setHeader("content-type","application/json")
    res.send(JSON.stringify(result))
  }
})

//execute()

async function execute(){
  const client = new Client({
    user: "ipgwlraynqgttr",
    password: "51866008b0541d39311fd7e19fc21c817e8cc81e6c00f567964124fa3e6dea9d",
    host: "ec2-34-192-30-15.compute-1.amazonaws.com",
    port: 5432,
    database : "d1av61c6rqj9p2",
    ssl: {
        rejectUnauthorized: false
      }})
  try {
    await client.connect()
    console.log("Connected achieved")
    //await client.query("BEGIN") //Pour starter une transaction
    const results = await client.query("select * from questions") 
    console.table(results.rows)
    //await client.query("COMMIT") 
    return results.rows
  } catch(ex){
    console.log(`Ptite erreur mon gars : ${ex}`)
    await client.query("ROLLBACK") 
  } finally {
    await client.end()
    console.log("connection done")
  }
}

async function executeInsert(newQuestion){
  const client = new Client({
    user: "ipgwlraynqgttr",
    password: "51866008b0541d39311fd7e19fc21c817e8cc81e6c00f567964124fa3e6dea9d",
    host: "ec2-34-192-30-15.compute-1.amazonaws.com",
    port: 5432,
    database : "d1av61c6rqj9p2",
    ssl: {
        rejectUnauthorized: false
      }})

  try {
    await client.connect()
    console.log("Connected achieved")
    //await client.query("BEGIN") //Pour starter une transaction
    const results = await client.query("insert into questions values ($1,$2)",[newQuestion.id,newQuestion.question]) 
    console.table(results.rows)
    //await client.query("COMMIT") 
    return results.rows
  } catch(ex){
    console.log(`Ptite erreur mon gars : ${ex}`)
    await client.query("ROLLBACK") 
  } finally {
    await client.end()
    console.log("connection done")
  }
}
