import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, unique: true, required: true},
  password: {type: String, required: true },
  favourites: [{type: mongoose.Schema.Types.ObjectId,
              ref: 'Movie'  }]
});

UserSchema.statics.findByUserName = function(username) {
  return this.findOne({ username: username});
};

export default mongoose.model('User', UserSchema);
