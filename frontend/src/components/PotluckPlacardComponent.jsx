export default function PotluckPlacardComponent({
  activityObject,
  stayAdder,
  activityAdder,
}) {
  return (
    <>
      <div className="flex bg-white items-center justify-center w-full px-2 border-2 border-[#B2A9CF]">
        <div className="flex items-center gap-2 h-20 overflow-x-auto w-full whitespace-nowrap">
          <img src={activityObject.image_main} className="h-16 w-16 shrink-0" />
          <div className="flex flex-col text-[#091A55]">
            <div className="mb-0">{activityObject.name}</div>
            <div className="mb-0">{activityObject.location}</div>
            <a
              href={
                activityObject.link ? activityObject.link : activityObject.url
              }
              className="text-[#4151B3] hover:text-[#091A55]"
            >
              Link to place
            </a>
          </div>
          <div className="text-center shrink-0 ml-auto">
            {stayAdder ? (
              <button
                onClick={() => stayAdder(activityObject)}
                className="hover:scale-105 transition"
              >
                <img
                  src="/addCircle.svg"
                  alt="circle"
                  className="h-12 w-12 filter drop-shadow-md"
                />
              </button>
            ) : (
              <button
                onClick={() => activityAdder(activityObject)}
                className="hover:scale-105 transition"
              >
                <img
                  src="/addCircle.svg"
                  alt="circle"
                  className="h-12 w-12 filter drop-shadow-md"
                />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
