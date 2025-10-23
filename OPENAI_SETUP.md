# OpenAI API Setup Guide

## Step 1: Get Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the API key (it starts with `sk-`)

## Step 2: Set Up Environment Variables

Create a `.env.local` file in your project root with:

```bash
OPENAI_API_KEY=sk-your-actual-api-key-here
OPENAI_MODEL=gpt-4o
```

## Step 3: Install Dependencies

The OpenAI SDK is already installed in your project.

## Step 4: Start Your Development Server

```bash
npm run dev
```

## Step 5: Test the Translation

1. Open your app in the browser
2. Click the microphone button
3. Speak some medical terms
4. The app will translate using OpenAI's GPT-4o model

## Cost Information

- **GPT-4o**: ~$0.03 per 1K tokens (recommended for medical accuracy)
- **GPT-3.5-turbo**: ~$0.001 per 1K tokens (cheaper option)

## Security Notes

- Never commit your `.env.local` file to version control
- The API key is only used server-side for security
- Your voice recordings stay local in your browser

## Troubleshooting

If you get API errors:
1. Check your API key is correct
2. Verify you have credits in your OpenAI account
3. Check the browser console for detailed error messages
