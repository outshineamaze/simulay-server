/**
 * @author 作者: laynezhou
 * @copyright laynezhou@tencent.com
 * @version 版本 2017/5/10
 */
var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/simulay');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Users = new Schema({
    uid: ObjectId,
    nickname     : String,
    email:      String,
    phonenum      : Date
});

var Code  = new Schema({
    run_id: Schema.ObjectId,
    name: String,
    cmd: String,
    stdin: String,
    stdout: String,
    content: String,
    date: { type: Date, default: Date.now },
    exec_time: Number,
    result_id:Number,
    analysis_id: Number,
    setting_id: Number
});

const  insertUser = (data) => {
    let Users = mongoose.model('Users', Users);
    var user = new Users({name: 'laynerzhou', emial: 'outhineamaze@live.com'});
    user.save();
    return user.uid;

};

const  getUserInfo = (uid) =>  {
        let Users = mongoose.model('Users', Users);
        Users.findOne({ 'uid': uid }, function (err, user) {
            if (err) return err;
            return user;
        })
    };

const  updateUser = (data) => {
    let Users = mongoose.model('Users', Users);
    Users.update({}, { 'name': 'Luke Skywalker' }, function(error) {
        // Error because parentSchema has `strict: throw`, even though
        // `childSchema` has `strict: false`
    });

};

module.exports = {
    interface: {
        getUserInfo,
        insertUser,
        updateUser
    }
}