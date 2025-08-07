const MessageInput = () => {
  return (
    <div className="flex p-4 bg-white">
      <input
        type="text"
        placeholder="Type a message..."
        className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none"
      />
      <button className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600">
        Send
      </button>
    </div>
  );
};

export default MessageInput;