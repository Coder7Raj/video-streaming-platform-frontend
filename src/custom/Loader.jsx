const Loader = () => {
  return (
    <div className="flex justify-center items-center w-full h-64">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-spin-slow blur-sm opacity-70"></div>

        {/* Middle glow */}
        <div className="absolute inset-0 w-14 h-14 m-auto rounded-full bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse blur-md opacity-80"></div>

        {/* Inner core */}
        <div className="absolute inset-0 w-7 h-7 m-auto rounded-full bg-white shadow-lg animate-bounce"></div>
      </div>
    </div>
  );
};

export default Loader;
