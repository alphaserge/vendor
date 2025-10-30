import React from "react";
import { Box, Typography } from "@mui/material";

export const Fieldset = ({ title, children, ...props }) => {
      return (
        <Box
          component="fieldset" // Render Box as a fieldset HTML element
          sx={{
            border: "1px solid #ccc", // Basic border for the fieldset
            //borderColor: "divider", // Use MUI theme's divider color
            borderRadius: 1, // Slight border-radius
            padding: 4, // Internal padding
            margin: 1, // External margin
            display: "flex",
            flexDirection: "column"
          }}
          {...props}
        >
          {title && (
            <Typography
              component="legend" // Render Typography as a legend HTML element
              variant="subtitle1" // Style the caption
              sx={{
                paddingX: 1, // Padding around the legend text
                color: "text.primary", // Use MUI theme's primary text color
              }}
            >
              {title}
            </Typography>
          )}
          {children}
        </Box>
      );
    };