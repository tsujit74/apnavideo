import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import HomeIcon from "@mui/icons-material/Home";
import "../styles/history.css"

import { IconButton } from "@mui/material";
export default function History() {
  const { getHistoryOfUser } = useContext(AuthContext);
  const [meetings, setMeetings] = useState([]);
  const routeTo = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await getHistoryOfUser();
        setMeetings(Array.isArray(history) ? history : []); // Ensure it's an array
      } catch {
        console.error('Failed to fetch meeting history');
        // Implement snackbar notification for error handling
      }
    };

    fetchHistory();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="historyPage">
      <IconButton
        style={{ color: 'white' }}
        onClick={() => routeTo('/home')}
      >
        <HomeIcon sx={{ color: 'black' }} />
      </IconButton>
      {meetings.length > 0 ? (
        meetings.map((meeting, index) => (
          <Card key={index} variant="outlined" style={{ margin: '10px' }}>
            <CardContent>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
                style={{ textAlign: 'left' }}
              >
                Code: {meeting.meetingCode}
              </Typography>
              <Typography
                sx={{ mb: 1.5 }}
                color="text.secondary"
                style={{ textAlign: 'left' }}
              >
                Date: {formatDate(meeting.date)}
              </Typography>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography
          variant="h6"
          color="text.secondary"
          style={{ textAlign: 'center', marginTop: '20px' }}
        >
          No meeting history available.
        </Typography>
      )}
    </div>
  );
}