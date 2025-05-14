import React from "react";
import { useState, useRef, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useOutletContext } from "react-router-dom";
import { Card } from "react-bootstrap";
import axios from "axios";
import { userLogin } from "../utilities/LoginPageUtils";
import { photoarr } from "../utilities/photoarr";

export const user_api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1/user/",
});

export default function ManageAccount({ user, isOpen, setIsOpen }) {
  const context = useOutletContext();
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [pass, setPass] = useState("");
  const [userInfo, setUserInfo] = useState([]);
  const [photoArr, setPhotoArr] = useState([]);

  const shuffleArray = (array) => {
    const shuffled = array.slice(); // create a copy to avoid mutating original
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const grabinfo = async () => {
    if (user == false) return;
    let token = localStorage.getItem("token");
    if (token) {
      user_api.defaults.headers.common["Authorization"] = `token ${token}`;
      let response = await user_api.get("info/");
      return response;
    }
  };

  useEffect(() => {
    const shuffledPhotos = shuffleArray(photoarr);
    setPhotoArr(shuffledPhotos);
  }, [isOpen]);

  useEffect(() => {
    const grabData = async () => {
      const { data } = await grabinfo();
      setUserInfo(data);
      setFirst(data.first_name);
      setLast(data.last_name);
    };
    grabData();
  }, [isOpen, user]);

  const handleUpdate = async (e, info) => {
    e.preventDefault();
    let token = localStorage.getItem("token");
    if (token) {
      user_api.defaults.headers.common["Authorization"] = `token ${token}`;
      let response = await user_api.put("info/", {
        first_name: first,
        last_name: last,
      });
      alert(JSON.stringify(response["data"].message));
      setIsOpen(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    let token = localStorage.getItem("token");
    if (token) {
      user_api.defaults.headers.common["Authorization"] = `token ${token}`;
      let response = await user_api.put("info/", {
        password: pass,
      });
      alert(JSON.stringify(response["data"].message));
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800/60 z-50">
      <div className="border-4 border-[#091A55] m-0 p-0 h-auto">
        <Card
          className="w-[30rem] relative flex flex-col border-2 border-[#091A55] rounded-lg shadow-sm bg-white transition-transform duration-300"
        >
          <button
            className="absolute right-1 top-0 bg-blue-600 hover:bg-blue-700 hover:scale-110 text-white font-bold py-2 z-10 px-3 rounded shadow-md transition duration-300"
            onClick={() => setIsOpen(false)}
          >
            X
          </button>


          <div className="relative bg-[#091A55] h-12 mb-1">
            <img
              src="Logo.png"
              className="w-10 p-0 m-0 absolute top-1 left-1 hover:scale-125"
              alt="City Scope Logo"
            />
            <span className="block break-words text-center font-bold text-white text-3xl absolute bottom-1 right-1/4">
              {user.username}
            </span>
          </div>


          <div className="w-full h-72 relative overflow-hidden bg-white">

            <div className="absolute inset-0 flex items-center justify-center ">

              <div 
                className="w-full h-full border-2 border-[#091A55] absolute rotate-[-30deg] scale-[1.70] left-[-10%] bottom-[-8%] overflow-visible" 
              >

                <div className="flex h-1/3 mb-1">
                  <div className="border-2 border-white flex-1 overflow-hidden mx-0.5">
                    <img
                      src={photoArr[0]}
                      alt="Image 1"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="border-2 border-white flex-1 overflow-hidden mx-0.5">
                    <img
                      src={photoArr[1]}
                      alt="Image 2"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>


                <div className="flex h-1/3 mb-1">
                  <div className="border-2 border-white flex-1 overflow-hidden mx-0.5">
                    <img
                      src={photoArr[2]}
                      alt="Image 3"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="border-2 border-white flex-1 overflow-hidden mx-0.5">
                    <img
                      src={photoArr[3]}
                      alt="Image 4"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="border-2 border-white flex-1 overflow-hidden mx-0.5">
                    <img
                      src={photoArr[4]}
                      alt="Image 5"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>


                <div className="flex h-1/3">
                  <div className="border-2 border-white flex-1 overflow-hidden mx-0.5">
                    <img
                      src={photoArr[5]}
                      alt="Image 6"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="border-2 border-white flex-1 overflow-hidden mx-0.5">
                    <img
                      src={photoArr[6]}
                      alt="Image 7"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Card.Body className="flex flex-col gap-6 p-4">
            <form onSubmit={handleUpdate} className="flex flex-col gap-4">
              <div>
                <label className="font-semibold block mb-1 text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  className="border-2 border-blue-500 w-full p-2 rounded"
                  value={first}
                  onChange={(e) => setFirst(e.target.value)}
                  placeholder={userInfo?.first_name || ""}
                />
              </div>

              <div>
                <label className="font-semibold block mb-1 text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  className="border-2 border-blue-500 w-full p-2 rounded"
                  value={last}
                  onChange={(e) => setLast(e.target.value)}
                  placeholder={userInfo?.last_name || ""}
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-fit text-sm self-end bg-[#091A55] hover:bg-blue-700 text-white"
              >
                Update Info
              </Button>
            </form>


            <div className="border-t border-gray-300 pt-4">
              <label className="font-semibold block mb-1 text-gray-700">
                Change Password
              </label>
              <div className="flex gap-2">
                <input
                  type="password"
                  className="border-2 border-[#091A55] flex-grow p-2 rounded"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  maxLength={255}
                  placeholder="Enter new password"
                />
                <Button
                  variant="secondary"
                  className="text-sm bg-[#091A55] hover:bg-blue-600 text-white"
                  onClick={handleChangePassword}
                >
                  Update
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}