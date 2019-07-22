const express=require('express');
const app=express();
const bodyparser=require('body-parser');
const path=require('path')
const methodOverride=require('method-override')

const mongoose=require('mongoose');
mongoose.connect("mongodb://localhost/blogSite_db",
{ useNewUrlParser: true });
const blog=require('./models/blogs')
const Comment=require('./models/comment')

app.set("view engine","ejs");
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'))

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

//blogs route
app.get('/blogs/new',(req,res)=>{
    res.render('newPost')
})
app.post('/blogs/addPost',(req,res)=>{
    var title=req.body.title;
    var body=req.body.body;
    var datetime=new Date();

    blog.create({
        title:title,
        Date:datetime.toISOString().slice(0,10),
        body:body
    },(err,data)=>{
        if(err){
            console.log(err)
        }else{
             res.redirect("/blogs")
        }
    })
})
//show route 
app.get('/blogs/:id',(req,res)=>{
    blog.findById(req.params.id).populate('comments').exec((err,findBlog)=>{
        if(err){
            res.redirect('blogs')
        }else{
            res.render('show',{blog:findBlog})
        }
    })
})

//edit route
app.get('/blogs/:id/edit',(req,res)=>{
     blog.findById(req.params.id,(err,foundBlog)=>{
         if(err){
             res.redirect('/');
         }else{
             res.render('edit',{blog:foundBlog})
         }
     })
})

//update route
app.put('/blogs/:id',(req,res)=>{
    
})

//Comment Route
app.get('/blogs/:id/comments/new',(req,res)=>{
    blog.findById(req.params.id,(err,data)=>{
        if(err){
            console.log(err)
        }else{
            res.render('newComment',{blogs:data});
        }
    })
    
})

app.post('/blogs/:id/comments',(req,res)=>{
    // console.log(req.body.params)
    blog.findById(req.params.id,(err,blogData)=>{
        if(err){
            console.log(err)
            res.redirect('/')
        }else{
            Comment.create({
                comment:req.body.comment,
                author:req.body.author
            },(err,data)=>{
                if(err){
                    console.log(err)
                }else{
                    blogData.comments.push(data);
                    blogData.save();
                    res.redirect('/blogs/'+blogData._id);
                }
            })
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