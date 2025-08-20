# ChatGPT Session Reader

A Vue.js application that allows you to upload plain text files containing ChatGPT conversations and view them in a formatted chat interface with intelligent format detection.

## Features

- **File Upload**: Drag and drop or select plain text files (.txt) with visual feedback
- **Smart Format Detection**: Pre-configured formats for popular AI chat services
- **Custom Format Support**: Define your own chat format patterns
- **Beautiful Chat Interface**: Clean, modern UI with distinct styling for user and assistant messages
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Processing**: Messages are parsed and displayed instantly
- **Internationalization**: Built with Vue I18n for easy localization
- **Multi-language Support**: Traditional Chinese (繁體中文) and English

## Supported Chat Formats

The application comes with pre-configured formats for popular AI chat services with localized prefixes:

**English:**

- **ChatGPT Default**: `User:` / `Assistant:`
- **ChatGPT New**: `Human:` / `Assistant:`
- **Claude**: `Human:` / `Claude:`
- **Google Bard**: `User:` / `Bard:`
- **Custom**: Define your own format

**Traditional Chinese (繁體中文):**

- **ChatGPT 預設**: `你說：` / `ChatGPT 說：`
- **ChatGPT 新版**: `你說：` / `ChatGPT 說：`
- **Claude**: `你說：` / `Claude 說：`
- **Google Bard**: `你說：` / `Bard 說：`
- **自訂**: 定義您自己的格式

## How to Use

1. **Upload a File**: Click the upload area or drag a text file into it
2. **Select Chat Format**: Choose from predefined formats or create a custom one
3. **View Chat History**: The application will automatically parse and display the conversation

## File Format

Your text file should contain conversations in one of these formats:

**English - ChatGPT Default:**

```
User: Your message here
Assistant: My response here
```

**English - Claude:**

```
Human: Your message here
Claude: My response here
```

**Traditional Chinese - ChatGPT Default:**

```
你說：您的訊息
ChatGPT 說：我的回應
```

**Traditional Chinese - Claude:**

```
你說：您的訊息
Claude 說：我的回應
```

**Custom Format:**

```
[Your User Prefix]: Your message here
[Your Assistant Prefix]: My response here
```

## Development

### Prerequisites

- Node.js (^20.19.0 or >=22.12.0)

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Examples

Sample chat files are included in the project root:

- `sample-chat.txt` - ChatGPT format conversation (English)
- `sample-claude-chat.txt` - Claude format conversation (English)
- `sample-zh-tw-chat.txt` - ChatGPT format conversation with localized prefixes (Traditional Chinese)

## Technologies Used

- Vue 3 with Composition API
- TypeScript
- Vue I18n for internationalization
- Vite
- Modern CSS with Flexbox and Grid
