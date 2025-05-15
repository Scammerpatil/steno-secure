"use client";
import { User } from "@/types/User";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const SignUp = () => {
  const [formData, setFormData] = useState<User>({
    name: "",
    email: "",
    contact: "",
    profileImage: "",
    address: "",
    aadharCard: {
      number: "",
      image: "",
    },
    password: "",
    otp: "",
  });
  const [emailVerified, setEmailVerified] = useState(false);
  const [otp, setOtp] = useState();
  const [terms, setTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    console.log(formData);
    if (
      !formData.name ||
      !formData.contact ||
      !formData.email ||
      !formData.password ||
      !formData.address ||
      !formData.aadharCard.number ||
      !formData.profileImage ||
      !formData.aadharCard.image ||
      !terms ||
      !emailVerified
    ) {
      toast.error("Please fill all the fields");
      return;
    }
    console.log("Form Data:", formData);
    try {
      const response = axios.post("/api/auth/signup", { formData });
      toast.promise(response, {
        loading: "Creating Account",
        success: (data) => {
          router.push("/login");
          return data.data.message;
        },
        error: (err: any) => {
          console.log(err);
          return err.response?.data?.message || "Error creating account";
        },
      });
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Failed to create account");
    }
  };

  const uploadToCloudinary = async (
    file: File,
    folderName: string,
    imageName: string
  ) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    );
    formData.append("folder", folderName);
    formData.append("public_id", imageName);

    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env
        .NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!}/upload`,
      formData
    );
    return res;
  };

  const handleProfileImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    folderName: string,
    imageName: string,
    path: string
  ) => {
    if (!formData.name) {
      toast.error("Name is required for images");
      return;
    }
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB");
        return;
      }
      const imagePromise = uploadToCloudinary(file, folderName, imageName);
      toast.promise(imagePromise, {
        loading: "Uploading Image...",
        success: (data: AxiosResponse) => {
          setFormData({
            ...formData,
            [path]: data.data.secure_url,
          });
          return "Image Uploaded Successfully";
        },
        error: (err: unknown) => `This just happened: ${err}`,
      });
    }
  };
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    folderName: string,
    imageName: string,
    mainPath: "aadharCard",
    path: string
  ) => {
    if (!formData.name) {
      toast.error("Name is required for images");
      return;
    }
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB");
        return;
      }
      const imagePromise = uploadToCloudinary(file, folderName, imageName);
      toast.promise(imagePromise, {
        loading: "Uploading Image...",
        success: (data: AxiosResponse) => {
          setFormData({
            ...formData,
            [mainPath]: {
              ...formData[mainPath],
              [path]: data.data.secure_url,
            },
          });
          return "Image Uploaded Successfully";
        },
        error: (err: unknown) => `This just happened: ${err}`,
      });
    }
  };
  const verifyEmail = async () => {
    if (
      !formData.email ||
      !formData.email.includes("@") ||
      !formData.email.includes(".")
    ) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!formData.name) {
      toast.error("Please enter your name first");
      return;
    }
    try {
      const response = axios.post("/api/helper/verify-email", {
        name: formData.name,
        email: formData.email,
      });
      toast.promise(response, {
        loading: "Sending Email...",
        success: (data: AxiosResponse) => {
          (
            document.getElementById("otpContainer") as HTMLDialogElement
          ).showModal();
          setOtp(data.data.token);
          return "Email Sent!!";
        },
        error: (err) => err.data?.response.message || "Something went wrong",
      });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!!!");
    }
  };
  return (
    <div className="flex justify-center items-center w-full bg-base-200 px-5 py-5 min-h-[calc(100vh-5.6rem)]">
      <div className="xl:max-w-7xl bg-base-100 drop-shadow-xl border border-base-content/20 w-full rounded-md flex justify-between items-stretch px-5 xl:px-5 py-5">
        <div className="sm:w-[60%] lg:w-[50%] bg-cover bg-center items-center justify-center hidden md:flex ">
          <img src="login.png" alt="login" className="h-[500px]" />
        </div>
        <div className="mx-auto w-full lg:w-1/2 flex flex-col items-center justify-center md:p-10 md:py-0">
          <h1 className="text-center text-2xl sm:text-3xl font-semibold text-primary">
            Create Account
          </h1>
          <div className="w-full mt-5 sm:mt-8">
            <div className="mx-auto w-full sm:max-w-md md:max-w-lg flex flex-col gap-5">
              <input
                type="text"
                placeholder="Enter Your Name"
                className="input input-bordered input-primary w-full text-base-content placeholder:text-base-content/70"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                }}
              />
              <input
                type="text"
                placeholder="Enter Your Mobile Number"
                minLength={10}
                maxLength={10}
                className="input input-bordered input-primary w-full text-base-content placeholder:text-base-content/70"
                value={formData.contact}
                onChange={(e) => {
                  setFormData({ ...formData, contact: e.target.value });
                }}
              />
              <div className="flex flex-col sm:flex-row gap-3 text-base-content">
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  className="input input-bordered input-primary w-full text-base-content placeholder:text-base-content/70"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                  }}
                />
                <button
                  className="btn btn-outline btn-primary"
                  onClick={verifyEmail}
                  disabled={
                    emailVerified ||
                    !formData.email ||
                    !formData.email.includes("@") ||
                    !formData.email.includes(".")
                  }
                >
                  Verify Email
                </button>
              </div>

              <textarea
                placeholder="Enter Your Address"
                className="textarea textarea-bordered textarea-primary w-full text-base-content placeholder:text-base-content/70"
                value={formData.address}
                onChange={(e) => {
                  setFormData({ ...formData, address: e.target.value });
                }}
              ></textarea>

              <fieldset className="fieldset">
                <legend className="fieldset-legend text-base">
                  Profile Image
                </legend>
                <input
                  type="file"
                  className="file-input file-input-bordered file-input-primary w-full text-base-content"
                  accept="image/*"
                  onChange={(e) => {
                    handleProfileImageChange(
                      e,
                      "profileImage",
                      formData.name,
                      "profileImage"
                    );
                  }}
                />
              </fieldset>
              {/* Aadhaar Card Upload */}
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-base">
                  Aadhaar Card
                </legend>
                <input
                  type="text"
                  minLength={12}
                  maxLength={12}
                  placeholder="Aadhaar Number"
                  className="input input-bordered input-primary w-full text-base-content"
                  value={formData.aadharCard.number}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      aadharCard: {
                        ...formData.aadharCard,
                        number: e.target.value,
                      },
                    })
                  }
                />
                <input
                  type="file"
                  className="file-input file-input-bordered file-input-primary w-full mt-2 text-base-content"
                  accept="image/*,application/pdf"
                  onChange={(e) =>
                    handleFileChange(
                      e,
                      "aadhar",
                      formData.name,
                      "aadharCard",
                      "image"
                    )
                  }
                />
              </fieldset>

              <label className="input input-primary input-bordered w-full flex items-center gap-2">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Your Password"
                  className="w-full text-base-content placeholder:text-base-content/70"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                  }}
                />
                {showPassword ? (
                  <IconEyeOff
                    size={20}
                    className="cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                ) : (
                  <IconEye
                    size={20}
                    className="cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                )}
              </label>
              <div className="flex items-center gap-1.5  justify-start pl-2">
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <input
                      type="checkbox"
                      className="checkbox"
                      onChange={() => {
                        setTerms(!terms);
                      }}
                    />
                  </label>
                </div>
                <h3 className="flex items-center whitespace-nowrap text-base text-base-content">
                  I agree to the
                  <span className="text-primary">&nbsp;Terms</span>
                  &nbsp;and
                  <span className="text-primary">&nbsp;Privacy Policy</span>.
                </h3>
              </div>
              <div className="flex flex-col md:flex-row gap-2 md:gap-4 justify-center items-center">
                <button
                  className="btn btn-outline btn-primary btn-block max-w-[200px]"
                  onClick={handleSubmit}
                  disabled={
                    !formData.email ||
                    !formData.password ||
                    !formData.name ||
                    !formData.contact ||
                    !formData.address ||
                    !formData.aadharCard.number ||
                    !formData.profileImage ||
                    !formData.aadharCard.image ||
                    !terms
                  }
                >
                  Sign Up
                </button>
              </div>
              <p className="text-center mt-3 text-base text-base-content">
                Already have an account?{" "}
                <span
                  className="text-primary cursor-pointer"
                  onClick={() => router.push("/login")}
                >
                  Login
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <dialog id="otpContainer" className="modal">
        <div className="modal-box space-y-4">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-base-content">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg text-center text-base-content uppercase my-4">
            Please Enter The OTP
          </h3>
          <input
            type="text"
            placeholder="Enter Your OTP"
            className="input input-bordered input-primary w-full text-base-content placeholder:text-base-content/70"
            value={formData.otp}
            onChange={(e) => {
              setFormData({ ...formData, otp: e.target.value });
            }}
          />
          <button
            className="btn btn-primary w-full"
            onClick={(e) => {
              if (otp === formData.otp) {
                setEmailVerified(true);
                toast.success("OTP Verified");
                (
                  document.getElementById("otpContainer") as HTMLDialogElement
                ).close();
              } else {
                toast.error("Invalid OTP!!!");
              }
            }}
          >
            Verify
          </button>
        </div>
      </dialog>
    </div>
  );
};

export default SignUp;
