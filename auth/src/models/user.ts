    import mongoose from 'mongoose';
    import { Password } from '../services/password';

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
    },
    {
        toJSON:{
            transform(doc,ret){
                ret.id = ret._id,
                delete ret._id,
                delete ret.__v,
                delete ret.password
            }
        }
    })

    userSchema.pre('save', async function(done){
        if(this.isModified('password')){
            const password = this.get('password');
            if (password) {
                const hashed = await Password.toHash(password);
                this.set('password', hashed);
            }
        }
        done();
    });

    userSchema.statics.build= (attr:UserAttr)=>{
        return new User(attr)
    }

    const User  = mongoose.model<UserDoc,UserModel>('User', userSchema);





    export { User }