import React from 'react';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum } from "openai";

interface ConversationProps {
  conversations: Array<ChatCompletionRequestMessage>
}

function Conversation({ conversations }: ConversationProps) {
  return (
    <div>
      <div className="flex flex-col space-y-4 mx-10 break-all">
        {
          conversations.map((c, i) => c.role === ChatCompletionRequestMessageRoleEnum.Assistant ? (
            <div key={i}>
              <div className="flex items-end">
                  <div className="flex flex-col space-y-2 text-s max-w-s mx-2 order-2 items-start">
                    <div className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">
                      <ReactMarkdown children={c.content} remarkPlugins={[remarkGfm]} />
                    </div>
                  </div>
              </div>
            </div>
          ) 
          : 
          <div key={i}>
          <div className="flex items-end justify-end">
              <div className="flex flex-col space-y-2 text-s max-w-s mx-2 order-1 items-end">
                <div className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">
                  <ReactMarkdown children={c.content} remarkPlugins={[remarkGfm]} />
                </div>
              </div>
          </div>
        </div>)
        }


      </div>
    </div>
  );
}

export default Conversation;
