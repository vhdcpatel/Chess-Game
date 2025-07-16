import React from 'react';
import styles from './ChessLabelStyles.module.css';

interface FileLabelProps {
  file: string;
  fileIndex: number;
}

const FileLabel: React.FC<FileLabelProps> = ({ file, fileIndex }) => {
  return (
    <span 
      className={
        `${styles.fileLabel}
         ${fileIndex % 2 === 1 ? styles.lightColorTxt : styles.darkColorTxt}`
      }
    >
      {file}
    </span>
  );
};

export default FileLabel;
