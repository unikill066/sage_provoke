# Python Chat Box

A modern, responsive chat application built with Python Flask and HTML/CSS/JavaScript.

## Features

- 🎨 Modern, responsive UI with beautiful gradients
- 💬 Real-time message sending and receiving
- 📱 Mobile-friendly design
- 🔄 Auto-refresh messages
- 🗑️ Clear all messages functionality
- ⌨️ Enter to send, Shift+Enter for new line
- 📝 Auto-resizing text input
- ⏰ Message timestamps
- 🎭 Typing indicators
- 🎯 Auto-scroll to latest messages

## Installation

1. **Clone or download this repository**

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application:**
   ```bash
   python app.py
   ```

4. **Open your browser and go to:**
   ```
   http://localhost:5000
   ```

## How to Use

1. **Send Messages**: Type your message in the input field and press Enter or click the Send button
2. **New Lines**: Use Shift+Enter to create new lines in your message
3. **Refresh**: Click the "🔄 Refresh" button to manually refresh messages
4. **Clear**: Click the "🗑️ Clear" button to delete all messages

## File Structure

```
sage_provoke/
├── app.py              # Main Flask application
├── requirements.txt    # Python dependencies
├── messages.json       # Message storage (created automatically)
├── templates/
│   └── index.html      # Chat interface template
└── README.md          # This file
```

## Technical Details

- **Backend**: Python Flask
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Storage**: JSON file-based storage
- **Styling**: Custom CSS with modern design patterns
- **Responsive**: Works on desktop, tablet, and mobile devices

## Customization

You can easily customize the chat application by:

- **Colors**: Modify the CSS gradients in `templates/index.html`
- **Messages**: Edit the sample messages in `app.py`
- **Auto-refresh**: Change the refresh interval in the JavaScript code
- **Styling**: Update the CSS classes and properties

## Requirements

- Python 3.7 or higher
- Flask 2.3.3
- Modern web browser with JavaScript enabled

## License

This project is open source and available under the MIT License.
