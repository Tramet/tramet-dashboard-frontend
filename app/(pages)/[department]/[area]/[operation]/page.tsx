import React from "react";

interface OperationsProps {
  params: {
    operation: string;
  };
}

const Operations = ({ params }: OperationsProps) => {
  const operation = params.operation;
  return <div>{operation} page</div>;
};

export default Operations;
