import LoadingSvgComponent from "~/icons/loading";

const Loading: React.FC = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <div>
        <LoadingSvgComponent height={128} width={128} />
      </div>
    </div>
  );
};

export default Loading;
