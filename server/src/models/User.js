import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';


const userSchema = new mongoose.Schema({
    fullName:{type: String, required: true},
    email: {type : String, required: true, unique: true},
    password: {type : String, required: true, minlength:8},
    bio: {type: String, default: ""},
    profilePic: {type: String, deflault: ""},
    nativeLanguage: {type : String, default: ""},
    learningLanguage: {type : String, default: ""},
    location:{type : String, defalult: ""},
    isOnBoarded:{type : Boolean, default: false},
    friends: [{type: mongoose.Schema.Types.ObjectId, ref:'User'}],

},{timestamps: true});

const User =mongoose.models.User || mongoose.model("User", userSchema);

// to explain later
// userSchema.pre('save',async (next)=>{
//     //hash the password before saving the user model
//     if(!this.isModified('password')) return next();

//     try{
//       const salt = await bcrypt.genSalt(10);
//       this.password = await bcrypt.hash(this.password, salt);
//       next();
//     }catch(err){
//       return next(err);
//     }
// })
export default User;


