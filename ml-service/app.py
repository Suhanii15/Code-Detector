from flask import Flask, request, jsonify
from flask_cors import CORS 
import joblib, pandas as pd, os

app=Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(__file__)
pipeline = joblib.load(os.path.join(BASE_DIR, "models", "model.pkl"))
FEATURES = joblib.load(os.path.join(BASE_DIR, "models", "features.pkl"))
print(f"Model loaded. Features : {FEATURES}")

@app.route("/health")
def health():
    return jsonify({"status" : "ok", "features": FEATURES})#if status is ok will tell container is alive
#jsonify converts the python dictionary in proper json format so as to send to correct ghttp header

@app.route("/predict",methods=["POST"])
def predict():
    body = request.get_json() #converts incoming raw json  data into pythin dictionary and stored in body
    files=body.get("files", [])  #.get is the look up function to find data from python dictionary "files" act as a key and [] acts a return fallback value as will return empty list if not matched with key

    if not files:
        return jsonify({"error" : "no files provided"}), 400
    
    df=pd.DataFrame(files) #convert list of dictionaries into tabular structure

    for feat in FEATURES:
        if feat not in df.columns:
            df[feat]=0    #if that particular name column  is not present in the features list will create a column with that name and populates everty row with 0.

    probs=pipeline.predict_proba(df[FEATURES])[:,1] #matches column in dataframe as same as the model expects and also remove unused colums and calculate
                                                    #probability of all classes also [:, 1]: This is NumPy slicing syntax. The : means "keep all rows", and the 1 means "keep only the second column" (which is the probability of the event actually happening, usually the risk score).
    preds = pipeline.predict(df[FEATURES])       #Outputs the final class decision directly (e.g., 0 for safe, 1 for risky).

    results=[]
    for i,f in enumerate(files):  #A loop helper that gives you both the index i (0, 1, 2...) and the actual file item f at the same time
        score = round(float(probs[i]), 3)
        results.append({
            "path" : f.get("path", ""),
            "prediction": int(preds[i]),
            "riskScore" : score,
            "riskLevel" : (
                "high" if score > 0.65 else
                "medium" if score > 0.35 else
                "low"
            )
        })

        results.sort(key=lambda x: x["riskScore"], reverse=True)  #sort the result array as per highest risky files on top and then lower

    return jsonify({"results" : results})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5001)))


