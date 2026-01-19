import React, { useState, useRef, useEffect, useMemo } from "react";
import { IoClose } from "react-icons/io5";
import useContactStore from "../store/useContactStore";

const EMAIL_ADDRESS = "govindbohara76@gmail.com";
export const GITHUB_URL = "https://github.com/govindbohara";
export const LINKEDIN_URL =
  "https://www.linkedin.com/in/govind-bohara-a77505237/";
export const RESUME_URL = "/Govind_SoftwareEngineer.pdf";
const RESPONSE_DELAY = 1000;

const initialMessages = [
  { id: 1, text: "Hello!", isUser: false },
  {
    id: 2,
    text: "I'm Govind's Bot. I'm here to help you with any questions you might have about Govind's work.",
    isUser: false,
  },
  { id: 3, text: "How can I help you today?", isUser: false },
];

const initialBotCommands = [
  { id: 1, text: "Just saying hello.", command: "hello", userText: "Hello!" },
  {
    id: 2,
    text: "We'd like to talk with you",
    command: "talk",
    userText: "We'd like to talk with you",
  },
  {
    id: 3,
    text: "Explore my Resume",
    command: "resume",
    userText: "Explore my Resume",
  },
];

const botMessages = [
  {
    id: 1,
    command: "hello",
    texts: [
      "Hello!",
      "Thanks for reaching out",
      "Can I help you with anything else?",
    ],
    dummyCommand: initialBotCommands, // Reference directly
  },
  {
    id: 2,
    command: "talk",
    texts: [
      "Thank you for reaching out!",
      "I would love to discuss potential opportunities.",
      "Please let me know how we can proceed.",
    ],
    dummyCommand: [
      {
        id: 5,
        text: "GitHub",
        command: "github",
        userText: "Send an email",
      },
      {
        id: 6,
        text: "LinkedIn",
        command: "linkedin",
        userText: "Send an email",
      },
      {
        id: 3,
        text: "Send Email",
        command: "sendEmail",
        userText: "Send an email",
      },
      {
        id: 4,
        text: "Other options",
        command: "other",
        userText: "Show other options",
      },
    ],
  },
  {
    id: 4,
    command: "resume",
    texts: ["You can download my resume from the link below:"],
    dummyCommand: [
      {
        id: 1,
        text: "Download Resume",
        command: "downloadResume",
        userText: "Resume",
      },
      {
        id: 2,
        text: "Other options",
        command: "other",
        userText: "Show other options",
      },
    ],
  },
];

export default function Contact() {
  const [messages, setMessages] = useState(initialMessages);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [selectedCommand, setSelectedCommand] = useState("hello");
  const [isInitialBotCommands, setIsInitialBotCommands] = useState(true);
  const chatContainerRef = useRef(null);
  const { openContactModal: isVisible, setOpenContactModal: setIsVisible } =
    useContactStore();

  const selectedBotCommands = useMemo(() => {
    return (
      botMessages.find((msg) => msg.command === selectedCommand) || {
        dummyCommand: initialBotCommands,
      }
    );
  }, [selectedCommand]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleCommandClick = (command) => {
    if (command.command === "sendEmail") {
      window.open(`mailto:${EMAIL_ADDRESS}`);
      return;
    }
    if (command.command === "github") {
      window.open(`${GITHUB_URL}`, "_blank");
      return;
    }
    if (command.command === "linkedin") {
      window.open(`${LINKEDIN_URL}`, "_blank");
      return;
    }
    if (command.command === "downloadResume") {
      window.open(`${RESUME_URL}`, "_blank");
      return;
    }
    if (command.command === "other") {
      setSelectedCommand("hello");
      setIsBotTyping(false);
      return;
    }

    setIsInitialBotCommands(false);
    // Add user message if userText exists
    if (command.userText) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: Date.now(), text: command.userText, isUser: true },
      ]);
    }
    setSelectedCommand(command.command);
    setIsBotTyping(true);

    setTimeout(() => {
      const botResponse = botMessages.find(
        (msg) => msg.command === command.command,
      );
      if (botResponse) {
        botResponse.texts.forEach((text, index) => {
          setTimeout(() => {
            setMessages((prevMessages) => [
              ...prevMessages,
              { id: Date.now() + index, text, isUser: false },
            ]);
            if (index === botResponse.texts.length - 1) {
              setIsBotTyping(false);
              setIsInitialBotCommands(true);
            }
          }, index * RESPONSE_DELAY);
        });
      } else {
        setTimeout(() => {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              id: Date.now(),
              text: "Sorry, I don't understand that command.",
              isUser: false,
            },
          ]);
          setIsBotTyping(false);
          setIsInitialBotCommands(true);
        }, RESPONSE_DELAY);
      }
    }, RESPONSE_DELAY);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 md:inset-auto md:bottom-10 md:right-10 md:w-96 max-w-none w-full h-full md:h-auto md:max-h-[80vh] md:rounded-lg shadow-xl z-[10] ">
      <div className="flex items-center justify-between p-2 text-white rounded-none bg-primary-text md:rounded-t-lg">
        <div className="flex flex-col items-start gap-1">
          <p className="font-semibold font-secondary">Govind's Bot</p>
          <p className="text-sm font-secondary">Ask me a question</p>
        </div>
        <button
          className="mx-2 text-white cursor-pointer hover:text-gray-300 focus:outline-none"
          onClick={() => {
            setIsVisible(false);
            setSelectedCommand("hello"); // Reset on close
          }}
          aria-label="Close chat"
        >
          <IoClose className="w-6 h-6" />
        </button>
      </div>
      <div
        className="w-full h-[calc(100vh-60px)] md:h-[500px] overflow-auto bg-primary-bg md:bg-transparent backdrop-blur-2xl"
        ref={chatContainerRef}
      >
        <div className="m-4">
          <div className="flex flex-col gap-2">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message.text}
                isUser={message.isUser}
              />
            ))}
            {isBotTyping && (
              <div className="flex justify-start mb-2">
                <div className="max-w-[90%] w-fit p-2 rounded-lg text-primary-text bg-white font-secondary">
                  Typing...
                </div>
              </div>
            )}
          </div>
          <div
            className="flex flex-col gap-3 mt-4"
            role="region"
            aria-live="polite"
          >
            {isInitialBotCommands &&
              selectedBotCommands.dummyCommand.map((command) => (
                <BotCommands
                  key={command.id}
                  message={command.text}
                  onClick={() => handleCommandClick(command)}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const ChatMessage = ({ message, isUser }) => {
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`max-w-[90%] w-fit p-3 rounded-2xl text-start font-secondary ${
          isUser ? "bg-primary-text text-white" : "bg-white text-primary-text"
        }`}
        role="log"
        aria-live="polite"
      >
        {message}
      </div>
    </div>
  );
};

const BotCommands = ({ message, onClick }) => {
  return (
    <button
      className="max-w-[90%] w-fit p-3 font-secondary  rounded-3xl text-primary-text border-2 border-primary-text cursor-pointer transition-colors duration-300"
      onClick={onClick}
      aria-label={`Send command: ${message}`}
    >
      {message}
    </button>
  );
};
