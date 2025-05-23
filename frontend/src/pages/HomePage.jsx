import React, { useEffect, useState } from "react";
import { useOutletContext, useNavigate, useLoaderData, href } from "react-router-dom";
import {grabLocID} from '../utilities/TripAdvisorUtils'
import sample from '../utilities/sampleObject.json'
import TripAdvisorComponent from "../components/tripAdvisorSearchComponent";
import {photoarr} from '../utilities/photoarr'
import "../App.css"
const HomePage = () => {

  const [logError, setLogError] = useState("");
  const [results,setResults] = useState([sample]);
  const [photoArr,setPhotoArr] = useState([])
  const {user} = useOutletContext()
  const navigate = useNavigate()

  const shuffleArray = (array) => {
    const shuffled = array.slice(); // create a copy to avoid mutating original
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    const shuffledPhotos = shuffleArray(photoarr);
    setPhotoArr(shuffledPhotos);
  }, []);


    useEffect(() => {
      const timeout = setTimeout(() => {
        setLogError("");
      }, 2000);
      return () => clearTimeout(timeout);
    }, [logError]);

  const loginOrSignup = () => {
    navigate('/login')
  }

  const startExploring = () => {
    navigate('/trips')
  }

  return (

<>

<br />
    <div className="h-1/3 p-6 flex flex-col">
      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl mx-auto flex-1">
        {/* Left Column */}
        <div className="flex flex-1">
          <div className="flex flex-col gap-6 items-center mt-[20vh] mx-auto">
            <div>
            <h1 className="!text-[#00005A] !text-[3em] text-center font-semibold">City Scope</h1>
            <h5 className="!text-[#00005A] text-center">The <span className="text-purple-600">World</span> is Waiting...</h5>
            </div>
            <div className="flex gap-2">
             {user== false?(
              <button className="button-background p-1 text-center text-white" onClick={loginOrSignup}>
              Login or Register
              </button>
             ):<button className="button-background p-1 text-white" onClick={startExploring}>Start Exploring</button>}
            </div>
          </div>
        </div>


        <div className="border-3 border-gray-800 rounded-3xl flex items-center justify-center bg-white h-[75vh] w-[85vh] overflow-hidden">
  <div className="w-full h-full overflow-hidden">
    <div className="flex flex-col h-full -rotate-30 scale-150">


      <div className="flex h-[25.25vh]"> 
        <div className="border-2 border-white flex-1 overflow-hidden">
          <img src={photoArr[0]} alt="Image 1" className="w-full h-full object-cover" />
        </div>
        <div className="border-2 border-white flex-1 overflow-hidden">
          <img src={photoArr[1]} alt="Image 2" className="w-full h-full object-cover" />
        </div>
      </div>


      <div className="flex h-[26.5vh]">
        <div className="border-2 border-white flex-1 overflow-hidden">
          <img src={photoArr[2]} alt="Image 3" className="w-full h-full object-cover" />
        </div>
        <div className="border-2 border-white flex-1 overflow-hidden">
          <img src={photoArr[3]} alt="Image 4" className="w-full h-full object-cover" />
        </div>
        <div className="border-2 border-white flex-1 overflow-hidden">
          <img src={photoArr[4]} alt="Image 5" className="w-full h-full object-cover" />
        </div>
      </div>


      <div className="flex h-[23.25vh]">
        <div className="border-2 border-white flex-1 overflow-hidden">
          <img src={photoArr[5]} alt="Image 6" className="w-full h-full object-cover" />
        </div>
        <div className="border-2 border-white flex-1 overflow-hidden">
          <img src={photoArr[6]} alt="Image 7" className="w-full h-full object-cover" />
        </div>
      </div>
</div>
    </div>
  </div>
</div>
</div>
</>
)  
}

export default HomePage