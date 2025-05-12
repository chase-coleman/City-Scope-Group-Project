
export default function PotluckPlacardComponent({ activityObject, stayAdder, activityAdder }) {

  return (
    <>
      <div className="flex items-center justify-center w-full px-2">
        <div className="flex items-center gap-2 h-20 overflow-x-auto w-full whitespace-nowrap">
          <img src={activityObject.image_main} className="h-16 w-16 shrink-0" />
          <div className="flex flex-col">
            <div className="mb-0">{activityObject.name}</div>
            <div className="mb-0">{activityObject.location}</div>
            <a href={activityObject.link ? activityObject.link : activityObject.url}>Link to place</a>
          </div>
          <div className="text-center shrink-0 ml-auto">
            {
              stayAdder
              ? <button onClick={() => stayAdder(activityObject)} className=''><img src="/addCircle.svg" alt="circle" className="h-12 w-12"/></button>
              : <button onClick={() => activityAdder(activityObject)} className=''><img src="/addCircle.svg" alt="circle" className="h-12 w-12"/></button>
            }
          </div>
        </div>
      </div>
    </>
  )
}
