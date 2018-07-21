const keys = require('../secret/secretFile');
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

AWS.config.update({
    signatureVersion: 'v4',
    accessKeyId: keys.AWSKeys.AccessKeyId,
    secretAccessKey: keys.AWSKeys.SecretAccessKey,
    region: 'us-west-1'
});
const S3 = new AWS.S3({});
const upload = multer({
    storage: multerS3({
        S3: S3,
        bucket: 'webchatapp',
        acl: 'public-read',
        metadata: function(req, file, cb){
            cb(null,{fieldName: file.fieldName});
        },
        key: function(req, file, cb){
            cb(null, file.originalname);
        },
        rename: function(fieldName, fileName){
            return fileName.replace(/\W+/g, '-');
        }
    })
});
exports.Upload = upload;