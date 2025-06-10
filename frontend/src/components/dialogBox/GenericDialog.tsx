import React from 'react';
import { Dialog, DialogTitle, Divider } from '@mui/material';
import styles from '../Game.module.css';

interface GenericDialogProps {
    isOpen?: boolean;
    onClose?: () => void;
    title: string;
    children: React.ReactNode;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const GenericDialog: React.FC<GenericDialogProps> = (props) => {

    const {
        isOpen = true,
        onClose = () => {},
        title,
        children,
        maxWidth = 'xl'
    } = props;

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            aria-labelledby="dialog-title"
            aria-describedby="dialog-content"
            maxWidth={maxWidth}
        >
            <DialogTitle id="dialog-title" className={styles.headerText}>
                {title}
            </DialogTitle>
            <Divider />
            <div className={styles.dialogCtn}>
                {children}
            </div>
        </Dialog>
    );
};

export default GenericDialog;