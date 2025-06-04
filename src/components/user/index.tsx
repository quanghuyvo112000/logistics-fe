/* eslint-disable react-refresh/only-export-components */
import { Alert, Container } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { UserInfo, UserInfoResponse } from "../../types/user.types";
import ProfileDisplay from "./ProfileDisplay";
import EditProfileModal from "./EditProfileModal";
import { getProfile } from "../../services/user";
import { localStorageHelper } from "../shared/localStorageHelper";
import ChangePasswordModal from "./ChangePasswordModal";
import { showLoading, hideLoading } from "../shared/loadingHandler";

const UserProfileContainer: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isChangeModalOpen, setIsChangeModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<UserInfo>>({});
  const hasChecked = useRef(false);

  const loadUserProfile = async () => {
    try {
      showLoading("Đang tải thông tin người dùng...");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (hasChecked.current) return;
      hasChecked.current = true;
      const response: UserInfoResponse = await getProfile();
      if (response.status === 200 && response.data) {
        setUserInfo(response.data);
        setFormData(response.data);
      } else {
        setError(response.message || "Không thể tải thông tin người dùng");
      }
    } catch (err) {
      console.error("Error loading profile:", err);
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi bất ngờ");
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    loadUserProfile();
  }, []);

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

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!userInfo) {
    return null; // sẽ hiển thị loading overlay
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
};

export default UserProfileContainer;
