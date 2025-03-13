# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess

app = Flask(__name__)
CORS(app)

@app.route('/api/start', methods=['POST'])
def start_mode():
    data = request.get_json()
    mode = data.get("mode")
    if mode not in ["1", "2"]:
        return jsonify({"error": "Invalid mode. Use '1' for Reels or '2' for Dino."}), 400

    # Determine which script to run based on mode.
    if mode == "1":
        # Assuming your reels module is executable via: python games/reels.py
        cmd = ["/usr/bin/python3", "games/reels.py"]
    elif mode == "2":
        cmd = ["/usr/bin/python3", "games/dino.py"]

    # Launch the process; this call returns immediately.
    subprocess.Popen(cmd)
    return jsonify({"status": "Gesture control started", "mode": mode}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)