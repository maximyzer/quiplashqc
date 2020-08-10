const {Client} = require('pg')
const client = new Client({
    user: "ipgwlraynqgttr",
    password: "51866008b0541d39311fd7e19fc21c817e8cc81e6c00f567964124fa3e6dea9d",
    host: "ec2-34-192-30-15.compute-1.amazonaws.com",
    port: 5432,
    database : "d1av61c6rqj9p2",
    ssl: {
        rejectUnauthorized: false
      }})

client.connect()
.then(() => console.log("Connection succesful"))
.then(() => client.query("select * from questions")) // $1,['params'] 
.then(results => console.table(results.rows))
.catch( e => console.log(e))
.finally(() => client.end())

