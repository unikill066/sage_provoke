from flask import Flask, render_template, request, jsonify
import json
import os
from datetime import datetime

app = Flask(__name__)

# File to store messages
MESSAGES_FILE = 'messages.json'

def load_messages():
    """Load messages from JSON file"""
    if os.path.exists(MESSAGES_FILE):
        try:
            with open(MESSAGES_FILE, 'r') as f:
                return json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            return []
    return []

def save_messages(messages):
    """Save messages to JSON file"""
    with open(MESSAGES_FILE, 'w') as f:
        json.dump(messages, f, indent=2)

@app.route('/')
def index():
    """Main chat page"""
    messages = load_messages()
    return render_template('index.html', messages=messages)

@app.route('/send_message', methods=['POST'])
def send_message():
    """Handle sending a new message"""
    try:
        data = request.get_json()
        message_text = data.get('message', '').strip()
        
        if not message_text:
            return jsonify({'success': False, 'error': 'Message cannot be empty'})
        
        # Create new message
        new_message = {
            'id': len(load_messages()) + 1,
            'text': message_text,
            'type': 'sent',
            'timestamp': datetime.now().isoformat(),
            'user': 'User'  # You can extend this to support multiple users
        }
        
        # Load existing messages and add new one
        messages = load_messages()
        messages.append(new_message)
        save_messages(messages)
        
        return jsonify({
            'success': True, 
            'message': new_message
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/get_messages')
def get_messages():
    """Get all messages (for AJAX updates)"""
    try:
        messages = load_messages()
        return jsonify({'success': True, 'messages': messages})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/clear_messages', methods=['POST'])
def clear_messages():
    """Clear all messages"""
    try:
        save_messages([])
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

if __name__ == '__main__':
    # Create templates directory if it doesn't exist
    os.makedirs('templates', exist_ok=True)
    
    # Add some sample messages if the file is empty
    if not os.path.exists(MESSAGES_FILE):
        sample_messages = [
            {
                'id': 1,
                'text': 'Welcome to the Python Chat Box! 👋',
                'type': 'received',
                'timestamp': datetime.now().isoformat(),
                'user': 'System'
            },
            {
                'id': 2,
                'text': 'Start typing to send a message...',
                'type': 'received',
                'timestamp': datetime.now().isoformat(),
                'user': 'System'
            }
        ]
        save_messages(sample_messages)
    
    print("🚀 Starting Python Chat Box...")
    print("📱 Open your browser and go to: http://localhost:5000")
    print("🛑 Press Ctrl+C to stop the server")
    
    app.run(debug=True, host='0.0.0.0', port=5000) 