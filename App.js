/***************************************************************
  node.js express app file form server upload w/ Multer demo
  App created by:  Jesse Lewis
  Multer Config used based on tutorial by Ashish Mehra via Youtube
  @ https://www.youtube.com/watch?v=sMnqnvW81to&lc=z23htp54jwmhwni0nacdp43axbwhgu3y3fg0jwzwhatw03c010c
******************************************************************************************************/

  // RUN PACKAGES
  const express = require('express');
  const multer = require('multer');
  const bodyParser = require('body-parser');

  // SETUP APP
  const app = express();
  const port = process.env.PORT || 3000;
  app.use(bodyParser.urlencoded({extended:false}));
  app.use(bodyParser.json());
  app.use('/', express.static(__dirname + '/public'));



  //MULTER CONFIG: to get file photos to temp server storage
  const multerConfig = {

    //specify diskStorage (another option is memory)
    storage: multer.diskStorage({

      //specify destination
      destination: function(req, file, next){
        next(null, './public/photo-storage');
      },

      //specify the filename to be unique
      filename: function(req, file, next){
        console.log(file);
        //get the file mimetype ie 'image/jpeg' split and prefer the second value ie'jpeg'
        const ext = file.mimetype.split('/')[1];
        //set the file fieldname to a unique name containing the original name, current datetime and the extension.
        next(null, file.fieldname + '-' + Date.now() + '.'+ext);
      }
    }),

    // filter out and prevent non-image files.
    fileFilter: function(req, file, next){
          if(!file){
            next();
          }

        // only permit image mimetypes
        const image = file.mimetype.startsWith('image/');
        if(image){
          console.log('photo uploaded');
          next(null, true);
        }else{
          console.log("file not supported")
          //TODO:  A better message response to user on failure.
          return next();
        }
    }
  };


  /* ROUTES
  **********/
  app.get('/', function(req, res){
    res.render('index.html');
  });

  app.post('/upload', multer(multerConfig).single('photo'),function(req, res){
      //Here is where I could add functions to then get the url of the new photo
      //And relocate that to a cloud storage solution with a callback containing its new url
      //then ideally loading that into your database solution.   Use case - user uploading an avatar...
      res.send('Complete! Check out your public/photo-storage folder.  Please note that files not encoded with an image mimetype are rejected. <a href="index.html">try again</a>');
  }

);

  // RUN SERVER
  app.listen(port,function(){
    console.log(`Server listening on port ${port}`);
  });
