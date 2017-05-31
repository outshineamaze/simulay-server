/**
 * @author 作者: laynezhou
 * @copyright laynezhou@tencent.com
 * @version 版本 2017/5/10
 */
var mongoose = require('mongoose');
mongoose.connect('mongodb://172.17.0.3:27017/simulay');
var crypto = require('crypto');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Users = new Schema({
    uid: ObjectId,
    nickname     : String,
    email:      String,
    phonenum      : String,
    create_date: Date
});

var Code  = new Schema({
    id: Schema.ObjectId,
    hash: String,
    name: String,
    cmd: String,
    stdin: String,
    stdout: String,
    content: String,
    date: { type: Date, default: Date.now },
    exec_time: Number,
    images: [String],
    result_id:Number,
    analysis_id: Number,
    setting_id: Number
});

var Result = new Schema({
    id: Schema.ObjectId,
    date: { type: Date, default: Date.now },
    code_id: Number,
    code_hash: String,
    stdout: String,
    images: [String]
});

const  insertUser = (data) => {
    let users = mongoose.model('Users', Users);
    var user = new users(data);
    user.save();
    return user.uid;

};

const  getUserInfo = (data, res) =>  {
        let users = mongoose.model('Users', Users);
        console.log(data)
        users.findOne(data, function (err, user) {
            if (err) {
                //console.log(err)
                return err;
            }
            console.log(user)
            res.json(user)
            return user;
        })
    };
const  updateUser = (data) => {
    let users = mongoose.model('Users', Users);
    users.update({_id: id}, data, function(error) {
       console.log(error)
    });
};



const addCode = (data, res) => {
    let code  = mongoose.model('Code', Code);
    // const secret = data.name || '';
    // const hash = crypto.createHmac('md5', secret)
    //     .update(data.content)
    //     .digest('hex');
    // console.log(hash);
    // data.hash = hash;
    code.update({hash: data.hash}, data, function(error,result) {
        if (result.n <= 0) {
            code.create(data, function(err, result) {
                res.json(result);
                return (result);
            });
        } else {
            res.json(result);
            return result;
        }
    });
}

const  getCode = (data, res) =>  {
    let code = mongoose.model('Code', Code);
    console.log(data)
    code.findOne(data, function (err, codeData) {
        if (err) {
            return err;
        }
        res.json(codeData)
        return codeData;
    })
};
const  getCodeList = (data, res) =>  {
    let code = mongoose.model('Code', Code);
    console.log(data)
    function cb(err, codeData) {
        if (err) {
            console.log(err)
            return err;
        }
        console.log(codeData)
        res.json(codeData)
        return codeData;
    }
    code.find(data).limit(10).sort('-date').
    exec(cb);
};
const  updateCode = (data) => {
    const code  = mongoose.model('Code', Code);
    code.update({hash: data.hash}, data, function(error,result) {
        if (result.n <= 0) {
            code.create(data, function(err, result) {
                return (result);
            });
        } else {
            console.log('success update');
            console.log(data.images);
            return result;
        }
    });
};

const getResult = (hash, res) => {
    const code  = mongoose.model('Code', Code);
    code.findOne({hash: hash}, function (err, result) {
        if (result) {
            res.json({
                stdout: result.stdout,
                images: result.images,
                stderr: result.stderr
            });
        }
    })
}

module.exports = {
    interface: {
        getUserInfo,
        insertUser,
        updateUser,
        addCode,
        getCode,
        getCodeList,
        updateCode,
        getResult
    }
}