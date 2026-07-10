const express=require("express");
const router=express.Router();

const {
addFeedback,
getAllFeedback
}=require("../controllers/feedbackController");


const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/",protect,addFeedback);


router.get("/", protect, authorize("admin"), getAllFeedback);

module.exports=router;