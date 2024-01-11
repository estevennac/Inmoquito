import express from "express"
import authRoutes from "./routes/auth.js"
import postRoutes from "./routes/posts.js"
import formRoutes from "./routes/forms.js"
import cookieParser from "cookie-parser"
import multer from "multer"
//import cors from 'cors';
const app = express();
app.use(express.json())
app.use(cookieParser())
//app.use(cors);
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "../client/public/upload");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname);
    },
  });
  const upload = multer({ storage });

app.post('/api/upload', upload.single("file"), function (req, res) {
   const file = req.file;
   res.status(200).json(file.filename);
  });

app.use("/api/auth", authRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/forms", formRoutes)

app.get("/test",(req,res)=>{
    res.json("Funcionando")
})
app.listen(8800,()=>{
    console.log("Conectado")
}
)