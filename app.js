const express=require('express');
const app=express();
const bodyparser=require('body-parser');
const mongoose=require('mongoose');
mongoose.connect("mongodb://localhost/blogSite_db");
const blog=require('./models/blogs')

app.set("view engine","ejs");
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"))



// blog.create({
//     title:"date",
//     image:"--------------",
//     body:"date property get updated by shivam kumar!"
// },(err,data)=>{
//     if(err){
//         console.log(error)
//     }else{
//         console.log("blog added succesfully")
//         console.log(data)
//     }
// })

app.get('/',(req,res)=>{
    res.redirect('/blogs')
})
app.get('/blogs',(req,res)=>{
    blog.find({},(err,data)=>{
        if(err){
            console.log(err)
        }else{
            res.render("index",{blogs:data})
        }
    })
   
})
app.get('/blogs/new',(req,res)=>{
    res.render('newPost')
})
app.post('/blogs/addPost',(req,res)=>{
    var title=req.body.title;
    var img=req.body.img;
    var body=req.body.body;

    blog.create({
        title:title,
        img:img,
        body:body
    },(err,data)=>{
        if(err){
            console.log(err)
        }else{
             res.redirect("/blogs")
        }
    })
})

app.get('/blogs/:id',(req,res)=>{
    blog.findById(req.params.id,(err,findBlog)=>{
        if(err){
            res.redirect('blogs')
        }else{
            res.render('show',{blog:findBlog})
        }
    })
})

app.listen(4000,(err)=>{
    if(err){
        console.log(err)
    }else{
        console.log(`blog site is started at
        http://localhost:4000`)
    }
})