import React from 'react';

interface SquareProps {
  rank: string;
  file: string;
}

const Square: React.FC<SquareProps> = (props) => {
  const {rank,file } = props;

  return (
    <React.Fragment>
      <div style={{ width: '50px', height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', border:'1px solid red' }}>
        {rank}{file}
      </div>
    </React.Fragment>
  );
};

export default Square;
