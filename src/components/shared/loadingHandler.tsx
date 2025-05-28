import { Backdrop } from "@mui/material";
import React, { useCallback, useState } from "react";
import { BackWheel, Car, CarContainer, FrontWheel, LoadingContainer, LoadingText, Road, RoadContainer, StyledBackdrop } from "./util";

interface CarLoadingHandlerProps {
  children: (
    showLoading: () => void,
    hideLoading: () => void,
    isLoading: boolean
  ) => React.ReactNode;
  loadingText?: string;
  backdropProps?: Partial<React.ComponentProps<typeof Backdrop>>;
}

const CarLoadingHandler: React.FC<CarLoadingHandlerProps> = ({ 
  children, 
  loadingText = "Đang tải...",
  backdropProps = {}
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const showLoading = useCallback((): void => {
    setLoading(true);
  }, []);

  const hideLoading = useCallback((): void => {
    setLoading(false);
  }, []);

  const carLoadingComponent = (
    <LoadingContainer>
      <RoadContainer>
        <Road />
        <CarContainer>
          <Car>
            <FrontWheel />
            <BackWheel />
          </Car>
        </CarContainer>
      </RoadContainer>
      <LoadingText variant="h6">
        {loadingText}
      </LoadingText>
    </LoadingContainer>
  );

  return (
    <>
      {children(showLoading, hideLoading, loading)}
      <StyledBackdrop
        open={loading}
        {...backdropProps}
      >
        {carLoadingComponent}
      </StyledBackdrop>
    </>
  );
};

export default CarLoadingHandler;