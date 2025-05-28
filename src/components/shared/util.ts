import { Backdrop, Box, Typography } from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";

// Animation cho xe chạy
export const carMove = keyframes`
  0% {
    transform: translateX(-100px);
  }
  100% {
    transform: translateX(calc(100vw + 100px));
  }
`;

// Animation cho bánh xe quay
export const wheelSpin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

// Animation cho đường kẻ di chuyển
export const roadMove = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100px);
  }
`;

// Styled components
export const StyledBackdrop = styled(Backdrop)(({ theme }) => ({
  color: theme.palette.common.white,
  zIndex: theme.zIndex.modal + 1,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
}));

export const LoadingContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '2rem',
  width: '100%',
});

export const RoadContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  height: '150px',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const Road = styled('div')({
  position: 'absolute',
  bottom: '30px',
  width: '200%',
  height: '4px',
  background: 'repeating-linear-gradient(to right, #fff 0px, #fff 40px, transparent 40px, transparent 80px)',
  animation: `${roadMove} 1s linear infinite`,
});

export const CarContainer = styled('div')({
  position: 'relative',
  animation: `${carMove} 3s ease-in-out infinite`,
  zIndex: 1,
});

export const Car = styled('div')({
  width: '80px',
  height: '35px',
  background: '#3f51b5',
  borderRadius: '10px 10px 5px 5px',
  position: 'relative',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-15px',
    left: '15px',
    width: '35px',
    height: '15px',
    background: '#1976d2',
    borderRadius: '8px 8px 0 0',
  },
  
  // Cửa sổ xe
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '-12px',
    left: '18px',
    width: '12px',
    height: '8px',
    background: '#90caf9',
    borderRadius: '2px',
    boxShadow: '15px 0 0 #90caf9',
  }
});

export const Wheel = styled('div')({
  width: '16px',
  height: '16px',
  background: '#424242',
  borderRadius: '50%',
  position: 'absolute',
  bottom: '-8px',
  animation: `${wheelSpin} 0.3s linear infinite`,
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '8px',
    height: '8px',
    background: '#616161',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
  }
});

export const FrontWheel = styled(Wheel)({
  right: '8px',
});

export const BackWheel = styled(Wheel)({
  left: '8px',
});

export const LoadingText = styled(Typography)(({ theme }) => ({
  color: theme.palette.common.white,
  fontWeight: 500,
  textAlign: 'center',
  marginTop: theme.spacing(2),
}));