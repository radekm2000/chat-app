import { Box, Button, IconButton, Input, InputLabel } from "@mui/material";
import { Image } from "mui-image";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { uploadImage } from "../api/axios";
import { useAxiosAuthorized } from "../hooks/useAxiosAuthorized";
export const NotificationsNavbar = () => {
  const [isAvatarIconOpen, setIsAvatarIconOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [hasAvatar, setHasAvatar] = useState(false);
  const axiosAuthorized = useAxiosAuthorized();

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log(file);
      console.log(selectedFile);
      setSelectedFile(file);
    }
    e.target.value = null;
  };

  const { data: userImage, refetch } = useQuery({
    queryKey: ["user/avatar"],
    queryFn: async () => {
      const response = await axiosAuthorized.get("avatars/avatar");
      return response.data;
    },
    retry: false,
  });

  useEffect(() => {
    if (userImage) setHasAvatar(true);
  }, [hasAvatar, userImage]);

  const uploadSelectedFile = (e) => {
    const formData = new FormData();
    if (selectedFile) {
      formData.append("avatar", selectedFile);
      const { mutate } = imageMutation;
      mutate(formData);
    }
    setHasAvatar(false);
    setSelectedFile(null);
    setIsAvatarIconOpen(false);
  };
  const imageMutation = useMutation({
    mutationFn: uploadImage,
    onSuccess: () => {
      toast.success("Image uploaded");
      refetch();
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
        {hasAvatar ? (
          <IconButton onClick={() => setIsAvatarIconOpen(!isAvatarIconOpen)}>
            <Image
              src={userImage}
              width={64}
              height={64}
              alt="userAvatar"
              style={{ borderRadius: "50%" }}
            />
          </IconButton>
        ) : (
          <IconButton onClick={() => setIsAvatarIconOpen(!isAvatarIconOpen)}>
            <AccountCircleRoundedIcon
              sx={{
                height: "64px",
                width: "64px",
                color: "white",
              }}
            />
          </IconButton>
        )}

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
