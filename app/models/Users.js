const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const SALT_FACTOR = 10;

const Schema = mongoose.Schema;

// Defines User Schema
const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    bio: {
        type: String,
    },
    src: {
        type: String,
    },
    likes: {
        type: Number,
        default: 0
    },
    followers: {
        type: Number,
        default: 0
    },
    password: {
        type: String,
        required: true,
    },
    is_active: {
        type: Boolean,
        default: true
    }
}, { "collection": "users", "timestamps": true });

// If an user is updating a password, hash it before storing it
UserSchema.pre("save", function (next) {
    let user = this;

    if (!user.isModified("password")) return next();

    bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

mongoose.Types.ObjectId.prototype.valueOf = function () {
    return this.toString();
};

module.exports = mongoose.model("users", UserSchema);
