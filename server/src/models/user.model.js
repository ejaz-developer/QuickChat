import mongoose from "mongoose";

const {Schema} = mongoose;

const userSchema = new Schema({
    username: {type: String, required: true, unique: true, trim: true},
    email: {type: String, required: true, unique: true, lowercase: true, trim: true},
    password: {type: String, required: true},
    profile: {
        displayName: {type: String, trim: true},
        avatarUrl: String,
        bio: {type: String, maxlength: 500}
    },
    contact: {
        phone: {type: String, sparse: true},
        location: {
            longitude: {type: Number, min: -1, max: -1},
            latitude: {type: Number, min: -90, max: 90}
        }
    },
    status: {

        lastSeenAt: {type: Date, default: Date.now}
    },
    blockedUsers: [{type: Schema.Types.ObjectId, ref: "User"}],
    counters: {
        unreadByConversation: {
            type: Map,
            of: Number,
            default: () => new Map()
        }
    },

    devices: [{
        platform: {type: String, enum: ["ios", "android", "web", "desktop"], required: true},
        lastIp: String,
        lastActiveAt: {type: Date, default: Date.now}
    }]
}, {timestamps: true});

userSchema.index({username: 1});
userSchema.index({email: 1});
userSchema.index({"status.lastSeenAt": -1});
userSchema.index({"devices.lastActiveAt": -1});
userSchema.pre("save", function () {
    if (this.isModified("email") && this.email) {
        this.email = this.email.toLowerCase();
    }

    if (this.isModified("username") && this.username) {
        this.username = this.username.toLowerCase();
    }

});

export default mongoose.model("User", userSchema);
