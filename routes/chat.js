const express = require('express');
const router = express.Router();

const { 
    getMsgSenderReceiver,
    storeMessage,
    getchatMaster_id,
    joinChatMaster,
    deleteCnvMsg,
    reactionUpdate,
    TimeLine,
    cheackChatMaster,
    editMsg,
    uploadAudio
 } = require('../controllers/chatController');


 const path = require('path');
 const multer = require('multer');

 const uploads = multer({ dest: '../uploads' });



 const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let destinationPath = './assets'; // Specify the base directory for assets

    if (isImage(file)) {
      destinationPath += '/SndRcvdImage'; // If it's an image, use SndRcvdImage folder
    } 
    else if (isPDF(file)) {
      destinationPath += '/SndRcvdPDF'; // If it's a PDF, use SndRcvdPDF folder
    }
      else if (isAudio(file)) {
        destinationPath += '/SndRcvdAudio'; // If it's an audio file, use SndRcvdAudio folder
      }

      else if (isVideo(file)) {
        destinationPath += '/SndRcvdVideo'; // If it's a video file, use SndRcvdVideo folder
      }
    else {
      // Handle other file types or set a default folder
      destinationPath += '/SndRcvdAudio';
    }

    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    if (isImage(file)) {
      // If it's an image, use a specific filename format
      cb(null, 'image-' + Date.now() + path.extname(file.originalname));
    } else if (isPDF(file)) {
      // If it's a PDF, use a specific filename format
      cb(null, 'pdf-' + Date.now() + path.extname(file.originalname));
    } 
    else if (isAudio(file)) {
        // If it's an audio file, use a specific filename format
        cb(null, 'audio-' + Date.now() + path.extname(file.originalname));
      }
      else if (isVideo(file)) {
        // If it's a video file, use a specific filename format
        cb(null, 'video-' + Date.now() + path.extname(file.originalname));
      }
    else {
      // If it's another file type, use a generic filename format
      cb(null, 'file-' + Date.now() + path.extname(file.originalname));
    }
  },
});

// Helper function to check if the file is an image
function isImage(file) {
  const allowedImageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
  const fileExtension = path.extname(file.originalname).toLowerCase();
  return allowedImageExtensions.includes(fileExtension);
}

// Helper function to check if the file is a PDF
function isPDF(file) {
  const allowedPDFExtensions = ['.pdf', '.doc', '.docx', '.txt'];
  const fileExtension = path.extname(file.originalname).toLowerCase();
  return allowedPDFExtensions.includes(fileExtension);
}

// Helper function to check if the file is an audio file
function isAudio(file) {
    const allowedAudioExtensions = ['.mp3', '.wav', '.ogg', '.aac'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    return allowedAudioExtensions.includes(fileExtension);
}  

function isVideo(file) {
  const allowedVideoExtensions = ['.mp4', '.avi', '.mkv', '.mov'];
  const fileExtension = path.extname(file.originalname).toLowerCase();
  return allowedVideoExtensions.includes(fileExtension);
}


const upload = multer({ storage: storage });

 router.post('/chatconversation',getMsgSenderReceiver);
 router.post('/msgconversation',upload.single('image'),storeMessage);
 router.post('/getchatmasterid',getchatMaster_id);
 router.post('/joinchatmaster',joinChatMaster);
 router.post('/deleteconversemsg',deleteCnvMsg);
 router.post('/reaction',reactionUpdate);
 router.post('/TimeLine',TimeLine);
 router.post('/StarChat',cheackChatMaster);
 router.post('/editConversation',editMsg);
 router.post('/mp3',uploads.single('audio'),uploadAudio);

module.exports = router;
