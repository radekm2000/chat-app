import {
  Avatar,
  Box,
  Button,
  Icon,
  IconButton,
  Input,
  InputLabel,
  Typography,
} from "@mui/material";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { uploadImage } from "../api/axios";
export const NotificationsNavbar = () => {
  const [isAvatarIconOpen, setIsAvatarIconOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [hasAvatar, setHasAvatar] = useState(false);
  console.log(isAvatarIconOpen);
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log(file);
      console.log(selectedFile);
      setSelectedFile(file);
    }
    e.target.value = null;
  };

  const uploadSelectedFile = (e) => {
    console.log("clicked");
    const formData = new FormData();
    if (selectedFile) {
      formData.append("avatar", selectedFile);
      const { mutate } = imageMutation;
      mutate(formData);
    }
    setSelectedFile(null);
    setIsAvatarIconOpen(false);
  };
  const imageMutation = useMutation({
    mutationFn: uploadImage,
    onSuccess: () => {
      toast.success("Image uploaded");
    },
    onError: () => {
      toast.error("Image uploading failed");
    },
  });
  return (
    <Box
      sx={{
        borderBottom: "1px solid rgb(40, 40, 40)",
        justifyContent: "flex-start",
        alignItems: "center",
        display: "flex",
        padding: "8px 16px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        <IconButton onClick={() => setIsAvatarIconOpen(!isAvatarIconOpen)}>
          <AccountCircleRoundedIcon
            sx={{
              height: "64px",
              width: "64px",
              color: "white",
            }}
          />
        </IconButton>
        <Box
          sx={{
            display: "column",
          }}
        >
          {isAvatarIconOpen && (
            <>
              <InputLabel
                htmlFor="avatar"
                className="avatar"
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "lightgrey",
                    opacity: "0.8",
                    borderRadius: "6px",
                  },
                  fontFamily: "Readex Pro",
                  fontSize: "1rem",
                  color: "white",
                  fontWeight: "300",
                  lineHeight: "1.5",
                  justifyContent: "center",
                  padding: "8px 16px",
                  marginLeft: "8px",
                  borderRadius: "6px",
                  backgroundColor: "lightgrey",
                }}
              >
                Set an avatar
                <Input
                  id="avatar"
                  name="avatar"
                  type="file"
                  style={{ display: "none" }}
                  onChange={(e) => handleFileInputChange(e)}
                />
              </InputLabel>
            </>
          )}
          {selectedFile && (
            <Button
              type="submit"
              variant="contained"
              sx={{
                opacity: "0.9",
                borderRadius: "6px",
                fontFamily: "Readex Pro",
                fontSize: "0.75rem",
                color: "white",
                fontWeight: "300",
                marginLeft: "8px",
                marginTop: "8px",
              }}
              onClick={uploadSelectedFile}
            >
              Upload
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};
export default NotificationsNavbar;
