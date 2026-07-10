const Feedback = require("../models/Feedback");

const addFeedback = async (req,res)=>{
    try{

        const feedback = await Feedback.create({
            user:req.user._id,
            message:req.body.message
        });

        res.status(201).json(feedback);

    }catch(err){
        res.status(500).json({message:err.message});
    }
};

const getAllFeedback = async(req,res)=>{
    try{

        const feedback = await Feedback.find()
        .populate("user","name email")
        .sort({createdAt:-1});

        res.json(feedback);

    }catch(err){
        res.status(500).json({message:err.message});
    }
};

module.exports={
    addFeedback,
    getAllFeedback
};