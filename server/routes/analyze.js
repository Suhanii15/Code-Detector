const express = require("express");
const router = express.Router();
const axios = require("axios");
const { getFileTree, getFileCommits, getFileContent, getRepoInfo} = require("../services/githubService");
const { extractFeatures } = require("../services/featureExtractor");
const Analysis = require("../model/analysisModel");

function getRecommendations(file) {
  const recs = []
  if (file.complexity > 40) recs.push("Consider splitting this file into smaller modules.")
  if (file.churn_rate > 20) recs.push("This file changes frequently. Review architecture and ownership.")
  if (file.comment_density < 0.05) recs.push("Documentation is sparse. Consider adding comments.")
  if (file.unique_authors > 5) recs.push("Many contributors modify this file. Review responsibility boundaries.")
  if (file.loc > 500) recs.push("Large file detected. Consider extracting reusable components.")
  if (file.bug_fix_pct > 0.2) recs.push("High bug fix ratio. Consider increasing test coverage.")
  return recs
}

function computeHotspots(results) {
  const dirMap = {}
  for (const f of results) {
    const idx = f.path.lastIndexOf("/")
    const dir = idx === -1 ? "/" : f.path.slice(0, idx)
    if (!dirMap[dir]) dirMap[dir] = { sum: 0, count: 0, highCount: 0 }
    dirMap[dir].sum += f.riskScore
    dirMap[dir].count += 1
    if (f.riskLevel === "high") dirMap[dir].highCount += 1
  }
  return Object.entries(dirMap)
    .map(([path, d]) => ({ path, averageRisk: +(d.sum / d.count).toFixed(3), fileCount: d.count, highRiskCount: d.highCount }))
    .sort((a, b) => b.averageRisk - a.averageRisk)
    .slice(0, 5)
}


router.post("/", async(req,res) => {
    try{

        const {repoUrl}=req.body;
        const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+?)(?:\/|\.git|$)/);

if (!match) {
  return res.status(400).json({ error: "Invalid GitHub URL" });
}

const owner = match[1];
const repo = match[2]; //owner and repo name is on index 1 and 2

const repoInfo = await getRepoInfo(owner,repo);

         //Uses a Regular Expression (match) to split the URL and isolate the repository owner (username/org) 
        // and the repository name. If the URL is incorrectly formatted, it immediately stops and returns a 400 Bad Request error.

        const cached = await Analysis.findOne({owner,repo});
        if(cached  &&
    cached.lastGithubPush === repoInfo.pushed_at) {
        console.log("Cache hit");

          const total = cached.results.length
          const filesWithRecs = cached.results.map(f => ({
            ...f,
            recommendations: f.recommendations || getRecommendations(f)
          }))
          return res.json({
            owner: cached.owner,
            repo: cached.repo,
            analyzedAt: cached.analyzedAt,
            totalFiles: total,
            stats: {
              total,
              high: filesWithRecs.filter(f => f.riskLevel === "high").length,
              medium: filesWithRecs.filter(f => f.riskLevel === "medium").length,
              low: filesWithRecs.filter(f => f.riskLevel === "low").length,
            },
            hotspots: computeHotspots(filesWithRecs),
            files: filesWithRecs,
          })
        }
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
            ...ml.data.results[i],                // 2. Spreads ML Data (e.g., bugRiskScore: 0.82, complexityTier: "High")
            recommendations: getRecommendations({...feat, ...ml.data.results[i]})
        }));

        await Analysis.findOneAndUpdate(
          { owner, repo },
          {
            $set: {
              results,
              analyzedAt: new Date(),
              lastGithubPush: repoInfo.pushed_at,
              owner,
              repo,
            },
          },
          { upsert: true, new: true }
        );
        // stores the data in mongo db
        const stats = {
    total: results.length,
    high: results.filter(f => f.riskLevel === "high").length,
    medium: results.filter(f => f.riskLevel === "medium").length,
    low: results.filter(f => f.riskLevel === "low").length
};

        const hotspots = computeHotspots(results);

        res.json({owner, repo, analyzedAt : new Date(), totalFiles : results.length, stats, hotspots, files : results});

    }
    catch(err){
        console.error(err);
        res.status(500).json({error : "Analysis failed", detail : err.message})
    }
})

module.exports = router