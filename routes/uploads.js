/**
 * Created by Admin on 11/27/2015.
 */
var express = require('express');
var path    = require('path');
var multipart = require('connect-multiparty');
var fs = require('fs');
var admZip = require('adm-zip');
var app     = express();
var router = express.Router();
var multipartMiddleware = multipart();
var globlue = require('globule');
var flatten = require('../node_modules/adobe-edge-animate-image-flatten/index.js');
/* GET users listing. */
router.get('/', function(req, res, next) {
   // res.send('respond with a resource');
    res.sendFile(path.resolve(__dirname , '../views/upload.html'));
    //res.send("Upload File");
});
router.post('/uploadtmp', multipartMiddleware, function (req, res, next) {

    var file = req.files.file;
    //console.log(file);
    // T?n file
    var originalFilename = file.name;
     console.log(originalFilename);
    // File type
    var fileType = file.type.split('/')[1];

    // File size
    var fileSize = file.size;

    // ???ng d?n l?u ?nh
    console.log(__dirname);
    var pathUpload = path.resolve(__dirname, '../public/upload/' + originalFilename );

    // ??c n?i dung file tmp
    // n?u kh?ng c? l?i th? ghi file v?o ? c?ng
    fs.readFile(file.path, function (err, data) {
        if (!err) {
            fs.writeFile(pathUpload, data, function () {

                // Return anh vua upload
                //res.send('<img src="/pictures/' + originalFilename +'" />');

                //alert("Upload Sucessfull");
                return;
            });
        } else {
            res.send('Upload Failed');
        }
    });

    var zip = new admZip(file.path);
    var zipEntries = zip.getEntries();
    //console.log(zipEntries);

    zip.extractAllTo( path.resolve(__dirname, '../public/upload/' ));
    zipEntries.forEach(function(zipEntry){
        //console.log(zipEntry.toString().entryName === "") ;
    });
    var jsFile = globlue.find(path.resolve(__dirname, '../public/upload/publish/web/*.js' ));
    //console.log(jsFile);

    fs.createReadStream(path.resolve(jsFile[0]))

        //flatten task
        .pipe(flatten({imageDirectory: path.resolve(__dirname, '../public/upload/publish/web/images')}))

        .on('data', function (data) {

            //console.log("Tests:");

            //console.log('Image directory should be the base64 image string: ' + (data.indexOf("var im='data:image/svg+xml;base64,';") !== -1 ? "pass" : "fail"));

            // console.log('There should be no .svg strings: ' + (data.indexOf(".svg") === -1 ? "pass" : "fail"));
            //console.log(data);
            fs.writeFileSync(path.resolve(jsFile[0]), data);
            console.log("Finish");
        })

        .on('end', function () {

            console.log("Done");

        });
   // res.send('Upload  ' + file.name +'  Sucessfull');
    //res.sendFile(path.resolve(__dirname , '../views/download.html'));
    res.redirect('/downloads');

})
//app.use('/uploads', router);
module.exports = router;
