const BUG_KEYWORDS=["fix", "bug", "patch", "error", "issue", "crash", "revert"]

function computeComplexity(content){
    const patterns=[ /\bif\b/g, /\belse\b/g, /\belif\b/g, /\bwhile\b/g,
        /\bfor\b/g, /\bcase\b/g, /\bcatch\b/g, /&&/g, /\|\|/g
    ];

    return patterns.reduce((sum,p) => sum + (content.match(p) || []).length, 0);

}

function extractFeatures(path,content,commits){
    const lines=content.split("\n");
    const loc=lines.length;

    const commentLines=lines.filter(l =>
         /^\s*(\/\/|#|\*|\/\*)/.test(l)
    ).length;

    const comment_density=loc > 0 ? +(commentLines / loc).toFixed(3) : 0;

    const churn_rate=commits.length;

    const bugFixCount = commits.filter(c =>
        BUG_KEYWORDS.some(k => c.commit.message.toLowerCase().includes(k))
    ).length;

    const bug_fix_pct=commits.length > 0 ? +(bugFixCount / commits.length).toFixed(3) : 0;

    const authors= new Set(commits.map(c => c.commit.author?.email || ""));
    const unique_authors=authors.size;

    const complexity=computeComplexity(content);

    return {
        path,
        loc,
        churn_rate,
        bug_fix_pct,
        comment_density,
        unique_authors,
        complexity
    }
}

module.exports={extractFeatures};

