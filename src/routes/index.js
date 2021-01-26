const Express = require('express');
const router = Express.Router();

const passport = require('passport');
const path = require('path');
const fileUpload = require('express-fileupload');
router.use(fileUpload());


var fs = require('fs');


var fileName; 
var bufferBytes = {};

let imgPath = path.join(__dirname, '../');
imgPath = path.join(imgPath, '../');


router.get('/',(req,res,next)=>{
    console.log(imgPath);
    res.render('index');
});

router.get('/signup',isNOTAuthenticated,(req,res,next)=>{
    res.render('signup')
});

router.post('/signup',isNOTAuthenticated,passport.authenticate('local-signup',{
    successRedirect:'/profile',
    failureRedirect:'/signup',
    passReqToCallback:true
}));

router.get('/signin',isNOTAuthenticated,(req,res,next)=>{
    res.render('signin');
});

router.post('/signin',isNOTAuthenticated,passport.authenticate('local-signin',{
    successRedirect:'/profile',
    failureRedirect:'/signin',
    passReqToCallback:true
}));

router.get('/logout',isAuthenticated,(req,res,next)=>{
    req.logout();
    res.redirect('/');
});

router.get('/profile', isAuthenticated,(req,res,next)=>{
    //console.log(pruebita);
    res.render('profile');
});

router.get('/upload_file',isAuthenticated,(req,res,next)=>{
    /*let a = prueba.encryptFunc('Holiwis');
    console.log(a);
    let b = prueba.decryptFunc(a);
    console.log(b);*/
    res.render('cypher');
});

router.post('/upload_file',isAuthenticated, async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            let avatar = req.files.fileToUpload;
            
            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            let timeStamp = Date.now()+ avatar.name
            avatar.mv('./uploads/' +timeStamp);

            let resobj = {
                status: true,
                message: 'File is uploaded',
                data: {
                    name: timeStamp,
                    mimetype: avatar.mimetype,
                    size: avatar.size
                }
            }

            fileName = resobj.data.name;
            //send response
            res.send(resobj);
        }
    } catch (err) {
        res.status(500).send(err);
    }
});


router.get('/gallery',(req,res)=>{
    let images = getImagesFromDir(path.join(imgPath, 'uploads'));
    res.render('galler', {images:images});
    //res.send('entra');

});

function getImagesFromDir(dirPath){
    let allImages = []
    let files = fs.readdirSync(dirPath)

    for(let fil of files){
        let fileLocation = path.join(dirPath, fil)
        var stat = fs.statSync(fileLocation)

        if(stat && stat.isDirectory()){
            getImagesFromDir(fileLocation)
        }
        else if(stat && stat.isFile() && ['.jpg', '.png'].indexOf(path.extname(fileLocation)) != 1){
            allImages.push('../../uploads/'+fil)
        }
    }
    return allImages
}



//middleware
function isAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/signin');
}

function isNOTAuthenticated(req,res,next){
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}



module.exports = router;