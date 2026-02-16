import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import { Link } from "react-router";
import SocialLogin from "../SocialLogin/SocialLogin";
import axios from "axios";

const Register = () => {
  const [profileImg, setProfileImg] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { createUser, updateUserProfile } = useAuth();

  const onSubmit = (data) => {
    console.log(data);
    createUser(data.email, data.password)
      .then((result) => {
        console.log(result.user);
        // Update userinfo in the database
        // Update user profile in firebase
        const userProfile = {
          displayName: data.name,
          photoURL: profileImg,
        };
        updateUserProfile(userProfile)
          .then(() => {
            console.log("profile name & image updated");
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    console.log(image);

    const formData = new FormData();
    formData.append("image", image);

    const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`;
    const res = await axios.post(imageUploadUrl, formData);
    setProfileImg(res.data.data.url);
  };

  return (
    <div className="hero bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <div className="card-body">
            <form onSubmit={handleSubmit(onSubmit)}>
              <fieldset className="fieldset">
                <h1 className="text-4xl font-bold">Create Account!</h1>
                {/* Name field */}
                <label className="label">Your Name</label>
                <input
                  type="text"
                  {...register("name", { required: true })}
                  className="input"
                  placeholder="Your Name"
                />
                {errors.name?.type === "required" && (
                  <p className="text-red-500">Name is required</p>
                )}
                {/* file upload field */}
                <label className="label">Your Picture</label>
                <input
                  type="file"
                  onChange={handleImageUpload}
                  className="input"
                  placeholder="Your Name"
                />
                {/* Email field */}
                <label className="label">Email</label>
                <input
                  type="email"
                  {...register("email", { required: true })}
                  className="input"
                  placeholder="Email"
                />
                {errors.email?.type === "required" && (
                  <p className="text-red-500">Email is required</p>
                )}
                {/* Password field */}
                <label className="label">Password</label>
                <input
                  type="password"
                  {...register("password", { required: true, minLength: 6 })}
                  className="input"
                  placeholder="Password"
                />
                {errors.password?.type === "required" && (
                  <p className="text-red-500">Password is required</p>
                )}
                {errors.password?.type === "minLength" && (
                  <p className="text-red-500">
                    Password must be 6 characters or longer
                  </p>
                )}

                <button className="btn btn-primary text-black mt-4">
                  Register
                </button>
              </fieldset>
              <p>
                Already have an account?
                <Link className="btn btn-link" to="/login">
                  Login
                </Link>
              </p>
            </form>
            <SocialLogin></SocialLogin>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
