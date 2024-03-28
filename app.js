const express=require("express");
const bodyParser=require("body-parser");
const https=require("https");
const app=express();
app.use(bodyParser.urlencoded({extended: true}));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html");
})
app.post("/",function(req,res){
    const query=req.body.word;
    const url="https://api.dictionaryapi.dev/api/v2/entries/en/"+query;
    https.get(url,function(response){
        console.log(response.statusCode);
        console.log(response)
        response.on("data",function(data){
          const dict = JSON.parse(data);
          const word=dict[0].word;
          const mean=dict[0].meanings[0].definitions[0].definition;
          const synonym=dict[0].meanings[0].synonyms;
          const pos=dict[0].meanings[0].partOfSpeech;
          const examples=dict[0].meanings[0].definitions[0].example;
          const audio=dict[0].phonetics[0].audio;
          const w=dict[0].phonetics[0].sourceUrl;
          const phonetic=dict[0].phonetic;
          console.log(audio)
          if(audio!==''){
            res.write("<audio controls><source src="+audio+"></audio>");
          }
          else{
            res.write("<audio controls><source src="+dict[0].phonetics[1].audio+"></audio>");
          }
         
          res.write("<h3>Word: "+word+"</h3>");
          if(typeof phonetic!=='undefined'){
            res.write("<p>Phonetic: "+phonetic+"</p>");
          }
          
          res.write("<p>Meaning: "+mean+"</p>");
          res.write("<p>Parts of Speech: "+pos+"</p>");
          if(typeof examples!=='undefined'){
            res.write("<p>Example: "+examples+"</p>");
          }

          res.write("<a href="+w+">More about..</a>");
          
          
          res.send();
        })   
     })
})


app.listen(3000,function(){
    console.log("Server is running on port 3000.");
 }) 