import { Trash2, ExternalLink } from 'lucide-react';


export default function PotluckPlacardComponent({
  activityObject,
  stayAdder,
  activityAdder,
  stayDeleter,
  activityDeleter
}) {
  return (
    <>
      <div className="flex bg-white items-center justify-center w-full px-2 border-t-1 border-b-1 border-[#B2A9CF]">
        <div className="flex items-center gap-2 h-20 overflow-x-auto w-full whitespace-nowrap">
          <img src={activityObject.image_main} className="h-16 w-16 shrink-0" />
          <div className="flex flex-col text-[#091A55]">
            <div className="mb-0">{activityObject.name}</div>
            <div className="mb-0">{activityObject.location}</div>
            <a
              href={
                activityObject.link ? activityObject.link : activityObject.url
              }
              target="blank"
              className="text-[#4151B3] hover:text-[#091A55] flex items-center"
            >
              Website<ExternalLink size={12}/>
            </a>
          </div>
          <div className="flex flex-col items-center justify-center text-center shrink-0 ml-auto">
            <button
              onClick={() => stayAdder ? stayAdder(activityObject) : activityAdder(activityObject)}
              className="flex items-center justify-center add-sub-button shrink-0 hover:cursor-pointer h-8 w-8"
            >
              <img
                src="/addCircle.svg"
                alt="circle"
                className="rounded-full h-8 w-8"
              />
            </button>
            <button
              onClick={() => stayDeleter ? stayDeleter(activityObject) : activityDeleter(activityObject)}
              className="flex items-center bttn justify-center hover:bg-gradient-to-r hover:from-red-700 hover:to-red-500 hover:text-white hover:shadow-lg rounded-full transition-all shrink-0 hover:cursor-pointer h-8 w-8"
            >
              <Trash2
                className="h-6 w-6"
              />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
