import { Grid, Typography, styled } from "@mui/material"

const DayHeader = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: "center",
  fontWeight: "bold",
}))

interface WeekDaysHeaderProps {
  weekDays: string[]
}

export const WeekDaysHeader = ({ weekDays }: WeekDaysHeaderProps) => {
  return (
    <Grid container>
      {weekDays.map((day, index) => (
        <Grid size={{ xs: 12 / 7}} key={index}>
          <DayHeader variant="subtitle2" sx={{ color: index === 0 ? "error.main" : "inherit" }}>
            {day}
          </DayHeader>
        </Grid>
      ))}
    </Grid>
  )
}
