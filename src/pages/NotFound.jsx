import { Link as RouterLink } from "react-router-dom";
import { Box, Button } from "@mui/material";
import { EmptyState } from "../components/ui";

export default function NotFound() {
  return (
    <Box sx={{ minHeight: "100dvh", display: "grid", placeItems: "center" }}>
      <EmptyState
        emoji="🥄"
        title="This plate is empty"
        text="The page you're looking for doesn't exist."
        action={
          <Button variant="contained" component={RouterLink} to="/">
            Back home
          </Button>
        }
      />
    </Box>
  );
}
