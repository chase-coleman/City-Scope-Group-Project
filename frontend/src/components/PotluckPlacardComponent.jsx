import React from 'react'

export default function PotluckPlacardComponent({ activityObject, stayAdder, activityAdder }) {
  return (
    <>
      <div className="flex items-center justify-center border-2 w-full p-2">
        <div className="flex items-center justify-center gap-2 h-36">
          <img src={activityObject.image_main} className="h-20 w-20" />
          <div className="flex flex-col">
            <p className="mb-0">{activityObject.name}</p>
            <p className="mb-0">{activityObject.location}</p>
            <a href={activityObject.link ? activityObject.link : activityObject.url}>Link to place</a>
          </div>
          <div className="text-center">
            {
              stayAdder
              ? <button onClick={() => stayAdder(activityObject)}>add to iti</button>
              : <button onClick={() => activityAdder()}>add to acitvi</button>
            }
          </div>
        </div>
      </div>
    </>
  )
}
