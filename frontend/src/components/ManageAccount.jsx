import React from "react";
import { useState, useRef, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useOutletContext } from "react-router-dom";
import { Card } from "react-bootstrap";
import axios from "axios";
import { userLogin } from "../utilities/LoginPageUtils";

export const user_api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1/user/",
});

export default function ManageAccount({ user, isOpen, setIsOpen }) {
  const context = useOutletContext();
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [pass, setPass] = useState("");
  const [userInfo, setUserInfo] = useState([]);

  const grabinfo = async () => {
    let token = localStorage.getItem("token");
    if (token) {
      user_api.defaults.headers.common["Authorization"] = `token ${token}`;
      let response = await user_api.get("info/");
      return response;
    }
  };

  useEffect(() => {
    const grabData = async () => {
      const { data } = await grabinfo();
      setUserInfo(data);
      setFirst(data.first_name);
      setLast(data.last_name);
      // console.log(data)
    };
    grabData();
  }, []);

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
      <Card
        style={{ width: "30rem" }}
        className="relative flex flex-col border border-gray-300 rounded-lg shadow-sm bg-white transition-transform duration-300"
      >
        <button
          className="absolute right-1 top-0 bg-blue-600 hover:bg-blue-700 hover:scale-110 text-white font-bold py-2 z-10 px-3 rounded shadow-md transition duration-300"
          onClick={() => setIsOpen(false)}
        >
          X
        </button>

        <div className="relative w-full h-40">
          <span className="block break-words text-center font-bold text-blue-700">
            {user.username}
          </span>
          <Card.Img
            variant="top"
            src="https://upload.wikimedia.org/wikipedia/commons/0/0f/Kew_Gardens_Pagoda.jpg"
            className="w-full h-52 object-contain hover:cursor-pointer"
          />
        </div>

        <Card.Body className="flex flex-col gap-6 p-4">
          <br />
          <br />

          {/* Name Update Form */}
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
              className="w-fit text-sm self-end bg-blue-600 hover:bg-blue-700 text-white"
            >
              Update Info
            </Button>
          </form>

          {/* Password Section (Separate) */}
          <div className="border-t border-gray-300 pt-4">
            <label className="font-semibold block mb-1 text-gray-700">
              Change Password
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                className="border-2 border-blue-500 flex-grow p-2 rounded"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                maxLength={255}
                placeholder="Enter new password"
              />
              <Button
                variant="secondary"
                className="text-sm bg-blue-500 hover:bg-blue-600 text-white"
                onClick={handleChangePassword}
              >
                Update
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
