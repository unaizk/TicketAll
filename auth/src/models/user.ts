import mongoose from 'mongoose';

//Interface describes the properties that are required to create user
interface UserAttr{
    email:string,
    password:string
}

//Interface describes the properties that requires that a User model has
interface UserModel extends mongoose.Model<UserDoc>{
    build(attr:UserAttr):UserDoc;
}

//Intrface describes the properties that a User document has

interface UserDoc extends mongoose.Document{
    email:string,
    password:string,
    
}

const userSchema = new mongoose.Schema({
    email :{
        type : String,
        required : true
    },
    password:{
        type: String,
        reqired : true
    }
})

userSchema.statics.build= (attr:UserAttr)=>{
    return new User(attr)
}

const User  = mongoose.model<UserDoc,UserModel>('User', userSchema);





export { User }