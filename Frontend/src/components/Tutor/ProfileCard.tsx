// ProfileCard.tsx
import React from "react";

interface ProfileCardProps {
  profileUrl: string;
  name: string;
  email: string;
  followers: number;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  profileUrl,
  name,
  email,
  followers,
}) => {
  return (
    <div className="h-52 mt-5 ml-2 w-[650px] border border-black shadow-lg rounded-md px-5 py-4">
      <h1 className="font-semibold text-lg">Profile Card</h1>
      <div className="flex w-full h-full mt-3 gap-5">
        {/* Image Container */}
        <div className="w-1/4 h-3/4 flex items-center justify-center">
          <img
            src={profileUrl}
            className="object-cover rounded-full h-28 w-28"
            alt="Profile"
          />
        </div>

        {/* Details Container */}
        <div className="w-3/4 h-3/4 bg-gradient-to-r from-stone-300 to-stone-400 p-3 rounded-md flex flex-col justify-between py-5">
          <p className="font-semibold text-lg">{name}</p>
          <p className="text-sm text-gray-700">{email}</p>
          <p className="text-sm font-bold flex">
            Followers : <span>{followers || 0}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;