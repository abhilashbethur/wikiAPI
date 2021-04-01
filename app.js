const express = require("express")
const bodyparser = require("body-parser")
const ejs  =require("ejs")
const mongoose = require("mongoose")
const { stringify } = require("qs")


const app = express()
app.set("view engine", 'ejs')

app.use(bodyparser.urlencoded({extended:true}))
app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true})

const articleSchema = {
    title:String,
    content:String
}

const Article = mongoose.model("Article",articleSchema)

app.route("/articles")
.get(function(req,res){
    Article.find({},function(err,results){
        if(!err){
           res.send(results);
        }
        else console.log(err);
    })
})
.post(function(req,res){
    const post = new Article({
        title:req.body.title,
        content:req.body.content
    })
    post.save(function(err){
        if(err){
            console.log(err);
        }
        else res.send("success");
    })
})
.delete(function(req,res){
    Article.deleteMany(function(err){
        if(err){
            console.log("error");
        }
        else res.send("successfully deleted");
    })
})

app.route("/articles/:id").get(function(req,res){
    Article.findOne({title:req.params.id},function(err,resu){
            if(resu){
                res.send(resu);
            }else res.send("no articles matching")
        
    })
})
.put(function(req,res){
    Article.update({title:req.params.id},
        {title:req.body.title, content:req.body.content},
        {overwrite:true},
        function(err,results){
            if(!err){
                res.send("successfully updated article")
            }
        }
        )
})
.patch(function(req,res){
    Article.update({title:req.params.id},
        {$set: req.body},
        function(err){
            if(!err){
                res.send("successfully patched")
            }
            else res.send(err)
        }
        )
})
.delete(function(req,res){
    Article.deleteOne({title:req.params.id},function(err){
        if(!err) res.send("successfully deleted")
        else res.send(err)
    })
})


app.listen(3000,function(){
    console.log("server running on port 3000");
})