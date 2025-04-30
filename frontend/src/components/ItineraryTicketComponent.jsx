import React from 'react'

export default function ItineraryTicketComponent({ ticket }) {
  return (
    <div className="flex flex-col border-2 h-full items-center w-48 rounded-lg">
      <div>
        Date: {ticket.date}
      </div>
      <div className='text-center'>
        Morning
        <div>
          {
            ticket.Morning
            ? ticket.Morning.map((activity) => {
              return (
                <p>{activity}</p>
              )
            })
            : <p>No activities in the morning</p>
          }
        </div>
      </div>
      <div className='text-center'>
        Afternoon
        <div>
          {
            ticket.Afternoon
            ? ticket.Afternoon.map((activity) => {
              return (
                <p>{activity}</p>
              )
            })
            : <p>No activities in the afternoon</p>
          }
        </div>
      </div>
      <div className='text-center'>
        Evening
        <div>
          {
            ticket.Evening
            ? ticket.Evening.map((activity) => {
              return (
                <p>{activity}</p>
              )
            })
            : <p>No activities in the evening</p>
          }
        </div>
      </div>
    </div>
  )
}
