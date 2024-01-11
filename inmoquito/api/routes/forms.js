import express from "express";
import {getForm} from "../controllers/form.js";

const router = express.Router();

router.post("/getForm", getForm);

export default router;