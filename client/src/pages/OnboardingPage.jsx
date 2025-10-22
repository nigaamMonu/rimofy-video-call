import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useState } from "react";
import { ShuffleIcon, CameraIcon, MapPinIcon, ShipWheelIcon, LoaderIcon } from "lucide-react";

// local imports
import useAuthUser from "../hooks/useAuthUser.js";
import { completeOnboarding } from "../lib/api";

import { LANGUAGES } from "../constants/index";

const OnboardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Onboarding completed successfully!");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError:(error)=>{
      toast.error(error?.response?.data?.message || "Something went wrong!");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formState);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleRandomAvatar = () => {
    // generate random number between 1 to 100
    const idx = Math.floor(Math.random()*100)+1;
    const avatarUrl = `https://avatar.iran.liara.run/public/${idx}.png`;

    setFormState({...formState, profilePic: avatarUrl});
    toast.success("Random avatar generated!");
  };
  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card bg-base-200 w-ful max-w-3xl shadow-xl">
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
            Complete Your Profile
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile pic container */}
            <div className="flex flex-col items-center justify-center space-y-4">
              {/* image preview */}
              <div className="size-32 rounded-full bg-base-300 overflow-hidden ">
                {formState.profilePic ? (
                  <img
                    src={formState.profilePic}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className="size-12 text-base-content opacity-40" />
                  </div>
                )}
              </div>

              {/* Generate Random Avatar BTN */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRandomAvatar}
                  className="btn btn-accent rounded-xl"
                >
                  <ShuffleIcon className="size-4 mr-2" />
                  Generate Random Avatar
                </button>
              </div>
            </div>
            {/* Full Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formState.fullName}
                onChange={handleChange}
                className="input input-bordered rounded-xl w-full"
                placeholder="Your full name"
              />
            </div>

            {/* Bio */}
            <div className="form-control ">
              <label className="label">
                <span className="lebel-text">Bio</span>
              </label>
              <textarea
                name="bio"
                value={formState.bio}
                onChange={handleChange}
                className="textarea rounded-xl textarea-bordered h-24 w-full"
                placeholder="Tell others about yourself and your language learning goal."
              ></textarea>
            </div>

            {/* language */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Native Language */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Native Language</span>
                </label>
                <select
                  name="nativeLanguage"
                  value={formState.nativeLanguage}
                  onChange={handleChange}
                  className="select select-bordered rounded-xl w-full"
                >
                  <option value="">Select your native language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`native-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              {/* Learning language */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Learing Language</span>
                </label>
                <select
                  name="learningLanguage"
                  value={formState.learningLanguage}
                  onChange={handleChange}
                  className="select select-bordered w-full rounded-xl"
                >
                  <option value="">Select your learning language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`native-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* Loacation */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <div className="relative">
                <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
                <input
                  type="text"
                  name="location"
                  value={formState.location}
                  onChange={handleChange}
                  className="input input-bordered rounded-xl w-full pl-10"
                  placeholder="City, Country"
                />
              </div>
            </div>

            {/* Submit button */}
            <button className="btn btn-primary w-full" disabled={isPending} type="submit">
              {isPending ?(
                <>
                  <LoaderIcon className="animate-spin size-5 mr-2"/>
                  Onboarding...
                </>
              ):(
                <>
                  <ShipWheelIcon className="size-5 mr-2" />
                  Complete Onboarding
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
