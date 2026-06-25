import pandas as pd
import numpy as np

df=pd.read_csv("data/training_data.csv")
print(f"Before cleaning : {len(df)} rows")

noise_patterns=[
    "package-lock", "year.lcok" , "dist/", "build/",
    ".min.js", ".min.css", "node_modules", "__pycache__", ".gitignore", ".gitattributes", ".DS_Store",
    "migrations/", "d.ts"
]

mask=~df["file"].str.contains("|".join(noise_patterns), case=False, na=False) 
df=df[mask]
#we made mask true for clean files and false for noisy files and then 
#keeps only data that has mask true and overwrites old DataFrame with cleaned data 

df=df[df["loc"] > 5] # overwrites variable df with filtered data frame


for col in ["loc", "churn_rate", "unique_authors"]:
    cap=df[col].quantile(0.99)       #any value above the 9th percentile value represents the top 1% data

    df[col]=df[col].clip(upper=cap)  #any value greater than cap will be replced by the cap value and vlaues lower then them would be left unchanged

df["bug_fix_pct"]=df["bug_fix_pct"].clip(0,1)
df["comment_density"]=df["comment_density"].clip(0,1) #ensuring bith of them stay in 0-1

df=df.reset_index(drop=True)

print(f"After cleaning:  {len(df)} rows")
print("Class balance after clean:")
print(df["is_buggy"].value_counts(normalize=True).mul(100).round(1))

df.to_csv("data/clean_data.csv", index=False)
print("Saved clean_data.csv")
