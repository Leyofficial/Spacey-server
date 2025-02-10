const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const multer = require('multer');
const { GridFsStorage } = require("multer-gridfs-storage");
const dotenv = require('dotenv');

dotenv.config();

const connectToMongoDB = mongoose.createConnection(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

let gfs;

connectToMongoDB.once('open', () => {
  gfs = Grid(connectToMongoDB.db, mongoose.mongo);
  gfs.collection('uploads');
});

const storage = new GridFsStorage({
  url: process.env.MONGODB_URI,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const filename = file.originalname;
      const fileInfo = {
        filename: filename,
        bucketName: 'uploads'
      };
      resolve(fileInfo);
    });
  }
});

exports.getFile = async (req, res) => {
  try {
    const id = mongoose.Types.ObjectId(req.params.id);
    const file = await gfs.files.findOne({ _id: id });

    if (!file) {
      return res.status(404).json({
        err: "File has not found"
      });
    }

      res.set('Content-Type', file.contentType);
      const readStream = gfs.createReadStream(file.filename);

      readStream.pipe(res);

      readStream.on('error', (err) => {
        console.error('Error while reading file:', err);
        return res.status(500).json({ err: "Internal read" });
      });

  } catch (err) {
    console.log('Error in getFile', err);
    return res.status(404).json({
      err: 'File has not found'
    });
  }
};

exports.upload = multer({ storage });