require("dotenv").config();
const {Octokit} = require("@octokit/rest")
const octokit = new Octokit({auth : process.env.GITHUB_TOKEN});

{/* octokit is a client libraray maintained by github and allows developer to use lanaguage specific tool kit to interact with github
     rest API.  here we created an instance that allows the access to the GITHUB APi only to authorized users an will act
    as a central hub to communicate with the GITHUB API  */}

const SINCE = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();

async function getFileTree (owner,repo){
    const {data} = await octokit.rest.git.getTree({    //only get data from the whole object that github sends
      owner,repo, tree_sha : "HEAD" , recursive : "1"   //head tells github to look at every last commit and recursive 1 makes sure that all the sub folders are scanned not only the root folder
    }); 
    return data.tree
    .filter(f => f.type === "blob" &&
        !f.path.includes("node_modules") &&
        !f.path.includes("package-lock") &&
        /\.(js|ts|jsx|tsx|py|rb|go|rs|java|c|cpp|h|hpp|cs|php|swift|kt|scala|ex|exs|vue|svelte|cjs|mjs|css|scss|sass|less|html|htm|xml|json|yaml|yml|toml|md|sql|sh|bash|zsh|fish|ps1|bat|tf|dockerfile)$/i.test(f.path) &&
        (f.size || 0) <  1000000
    )
    .slice(0, 500);
}   



async function getFileCommits(owner,repo,path){
    try{
        const {data}= await octokit.repos.listCommits({
            owner,repo,path,since:SINCE, per_page:100
        });
        return data;
    }
    catch(err){
        console.log(err);
        return [];

    }
}


async function getFileContent(owner,repo,path){
    try{
        const {data}=await octokit.repos.getContent({owner,repo,path});
        return Buffer.from(data.content, "base64").toString("utf8");
    }
    catch(err){
       console.log(err);
       return "";
    }
}

async function getRepoInfo(owner,repo){
    const {data} = await octokit.rest.repos.get({
        owner,
        repo
    })

    return {
        pushed_at : data.pushed_at
    };
}

module.exports ={getFileTree,getFileCommits,getFileContent,getRepoInfo}