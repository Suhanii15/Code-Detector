import requests , pandas as pd, os, time    #the load_dotenv function helps t load the environmentv variables from .env file and the os module helps in directly interacting with the operating sysytem 
from dotenv import load_dotenv               #rewquests is used to get and fetch https requests and pandas is used to store the data in a dataframe and then convert it into csv file 
import re    #accepts a string and is used for advanced pattern searching

load_dotenv()
TOKEN=os.getenv("GITHUB_TOKEN")  #fetching the github token from the environment variable
if not TOKEN:
    raise SystemExit("GITHUB_TOKEN is not set in .env")

HEADERS={"Authorization": f"token {TOKEN}"}  #creating a header for the request to be sent to GitHub API
# GitHub requires the token prefix plus a space before the actual token string.

#f" (f-string) lets you embed variables or expressions directly inside string

SINCE_DATE = "2023-01-01T00:00:00Z"


REPOS=[
    "facebook/react",  "expressjs/express", "axios/axios",
  "tailwindlabs/tailwindcss", "vitejs/vite", "vercel/next.js",
  "socketio/socket.io", "mongodb/node-mongodb-native",
  "eslint/eslint", "webpack/webpack", "babel/babel",
  "lodash/lodash", "moment/moment", "chartjs/Chart.js",
  "mui/material-ui", "reduxjs/redux", "reactrouter/react-router",
  "prisma/prisma", "supabase/supabase", "trpc/trpc",
]

def get_file_tree(owner,repo):
    url=f"https://api.github.com/repos/{owner}/{repo}/git/trees/HEAD?recursive=1"
    #while the haed tells github to look at thhe tip (latest commit ) of all the branch usually mai or master and usr=ing recursive=1 makes sure that github grill down into every single subfolder and return the entire structure
    
    r=requests.get(url,headers=HEADERS) # send your security token to github endpoint 
    if r.status_code != 200: return []
    files=r.json().get("tree",[])  #convert github raw response into json format and get closely looks for key named "tree" so that give the folder structure
    return [f["path"] for f in files if f["type"] == "blob"  #github classifies folder as treeand files as blob
            and f["path"].endswith((".js", ".ts", ".py"))
            and f.get("size",0) < 1000000]
    return []

def get_commits_for_files(owner,repo,path,):
        url=f"https://api.github.com/repos/{owner}/{repo}/commits"
        params={"path" : path, "since" : SINCE_DATE, "per_page": 100}
        #path tells api to look at recent changes made to a specific file ,, date allows changes to be adjusted in chronological order,, per_page increases bandwith from 30(by default) to 100
        r=requests.get(url,headers=HEADERS, params=params)
        if r.status_code != 200 : return []
        return r.json()

def compute_complexity(content):
     keywords = [r'\bif\b', r'\belif\b', r'\belse\b' , r'\bfor\b',
                 r'\bwhile\b', r'\bcase\b', r'\bcatch\b', r'&&', r'\|\|' ]
     return sum(len(re.findall(p,content)) for p in keywords) 
# "\b" represnets a word boundary so that it mtaches exactly with lets say "if" and not with word "gift" or seomething lese 

# re.finadall : scans code an returns a list of every single overlap-free macth found for that specific pattern

def extract_features(owner,repo,path,commits):
      raw_url=f"https://raw.githubusercontent.com/{owner}/{repo}/HEAD/{path}" #get file content
      r=requests.get(raw_url,headers=HEADERS)
      content = r.text if r.status_code == 200 else ""
      lines=content.splitlines()
      loc=len(lines)
      comment_lines=sum(1 for l in lines if l.strip().startswith(("#","/","*", "/*")))
      # this removes leading white spaces and will add 1 to sum of commen_lines whenver a line starts with #, /, *, or /* 

      comment_density=round(comment_lines/loc,3) if loc > 0 else 0
      #ratio of comment lines to total lines ,, upto 3 decimal places

      churn_rate=len(commits)
      #calculate total changes made

      messages = [c["commit"]["message"].lower() for c in commits]
      # this is list comprehension in python. It lowercases each commit message so keyword checks are case-insensitive.
      
      bug_fix_count = sum(1 for m in messages if any(k in m for k in ["fix","bug","patch","error", "issue"]))
      #of all the committed messages it check how many of them inclusde fix etc keywords so that we know how many times the code broke

      bug_fix_pct=round(bug_fix_count/churn_rate,3) if commits else 0
      #calculate the ratio of many chnages made in file were done to fix bugs of all chnages made to the file

      authors = set()
      for c in commits:
        author = c["commit"].get("author")
        if author and author.get("email"):
          authors.add(author["email"])
      #goes through the code to get authors email address

      unique_authors = len(authors)
      # and check how many unique authors have contributed to the file

      content=r.text if r.status_code == 200 else ""
      complexity=compute_complexity(content)

      is_buggy = 1 if bug_fix_count > 0 else 0

      return {
        "repo":f"{owner}/{repo}", "file" :path,
        "loc":loc, "churn_rate":churn_rate,
        "comment_density":comment_density,
        "bug_fix_pct":bug_fix_pct, 
        "unique_authors":unique_authors,
        "complexity": complexity,
        "is_buggy": is_buggy      
      }

rows=[]
for repo_full in REPOS :
      owner,repo=repo_full.split("/")
      print(f"Processing {repo_full}...")
      files=get_file_tree(owner,repo)[:40]  
      for path in files:
            commits=get_commits_for_files(owner,repo,path)
            row=extract_features(owner,repo,path,commits)
            rows.append(row)
            time.sleep(0.3) 

df = pd.DataFrame(rows)

os.makedirs("data", exist_ok=True)

df.to_csv("data/training_data.csv", index=False)

print(f"Saved {len(df)} rows")
print(df["is_buggy"].value_counts())
