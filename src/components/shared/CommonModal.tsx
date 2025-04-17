import React, { ReactNode } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  styled
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface CommonModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
  actions?: ReactNode;
  disableActions?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
  fullScreen?: boolean;
  hideCloseIcon?: boolean;
  loading?: boolean,
}

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: `1px solid ${theme.palette.divider}`
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`
}));

const CommonModal: React.FC<CommonModalProps> = ({
  open,
  onClose,
  title,
  children,
  maxWidth = "sm",
  actions,
  disableActions = false,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "primary",
  fullScreen = false,
  hideCloseIcon = false
}) => {
  const theme = useTheme();
  const fullScreenOnMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  // Use either the specified fullScreen value or automatically switch to fullScreen on mobile
  const isFullScreen = fullScreen || fullScreenOnMobile;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      fullScreen={isFullScreen}
      aria-labelledby="common-modal-title"
    >
      <StyledDialogTitle id="common-modal-title">
        <Typography variant="h6" component="div">
          {title}
        </Typography>
        {!hideCloseIcon && (
          <IconButton
            aria-label="close"
            onClick={onClose}
            size="small"
            edge="end"
          >
            <CloseIcon />
          </IconButton>
        )}
      </StyledDialogTitle>
      
      <StyledDialogContent dividers>
        {children}
      </StyledDialogContent>
      
      {!disableActions && (
        <StyledDialogActions>
          {actions ? (
            actions
          ) : (
            <>
              <Button onClick={handleCancel} color="inherit">
                {cancelText}
              </Button>
              <Button onClick={handleConfirm} color={confirmColor} variant="contained" autoFocus>
                {confirmText}
              </Button>
            </>
          )}
        </StyledDialogActions>
      )}
    </Dialog>
  );
};

export default CommonModal;