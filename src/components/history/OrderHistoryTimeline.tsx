import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from "@mui/lab";
import { Paper, Typography, useMediaQuery, useTheme } from "@mui/material";
import type React from "react";
import { OrderHistoryItem } from "../../types/history";
import { getStatusIcon, getStatusLabel, statusColorMap } from "./util";

interface Props {
  histories: OrderHistoryItem[];
}

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const OrderHistoryTimeline: React.FC<Props> = ({ histories }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Timeline
      position={isMobile ? "right" : "alternate"}
      sx={{ p: 0, maxWidth: "900px", mx: "auto" }}
    >
      {[...histories].reverse().map((item, index) => {
        const StatusIcon = getStatusIcon(item.status);
        return (
          <TimelineItem key={index}>
            {!isMobile && (
              <TimelineOppositeContent
                color="text.secondary"
                sx={{ m: "auto 0" }}
              >
                <Typography
                  variant="body1"
                  fontWeight="medium"
                  sx={{ fontSize: "1rem" }}
                >
                  {formatTimestamp(item.timestamp)}
                </Typography>
              </TimelineOppositeContent>
            )}
            <TimelineSeparator>
              <TimelineDot
                color={statusColorMap[item.status] || "grey"}
                sx={{
                  p: { xs: 1, md: 1.2 },
                  transition: "transform 0.2s ease",
                  "&:hover": {
                    transform: "scale(1.2)",
                  },
                }}
              >
                <StatusIcon size={isMobile ? 16 : 20} />
              </TimelineDot>
              {index !== histories.length - 1 && (
                <TimelineConnector sx={{ height: { xs: 40, md: 60 } }} />
              )}
            </TimelineSeparator>
            <TimelineContent sx={{ m: "auto 0", py: 1 }}>
              <Paper
                elevation={2}
                sx={{
                  p: { xs: 2, md: 3 },
                  bgcolor: "background.default",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: 4,
                  },
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{ fontSize: { xs: "1rem", md: "1.1rem" } }}
                >
                  {getStatusLabel(item.status)}
                </Typography>

                {isMobile && (
                  <Typography variant="body2" color="text.secondary">
                    {formatTimestamp(item.timestamp)}
                  </Typography>
                )}
              </Paper>
            </TimelineContent>
          </TimelineItem>
        );
      })}
    </Timeline>
  );
};

export default OrderHistoryTimeline;
