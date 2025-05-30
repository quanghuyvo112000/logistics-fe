import { Alert, Container } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { UserInfo, UserInfoResponse } from "../../types/user.types";
import LoadingHandler from "../shared/loadingHandler";
import ProfileDisplay from "./ProfileDisplay";
import EditProfileModal from "./EditProfileModal";
import { getProfile } from "../../services/user";
import { localStorageHelper } from "../shared/localStorageHelper";
import ChangePasswordModal from "./ChangePasswordModal";

const UserProfileContainer: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isChangeModalOpen, setIsChangeModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<UserInfo>>({});

  const hasChecked = useRef(false);

  const loadUserProfile = async (
    showLoading: () => void,
    hideLoading: () => void
  ) => {
    try {
      if (hasChecked.current) return;
      hasChecked.current = true;
      showLoading();
      const response: UserInfoResponse = await getProfile();
      if (response.status === 200 && response.data) {
        setUserInfo(response.data);
        setFormData(response.data);
      } else {
        setError(response.message || "Failed to load user profile");
      }
    } catch (err) {
      console.error("Error loading profile:", err);
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    const isPasswordStr = localStorageHelper.getItem<string>("isPassword");
    const isPassword = isPasswordStr ? JSON.parse(isPasswordStr) : false;

    if (isPassword === true) {
      setIsChangeModalOpen(true);
    }
  }, []);

  const handleEditProfile = () => {
    if (userInfo) {
      setFormData({ ...userInfo });
    }
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
  };

  const handleOpenChangeModal = () => {
    setIsChangeModalOpen(true);
  };

  const handleCloseChangeModal = () => {
    setIsChangeModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <LoadingHandler>
      {(showLoading, hideLoading) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
          loadUserProfile(showLoading, hideLoading);
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        if (error) {
          return (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          );
        }

        if (!userInfo) {
          return null;
        }

        return (
          <Container maxWidth="lg">
            <ProfileDisplay
              userInfo={userInfo}
              onEditClick={handleEditProfile}
              onChangeClick={handleOpenChangeModal}
            />
            <EditProfileModal
              open={isEditModalOpen}
              onClose={handleCloseModal}
              formData={formData}
              onInputChange={handleInputChange}
              onSuccessUpdate={(updated) => setUserInfo(updated)}
            />
            <ChangePasswordModal
              open={isChangeModalOpen}
              onClose={handleCloseChangeModal}
            />
          </Container>
        );
      }}
    </LoadingHandler>
  );
};

export default UserProfileContainer;
