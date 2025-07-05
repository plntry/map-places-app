export const ErrorPage: React.FC<{
  message: string;
  buttonText?: string;
  buttonOnClick?: () => void;
}> = ({ message = "", buttonText = "", buttonOnClick = () => {} }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center glass-card p-8 rounded-2xl">
        <p className="text-xl text-gray-800 mb-4">{message}</p>
        {buttonText && (
          <button
            onClick={buttonOnClick}
            className="px-6 py-2 glass-button-neutral text-gray-800 rounded-lg transition-all duration-300"
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};
