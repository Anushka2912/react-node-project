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
    const {
        page = 1,
        limit = 10,
        search = "",
        sortBy = "timestamp",
        order = "asc",
        emailDomain
    } = req.query;

    try {
        let query ={};
        
        if(search) {
            query.$or = [
                { name: { $regex: search, $options: 'i'} },
                { email: { $regex: search, $options: 'i'} },
            ];
        }

        if(emailDomain) {
            query.email = { $regex: `@${emailDomain}$`, $options: 'i' };
        }

        const sortOptions = { [sortBy]: order === 'desc' ? -1 : 1};

        const submissions = await Submission.find(query)
        .sort(sortOptions)
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

        const totalSubmissions = await Submission.countDocuments();

        const totalPages = Math.ceil(totalSubmissions / limit);

        res.status(200).json({ submissions, totalSubmissions, totalPages });
    } 
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch submissions' });
    }
});

//PUT: Update a submission by ID
router.put('/:id', async(req, res) => {
    const { id } = req.params;
    const {name, email, message} = req.body;

    try {
        const updatedSubmission = await Submission.findByIdAndUpdate(
            id,
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