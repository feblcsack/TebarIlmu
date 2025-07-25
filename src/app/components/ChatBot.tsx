// src/app/chat/page.tsx (atau sesuai struktur folder kamu)

import { AILearningAssistant } from "./ai/Assistant";

export default function ChatBotPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <div className="flex flex-col md:flex-row w-full max-w-6xl gap-8">
     
        <div className="md:w-1/2 flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Use our ChatBot AI Assistant
          </h1>
          <p className="text-lg text-gray-600">
            This assistant will help you learn more efficiently. Powered by AI, it's tailored for your learning level.
          </p>
        </div>

        <div className="md:w-1/2 bg-white shadow-md rounded-lg p-4 border border-gray-200">
          <AILearningAssistant sessionTopic="Basic Math" userLevel="beginner" />
        </div>
      </div>
    </div>
  );
}
