from flask import Flask, request, jsonify
from flask_cors import CORS

import os
import shutil
import subprocess

app = Flask(__name__)
CORS(app)

# Define paths
SOURCE_FOLDER ="../back_TunisairResolve/pfe/workfow/src/main/resources/uploads" 
DATA_FOLDER = "data"           
POPULATE_SCRIPT = "populate_database.py"
QUERY_SCRIPT = "query_data.py"

# Ensure the data folder exists
os.makedirs(DATA_FOLDER, exist_ok=True)

@app.route('/<filename>', methods=['POST'])
def process_file(filename):
    try:
        fileexist = False
        # Construct full file paths
        source_path = os.path.join(SOURCE_FOLDER, filename)
        destination_path = os.path.join(DATA_FOLDER, filename)

        # Check if the file already exists in the data folder
        if os.path.exists(destination_path):
            fileexist = True

        # Check if the file exists in the source folder
        if not os.path.exists(source_path):
            return jsonify({"error": f"File '{filename}' not found in source folder."}), 404

        # Copy the file to the data folder
        if fileexist == False:
            shutil.copy(source_path, destination_path)

        # Retrieve the prompt from the request body
        prompt = request.json.get("prompt", "")



        # Run the populate_database.py script with the prompt
        subprocess.run( ["python", POPULATE_SCRIPT] )


        
        # Run the query_data.py script
        query_result = subprocess.run(
            ["python", QUERY_SCRIPT,prompt], capture_output=True, text=True
        )
        if query_result.returncode != 0:
            return jsonify({"error": "Failed to run query_data.py",
                            "details": query_result.stderr}), 500

        # Return the output of query_data.py
        return jsonify({"data": query_result.stdout.strip()})

    except Exception as e:
        return jsonify({"error": "An unexpected error occurred.", "details": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
