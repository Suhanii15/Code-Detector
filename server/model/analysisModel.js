const mongoose=require("mongoose");
const schema = new mongoose.Schema({
    owner: String,
    repo: String,
    results: mongoose.Schema.Types.Mixed,
    analyzedAt: Date,
    lastGithubPush : String
});

module.exports = mongoose.model("Analysis", schema);