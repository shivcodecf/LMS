import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Camera } from "lucide-react";
import React, { useEffect, useState } from "react";
import Course from "./Course";
import {
  useLoadUserQuery,
  useUpdateUserMutation,
} from "@/features/api/authApi";
import { toast } from "sonner";
import { Link } from "react-router-dom";

/**
 * Professional Profile page
 * - Only name + photo editable (via dialog)
 * - Responsive, modern card, role badge, stats
 */

const Profile = () => {
  const { data, isLoading, refetch } = useLoadUserQuery();
  const [
    updateUser,
    {
      data: updateUserData,
      isLoading: updateLoading,
      isError,
      error,
      isSuccess,
    },
  ] = useUpdateUserMutation();

  // Edit dialog state
  const [isEditOpen, setIsEditOpen] = useState(false);

  // editable fields
  const [name, setName] = useState("");
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    // fetch fresh user data on mount
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const u = data?.user;
    if (u) {
      setName(u.name || "");
      setPreviewUrl(u.photoUrl || "");
    }
  }, [data]);

  useEffect(() => {
    if (!profilePhotoFile) return;
    const url = URL.createObjectURL(profilePhotoFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [profilePhotoFile]);

  useEffect(() => {
    if (isSuccess) {
      toast.success(updateUserData?.message || "Profile updated.");
      refetch();
      setIsEditOpen(false);
      setProfilePhotoFile(null);
    }
    if (isError) {
      toast.error(error?.message || "Failed to update profile.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin h-6 w-6 text-gray-600" />
      </div>
    );
  }

  const user = data?.user;
  if (!user) {
    return (
      <div className="p-6">
        <p className="text-center text-gray-500">No user data found.</p>
      </div>
    );
  }

  const totalCourses = Array.isArray(user.enrolledCourses)
    ? user.enrolledCourses.length
    : 0;
  const roleLabel = (user.role || "user").toUpperCase();

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfilePhotoFile(file);
  };

  const onSave = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    const formData = new FormData();
    formData.append("name", name.trim());
    if (profilePhotoFile) formData.append("profilePhoto", profilePhotoFile);
    await updateUser(formData);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Page header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Profile
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your account details and enrolled courses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-gray-500">Enrolled</p>
            <p className="text-lg font-semibold">{totalCourses}</p>
          </div>

          {/* ------------------ EDIT PROFILE DIALOG (REPLACE CURRENT DialogContent) ------------------ */}
          {/* ---------- Edit Profile Dialog (clean, centered) ---------- */}
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsEditOpen(true)}>Edit Profile</Button>
            </DialogTrigger>

            <DialogContent
              className="
      sm:max-w-md 
      w-full 
      rounded-lg 
      p-6 
      bg-white 
      dark:bg-slate-900 
      shadow-xl 
      border 
      border-gray-200 
      dark:border-slate-700
    "
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Edit Profile</h3>
                  <p className="text-sm text-gray-500">
                    Change your display name and profile photo.
                  </p>
                </div>

                <button
                  onClick={() => setIsEditOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-md p-1"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div className="mt-5 space-y-6">
                {/* Avatar */}
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <Avatar className="h-24 w-24 ring-2 ring-offset-2 ring-gray-200 dark:ring-slate-800">
                      <AvatarImage src={previewUrl || user.photoUrl} />
                      <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                    </Avatar>

                    <label
                      htmlFor="photo-upload"
                      className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-800 border rounded-full p-1 shadow cursor-pointer"
                    >
                      <Camera className="h-4 w-4" />
                    </label>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) setProfilePhotoFile(f);
                      }}
                    />
                  </div>

                  <p className="mt-2 text-xs text-gray-500">
                    Click the camera icon to change your photo
                  </p>
                </div>

                {/* Name Input */}
                <div>
                  <Label className="mb-2 block">Display name</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your display name"
                    className="w-full"
                    autoFocus
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 flex items-center justify-end gap-3">
                <Button variant="ghost" onClick={() => setIsEditOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={onSave} disabled={updateLoading}>
                  {updateLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Saving...
                    </>
                  ) : (
                    "Save changes"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* ---------- end dialog ---------- */}

          {/* ------------------ end dialog ------------------ */}

          {/* small-screen edit button */}
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogTrigger asChild>
              <Button className="inline-flex sm:hidden">Edit</Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      {/* Profile card */}
      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-6 items-start">
          {/* Left column: avatar & meta */}
          <div className="flex flex-col items-center md:items-start">
            <Avatar className="h-32 w-32 ring-2 ring-offset-2 ring-gray-100 dark:ring-slate-800">
              <AvatarImage src={user.photoUrl || previewUrl} />
              <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
            </Avatar>

            <p className="mt-3 text-sm text-gray-500">
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Right column: details */}
          <div className="min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-2xl font-semibold leading-tight truncate">
                  {user.name}
                </h2>
                <p className="text-sm text-gray-500 mt-1 truncate">
                  {user.email}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 text-xs font-medium bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-full">
                    {roleLabel}
                  </span>

                  <div className="h-8 flex items-center px-3 rounded-full bg-white border border-gray-200">
                    <span className="text-sm text-gray-600">Courses</span>
                    <span className="ml-2 text-sm font-semibold">
                      {totalCourses}
                    </span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 hidden md:flex flex-col items-end">
                <Button onClick={() => setIsEditOpen(true)}>
                  Edit Profile
                </Button>
                <Button variant="ghost" className="mt-2">
                  View Activity
                </Button>
              </div>
            </div>

            <div className="mt-6 text-sm text-gray-700 dark:text-gray-300">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Bio</h3>
              <p className="text-base">{user.bio || "No bio added yet."}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enrolled courses */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4">
          Courses You're Enrolled In
        </h3>

        {totalCourses === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 p-8 text-center shadow-sm">
            <p className="text-gray-500 mb-4">
              You have not enrolled in any courses yet.
            </p>
            <div className="flex justify-center">
              <Link to={`/course/search?query`}>
                <Button>Browse Courses</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {user.enrolledCourses.map((course) => (
              <Course key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
