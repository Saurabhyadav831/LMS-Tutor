"use client";
import React, { FC, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { navItemsData } from "@/app/utils/NavItems";
import { ThemeSwitcher } from "@/app/utils/ThemeSwitcher";
import CustomModal from "@/app/utils/CustomModal";
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";
import Verification from "./Auth/Verification";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useGetAllNotificationsQuery, useUpdateNotificationStatusMutation } from "@/redux/features/notifications/notificationsApi";
import socketIO from "socket.io-client";
import { format } from "timeago.js";

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

type Props = {
  activeItem: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  route: string;
  setRoute: (route: string) => void;
};

const Header: FC<Props> = ({ activeItem, open, setOpen, route, setRoute }) => {
  const { user } = useSelector((state: any) => state.auth);
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { data, refetch } = useGetAllNotificationsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [updateNotificationStatus, { isSuccess }] = useUpdateNotificationStatusMutation();
  const [notifications, setNotifications] = useState<any>([]);
  const [audio] = useState<any>(
    typeof window !== "undefined" &&
      new Audio(
        "https://res.cloudinary.com/dkg6jv4l0/video/upload/v1716750964/notification_jvwqd0.mp3"
      )
  );

  React.useEffect(() => {
    if (data) {
      setNotifications(
        data.notifications.filter((item: any) => item.status === "unread")
      );
    }
    if (isSuccess) {
      refetch();
    }
    if (audio) audio.load();
  }, [data, isSuccess, audio]);

  React.useEffect(() => {
    socketId.on("newNotification", (data) => {
      refetch();
      if (audio) audio.play();
    });
  }, [refetch, audio]);

  const handleNotificationStatusChange = async (id: string) => {
    await updateNotificationStatus(id);
  };

  const handleLogout = () => {
    // Add logout logic here if needed
    router.push("/");
  };

  return (
    <>
      <div className="w-full flex items-center justify-between p-6 fixed top-5 left-0 z-[9999999] bg-white dark:bg-[#111C43] shadow-sm">
        <div className="flex items-center">
          <div className="text-[25px] font-Poppins font-[500] text-black dark:text-white">
            ELearning
          </div>
        </div>
        
        <div className="hidden 800px:flex items-center">
          {navItemsData.map((item, index) => (
            <span
              key={index}
              className={`${
                activeItem === index
                  ? "dark:text-[#37a39a] text-[crimson]"
                  : "dark:text-white text-black"
              } text-[18px] px-6 font-Poppins font-[400] cursor-pointer`}
              onClick={() => router.push(item.url)}
            >
              {item.name}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          
          {user && (
            <div className="relative cursor-pointer m-2" onClick={() => setOpen(!open)}>
              <IoMdNotificationsOutline className="text-2xl cursor-pointer dark:text-white text-black" />
              <span className="absolute -top-2 -right-2 bg-[#3ccba0] rounded-full w-[20px] h-[20px] text-[12px] flex items-center justify-center text-white">
                {notifications && notifications.length}
              </span>
            </div>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-black dark:text-white">{user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-[#37a39a] text-white px-4 py-2 rounded-md hover:bg-[#2d8a7a] transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsOpen(true)}
              className="bg-[#37a39a] text-white px-4 py-2 rounded-md hover:bg-[#2d8a7a] transition-colors"
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* Notifications Dropdown */}
      {open && user && (
        <div className="w-[350px] h-[60vh] overflow-y-scroll py-3 px-2 border border-[#ffffff0c] dark:bg-[#111C43] bg-white shadow-xl absolute top-20 right-6 z-[1000000000] rounded">
          <h5 className="text-center text-[20px] font-Poppins text-black dark:text-white p-3">
            Notifications
          </h5>
          {notifications &&
            notifications.map((item: any, index: number) => (
              <div
                className="dark:bg-[#2d3a4e] bg-[#00000013] font-Poppins border-b dark:border-b-[#ffffff47] border-b-[#0000000f]"
                key={index}
              >
                <div className="w-full flex items-center justify-between p-2">
                  <p className="text-black dark:text-white">{item.title}</p>
                  <p
                    className="text-black dark:text-white cursor-pointer"
                    onClick={() => handleNotificationStatusChange(item._id)}
                  >
                    Mark as read
                  </p>
                </div>
                <p className="px-2 text-black dark:text-white">
                  {item.message}
                </p>
                <p className="p-2 text-black dark:text-white text-[14px]">
                  {format(item.createdAt)}
                </p>
              </div>
            ))}
        </div>
      )}

      {/* Authentication Modal */}
      {isOpen && (
        <CustomModal
          open={isOpen}
          setOpen={setIsOpen}
          activeItem={activeItem}
          setRoute={setRoute}
          component={route === "Login" ? Login : route === "Sign-up" ? SignUp : Verification}
          refetch={null}
        />
      )}
    </>
  );
};

export default Header;
