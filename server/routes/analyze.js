const express = require("express");
const router = express.Router();
const axios = require("axios");
const { getFileTree, getFileCommits, getFileContent } = require("../services/githubService");
const { extractFeatures } = require("../services/featureExtractor");
const Analysis = require("../model/analysisModel");


router.post("/", async(req,res) => {
    try{

        const {repoUrl}=req.body;
        const match =  repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)\/?$/);

        if(!match) return res.status(400).json({error : "Invalid Github Url"});
       

        const[,owner,repo]=match; //owner and repo name is on index 1 and 2

         //Uses a Regular Expression (match) to split the URL and isolate the repository owner (username/org) 
        // and the repository name. If the URL is incorrectly formatted, it immediately stops and returns a 400 Bad Request error.

        const cached = await Analysis.findOne({owner,repo});
        if(cached) return res.json(cached.results);
        //if that url already has been processed its data must have been saved in the mongo db data base
        //so we skip all the calculations and get the pre-existing calculated data from the db


        const files = await getFileTree(owner,repo);
        if (files.length === 0) {
            return res.status(400).json({
                error: "No valid files found"
            });
        }

        const FeaturesArr = [];
        //we call the helper function that will give us data of top 60 files from the repository 
        //and store it in the array

        for (let i = 0; i < files.length; i += 5) {      //rather than processing the file one by one we do it in chunks of 5
            const batch = files.slice(i, i + 5);
            const batchResults= await Promise.all(batch.map(async f =>{
                const[content,commits]=await Promise.all([    //this loop downloads raw content and commit history for file one by one
                    getFileContent(owner,repo,f.path),
                    getFileCommits(owner,repo,f.path)
                ]);
                return extractFeatures(f.path,content,commits);     //combines file path, contents and commits
            })); 
            FeaturesArr.push(...batchResults.filter(Boolean));   //flattens the array and gather data for each batch
        }

        const ml=await axios.post(`${process.env.ML_SERVICE}/predict`,{
            files: FeaturesArr
        });
        // send the array to the ml-service url

        const results=FeaturesArr.map((feat,i)=>({
            ...feat,                             // 1. Spreads Local Metrics (e.g., linesOfCode: 120, totalCommits: 14)
            ...ml.data.results[i]                 // 2. Spreads ML Data (e.g., bugRiskScore: 0.82, complexityTier: "High")
        }));

        await Analysis.create({owner,repo,results,analyzedAt : new Date()});
        //stores the data in mongo db
        res.json({owner, repo, totalFiles : results.length, files : results});

    }
    catch(err){
        console.error(err);
        res.status(500).json({error : "Analysis failed", detail : err.message})
    }
})

module.exports = router