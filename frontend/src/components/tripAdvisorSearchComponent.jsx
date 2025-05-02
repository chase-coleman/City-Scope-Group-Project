import React from 'react'
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';


const TripAdvisorComponent = ({ locinfo }) => {

    if (!locinfo || typeof locinfo !== 'object') {
        return //<div>No info to display</div>
      }
    
      return (
        <div>
          {Object.entries(locinfo).map(([locationId, instance]) => {
            const { details, photos } = instance;
            const name = details?.name || "Unnamed Location";
            const description = details?.description || "No description available";
            const type = details?.category?.localized_name || "Place";
            const rating = details?.rating;
            const photoList = photos?.data || [];
    
            return (
              <div key={locationId}>
                                {photoList.length > 0 && (
                  <div>
               <Container fluid className="p-0">
                    <div className="flex w-full overflow-x-auto gap-1">
                        {photoList.map((photo, idx) => (
                        <Image
                            key={idx}
                            src={photo.images.small.url}
                            alt={photo.caption || "Photo"}
                            className="h-auto w-auto max-h-48 object-contain"
                            rounded
                        />
                        ))}
                    </div>
                </Container>
                  </div>
                )}
                <h2>{name}</h2>
                <p><strong>Type:</strong> {type}</p>
                {rating && <p><strong>Rating:</strong> {rating}</p>}
                <p>{description}</p>
    
                {details?.web_url && (
                  <p>
                    <a href={details.web_url} target="_blank" rel="noopener noreferrer">
                      View on TripAdvisor
                    </a>
                  </p>
                )}
    

                <hr />
              </div>
            );
          })}
        </div>
      );
    };
export default TripAdvisorComponent;