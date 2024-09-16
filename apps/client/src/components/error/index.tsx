type ErrorProps = {
  errorMessage?: string;
};

const Error: React.FC<ErrorProps> = ({ errorMessage }) => {
  return (
    <div className="h-screen flex items-center justify-center text-center">
      <div>
        <h1 className="text-4xl text-destructive font-bold text-center mb-4">
          Error
        </h1>
        <p className="text-center">
          An error occurred. Please try again later or contact a support.
        </p>
        {errorMessage && <p>{errorMessage}</p>}
      </div>
    </div>
  );
};

export default Error;
