/* eslint-disable react-refresh/only-export-components */
// components/common/LoadingHandler.tsx
import React from "react";
import ReactDOM from "react-dom";
import {
  BackWheel,
  Car,
  CarContainer,
  FrontWheel,
  LoadingContainer,
  LoadingText,
  Road,
  RoadContainer,
  StyledBackdrop
} from "./util";

let container: HTMLDivElement | null = null;

export const showLoading = (text = "Đang tải...") => {
  if (container) return; // Đã hiển thị thì bỏ qua
  container = document.createElement("div");
  document.body.appendChild(container);
  ReactDOM.render(<LoadingHandler loadingText={text} />, container);
};

export const hideLoading = () => {
  if (container) {
    ReactDOM.unmountComponentAtNode(container);
    document.body.removeChild(container);
    container = null;
  }
};

interface LoadingHandlerProps {
  loadingText?: string;
}

const LoadingHandler: React.FC<LoadingHandlerProps> = ({ loadingText = "Đang tải..." }) => {
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
    <StyledBackdrop open>
      {carLoadingComponent}
    </StyledBackdrop>
  );
};

export default LoadingHandler;
