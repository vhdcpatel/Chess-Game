import React from 'react';
import { Dialog, DialogTitle, Divider } from '@mui/material';
import styles from './GenericDialogStyles.module.css';

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
            slotProps={{
                paper: {
                    className: styles.dialogPaper
                }
            }}
        >
            <DialogTitle id="dialog-title">
                {title}
            </DialogTitle>
            <Divider />
            <div>
                {children}
            </div>
        </Dialog>
    );
};

export default GenericDialog;