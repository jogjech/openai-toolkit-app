import React from 'react';
import Conversation from './Conversation';
import { ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi } from "openai";
import { IoMdSend } from 'react-icons/io'
import { VscClearAll } from 'react-icons/vsc'

function Chat() {
  let [apiKeyInput, setApiKeyInput] = React.useState<string>("");
  let [apiKey, setApiKey] = React.useState<string|undefined>(() => {
    const localStorageApiKey = localStorage.getItem("apiKey");
    if (localStorageApiKey === null) {
      return undefined;
    }
    return localStorageApiKey;
  });
  let [isStreamResponse, setIsStreamResponse] = React.useState(false);
  let [text, setText] = React.useState('')
  let [conversations, setConversations] = React.useState<Array<ChatCompletionRequestMessage>>([])

  let handleInputChange = (e) => {
    let inputValue = e.target.value
    setText(inputValue)
  }

  let handleClearConversation = () => {
    setConversations([])
  }

  let handleApiKeyInputChange = (e) => {
    let inputValue = e.target.value
    setApiKeyInput(inputValue)
  }

  let handleSaveKey = () => {
    localStorage.setItem("apiKey", apiKeyInput);
    setApiKey(apiKeyInput);
    setApiKeyInput("");
  }

  let handleSubmit = async () => {
    try {
      const newConversationObject = [...conversations, {role: ChatCompletionRequestMessageRoleEnum.User, content: text}];
      setConversations(newConversationObject);
      setText('')
      
      setConversations([...newConversationObject, {role: ChatCompletionRequestMessageRoleEnum.Assistant, content: "..."}])

      const configuration = new Configuration({ apiKey });
      const openai = new OpenAIApi(configuration);
      
      if (!isStreamResponse) {
        const completion = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: newConversationObject.slice(-3) // Only send the last 6 messages for context
        });
        let response = completion.data.choices[0].message;
        if (response !== undefined) {
          setConversations([...newConversationObject, response]);
        }
      } else {

      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='relative h-screen' >
      {
        apiKey === undefined
          ?
          (
            <div className='w-full'>
              <h1 className="text-6xl fixed h-24 px-10 pt-5">One-time Setup</h1>
              <div className='pt-36 text-center w-3/4 mx-auto'>
                <span className='text-xl'>Enter your OpenAI API Key:</span>
                <input type="text" autoFocus className="mt-3 w-full rounded-lg border border-gray-400 p-2" placeholder="Type here ..." 
                  value={apiKeyInput} onChange={handleApiKeyInputChange}/>
                <button className="mt-3 ml-3 rounded-xl bg-gradient-to-br from-[#6025F5] to-[#FF5555] px-5 py-3 text-base font-medium text-white transition duration-200 hover:shadow-lg hover:shadow-[#6025F5]/50"
                    onClick={handleSaveKey}>
                  Save
                </button>
                <p>You can create new keys at <a target="_blank" rel="noreferrer noopener" href="https://platform.openai.com/account/api-keys" className='underline text-green-700'>OpenAI's official website</a>.</p>
                <p>Your key will be stored on your browser's local storage.</p>
              </div>
            </div>
          )
          :
          <div>
            <h1 className="text-6xl fixed h-24 w-full px-10 pt-5">Chat</h1>

              <div className='absolute overflow-y-auto top-24 bottom-20 w-full'>
                <Conversation conversations={conversations}></Conversation>
              </div>

              <div className='fixed bottom-0 left-0 w-screen pb-7'>
                <div className='px-10'>
                  
                  <div className='float-right'>
                    <button className="ml-3 rounded-xl bg-gradient-to-br from-[#6025F5] to-[#FF5555] px-5 py-3 text-base font-medium text-white transition duration-200 hover:shadow-lg hover:shadow-[#6025F5]/50"
                        onClick={handleSubmit}>
                      <IoMdSend />
                    </button>
                    <button className="ml-3 rounded-xl bg-gradient-to-br from-[#5edb20] to-[#151799] px-5 py-3 text-base font-medium text-white transition duration-200 hover:shadow-lg hover:shadow-[#6025F5]/50"
                        onClick={handleClearConversation}>
                      <VscClearAll />
                    </button>
                  </div>
                  <span className='block overflow-hidden'>
                    <input type="text" autoFocus className="w-full rounded-lg border border-gray-400 p-2" placeholder="Type here ..." 
                      value={text} onChange={handleInputChange}/>
                  </span>
                </div>
              </div>

          </div>
      }

      
    </div>
  );
}

export default Chat;
