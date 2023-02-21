const http = require ('http');
const express = require ('express');
const app = express();
app.use(express.json()); //middleware function
const sequelize= require('sequelize');
const {Sequelize,DataTypes}=require('sequelize');
const cors=require('cors');

const sequelizeConnection=new Sequelize('postgres://postgres:NalaBeans1513@localhost:5432/alyssafurman',{
    define: {
        timestamps:false,
        schema: 'communicationboard'

    }
});
//Text to Speech Table
const ttsTable= sequelizeConnection.define("ttsTable",{
    Text: {
        type: DataTypes.STRING,
        field:"Text"
    }});

//contactInfo table
const ContactInfo= sequelizeConnection.define("contactInfo",{
    name: {
        type: DataTypes.STRING,
        field:"contact_name"
    },
    email: {
        type: DataTypes.STRING,
        field:"contact_email"
    },
    phoneNumber:{
        type: DataTypes.STRING,
        field:"contact_phone"

    },
    message:{
        type: DataTypes.STRING,
        field:"contact_message"

    },
    contactMethod:{
    type: DataTypes.ENUM,  
    field:"contact_method",
    values: ['phone', 'email']
  },
    
    messageID:{
        type:DataTypes.INTEGER,
        field:"message_id",
        primaryKey :true,
        autoIncrement:true
    },
})
///CRUD: GET POST PUT DELETE , MIDDLEWARE
//middleware
app.use (cors());

//GET
app.get('/contact', (req,res)=>{
    ContactInfo.findAll().then(info=>{
        let listContacts=JSON.stringify(info);
        res.setHeader('Content-type','application/json')
        res.send(listContacts)
    })

})

//POST-contact
app.post('/contact', (req,res)=>{
    const contactData = req.body;
    ContactInfo.create({
        name: contactData.name,
        email: contactData.email,
        phoneNumber: contactData.phoneNumber,
        message: contactData.message,
        contactMethod: contactData.contactMethod,
        messageID: contactData.messageID
    })
    res.status(201).send("Contact Data Saved");
})

//Post-tts
//POST
app.post('/ttsTable', (req,res)=>{
    const textData = req.body;
    ttsTable.create({
        Text: textData.Text
    })
res.status(201).send("User Input Saved");
})


sequelizeConnection.authenticate().then(()=>{
    console.log("Database Connection Successful");
})
.catch((error)=>{
    console.log(error);
})
sequelizeConnection.sync().then (()=>{
    console.log("Tables created successfully!")
})
const server = http.createServer(app);
server.listen(3000,'127.0.0.1',()=>{ 
    console.log ('Server Started')
})


