import mongoose from 'mongoose'; // Import mongoose

const userSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required:true,
            trim:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            match:[/^\S+@\S+\.\S+$/, "Please use a valid email"],
        },
        password:{
            type:String,
            required:true,
            minlength:[6,"Password length must be greater than equal to 6"],
        },
        bio:{
            type:String,
            default: "",
        },
        skills:{
            type:[String],
            default:[],
        },
        learningGoals:{
            type:[String],
            default:[],
        },
        availability:{
            type:String,
            enum:["weekdays","weekends","both"],
            default:"both",
        },
        profileComplete:{
            type:Boolean,
            default:false,
        },
    },
    { timestamps: true}
)

const User = mongoose.model('User',userSchema);
export default User;