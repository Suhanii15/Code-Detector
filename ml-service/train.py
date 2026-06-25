import pandas as pd
import joblib  # a Python library used to save (serialize) and load Python objects to and from your hard drive quickly.
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline 
from sklearn.metrics import (classification_report, roc_auc_score, confusion_matrix)
import numpy as np

df=pd.read_csv("data/clean_data.csv")

FEATURES=["loc", "churn_rate", 
          "comment_density", "unique_authors", "complexity"]

x=df[FEATURES]
y=df["is_buggy"]

X_train, X_test, y_train, y_test=train_test_split(
    x,y,test_size=0.2,random_state=42,stratify=y
)
#startify is used to ensure that a train/test split maintains same percentage of classes as orignal dataset

print(f"Train: {len(X_train)} rows | test : {len(X_test)} rows")

pipeline=Pipeline([
    ("scaler", StandardScaler()),
    ("model", GradientBoostingClassifier(
        n_estimators=200,  #number of trees
        max_depth=4,      #how deep each tree grows
        learning_rate=0.1,   #how much each tree corrects
        subsample=0.8,   #use 80% of data per tree
        random_state=42
    ))
])

# Pipeline to chain data preprocessing steps and model training into a single, cohesive workflow

pipeline.fit(X_train,y_train)
print("training complete")

cv_scores=cross_val_score(pipeline,x,y,cv=5,scoring="roc_auc")
#divide in 5 chunks and the whole process
print(f"\n5-Fold Cross-Val ROC-AUC: {cv_scores.mean():.3f} ± {cv_scores.std():.3f}")
# ":3f" is used to round up values upto 3 decimal places 
#we also find average of all data and standard deviation as well
#if low standard deviation it means model is stable and perform consiistently while if it is high model is highly unstable

y_pred=pipeline.predict(X_test)
y_prob=pipeline.predict_proba(X_test)[:,1] # The [:, 1] slice grabs only the second column (the probability of class 1). This is required for calculating the ROC-AUC score.
print(classification_report(y_test,y_pred,
                            target_names=["Not Buggy", "Buggy"])) #generate vinary classification 1 for buggy and 0 for not buggy

print(f"ROC-AUC Score: {roc_auc_score(y_test, y_prob):.3f}")
print("\nConfusion Matrix (rows=actual, cols=predicted):")
print(confusion_matrix(y_test, y_pred))

importances = pipeline.named_steps["model"].feature_importances_  #reaches inside pipeline and targets step named "model" and extract numerical importance weights assigned to each input feature
print(" Feature Importances")
for feat, imp in sorted(zip(FEATURES, importances), key=lambda x: -x[1]): 
    bar = "█" * int(imp * 40)
    print(f"  {feat:<20} {bar}  {imp:.3f}")


joblib.dump(pipeline, "models/model.pkl")
joblib.dump(FEATURES,  "models/features.pkl")
print("\nModel saved ")