import { Button, Result } from 'antd';
import { FaExclamationTriangle } from 'react-icons/fa';

const ErrorLoadingData = ({ message = 'Error loading data, please try to refresh' }) => {
  return (
    // <div className="flex h-64 items-center justify-center">
    //   <div className="flex flex-col items-center">
    //     <span className="mb-4 text-4xl text-gray-500">
    //       <FaExclamationTriangle />
    //     </span>
    //     <p className="text-lg text-gray-500">{message}</p>
    //   </div>
    // </div>
    <Result
      status="500"
      title="Error Loading Data"
      subTitle="Sorry, something went wrong."
      extra={
        <Button onClick={() => window.location.reload()} type="primary">
          Refresh
        </Button>
      }
    />
  );
};

export default ErrorLoadingData;
