import {
  Avatar,
  Box,
  Button,
  Icon,
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
  const fileInputRef = useRef(null);
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log(file);
      console.log(selectedFile);
      setSelectedFile(file);
    }
  };
  const handleSetAvatarClick = (e) => {
    e.preventDefault();
    console.log("avatar clicked");
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const uploadSelectedFile = (e) => {
    const formData = new FormData();
    if (selectedFile) {
      formData.append("avatar", selectedFile);
      const { mutate } = imageMutation;
      mutate(formData);
    }
    setSelectedFile(null);
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
        onClick={() => setIsAvatarIconOpen(!isAvatarIconOpen)}
      >
        <AccountCircleRoundedIcon
          onClick={(e) => handleSetAvatarClick(e)}
          sx={{
            height: "64px",
            width: "64px",
            color: "white",
          }}
        />
        {isAvatarIconOpen && (
          <Box
            sx={{
              display: "column",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#808080",
              padding: "8px 16px",
              width: "fit-content",
              marginLeft: "8px",
              borderRadius: "6px",
            }}
          >
            <InputLabel
              htmlFor="avatar"
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
              }}
            >
              Set an avatar
            </InputLabel>
            <Input
              id="avatar"
              name="file"
              type="file"
              style={{ display: "none" }}
              onChange={handleFileInputChange}
            />

            <Button
              variant="contained"
              sx={{
                opacity: "0.9",
                borderRadius: "6px",
                fontFamily: "Readex Pro",
                fontSize: "0.75rem",
                color: "white",
                fontWeight: "300",
              }}
              onClick={uploadSelectedFile}
            >
              Upload
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};
export default NotificationsNavbar;
