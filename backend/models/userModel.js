const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');



const userSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        pic: { type: String, required: true, default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" },
    },
    {
        timeStamps: true
    }
)




//check whether entered password and original password same or not
userSchema.methods.matchPasswords = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}


//Before saving the password, hash the password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

})


const User = mongoose.model("User", userSchema);
module.exports = User;