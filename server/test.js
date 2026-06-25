require("dotenv").config();

const { getFileTree } = require("./services/githubService");

(async () => {
    try {
        const files = await getFileTree(
            "facebook",
            "react"
        );

        console.log("Total files:", files.length);
        console.log("First file:", files[0]);
    } catch (err) {
        console.error(err);
    }
})();



//for github service