const express = require("express");
const router = express.Router();
const Submission = require('../models/Submission');

//POST: Create a new submission
router.post('/', async(req, res) => {
    const {name, email, message} = req.body;

    try {
        const newSubmission = new Submission({
            name,
            email,
            message,
        });

        await newSubmission.save();
        res.status(201).json(newSubmission);
    }
    catch(err) {
        res.status(500).json({error: "Failed to create submission"});
    }
});

//GET: Fetch all submissions with pagination
router.get('/', async(req, res) => {
    const {page = 1, limit = 10, search = '', sortBy = 'timestamp', order = 'desc'} = req.query;

    try {
        const submissions = await Submission.find({
            $or: [
                { name: { $regex: search, $options: 'i'} },
                { email: { $regex: search, $options: 'i'} },
                { message: { $regex: search, $options: 'i'} },
            ],
        })
        .sort({ [sortBy]: order === 'desc' ? -1 : 1})
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

        const totalSubmissions = await Submission.countDocuments();

        res.status(200).json({ submissions, totalSubmissions });
    } 
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch submissions' });
    }
});

//PUT: Update a submission by ID
router.put('/:id', async(req, res) => {
    const {name, email, message} = req.body;

    try {
        const updatedSubmission = await Submission.findByIdAndUpdate(
            req.params.id,
            {name, email, message},
            { new: true},
        );
        if(!updatedSubmission){
            res.status(404).json({error: 'Submission not found'});
        }
        else {
            res.status(200).json(updatedSubmission);
        }
    }
    catch(err){
        res.status(500).json({error: 'Failed to update submission'});
    }
});

//GET: Get the total count of submissions
router.get('/count', async(req, res) => {
    try {
        const count = (await Submission.find()).length;
        res.status(200).json({count});
    }
    catch(err) {
        console.log({err});
        res.status(500).json({error: "Failed to count submissions"});
    }
});

module.exports = router;