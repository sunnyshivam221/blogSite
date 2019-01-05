const mongoose =requiere('mongoose')

const commentSchema=new mongoose.Schema({
    author:String,
    comment:String
})

module.exports=mongoose.model("connect",commentSchema)