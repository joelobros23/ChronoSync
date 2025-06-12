// assets/js/events.js

document.addEventListener('DOMContentLoaded', () => {
  // Event Creation Form Handling
  const eventForm = document.getElementById('create-event-form');
  if (eventForm) {
    eventForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const eventName = document.getElementById('event-name').value;
      const description = document.getElementById('event-description').value;
      const location = document.getElementById('event-location').value;
      const startTime = document.getElementById('event-start-time').value;
      const endTime = document.getElementById('event-end-time').value;

      const formData = new FormData();
      formData.append('event_name', eventName);
      formData.append('description', description);
      formData.append('location', location);
      formData.append('start_time', startTime);
      formData.append('end_time', endTime);

      try {
        const response = await fetch('api/create_event.php', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();

        if (data.success) {
          alert('Event created successfully!');
          window.location.href = 'events.html'; // Redirect to events page
        } else {
          alert('Error creating event: ' + data.message);
        }
      } catch (error) {
        console.error('Error creating event:', error);
        alert('Error creating event. Please try again.');
      }
    });
  }

  // Event Display (Listing Events)
  const eventsList = document.getElementById('events-list');
  if (eventsList) {
    const fetchEvents = async () => {
      try {
        const response = await fetch('api/get_events.php');
        const data = await response.json();

        if (data.success && data.events) {
          data.events.forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.classList.add('event-item');
            eventElement.innerHTML = `
              <h3>${event.event_name}</h3>
              <p>${event.description}</p>
              <p>Location: ${event.location}</p>
              <p>Time: ${event.start_time} - ${event.end_time}</p>
              <a href="view_event.html?id=${event.id}">View Details</a>
            `;
            eventsList.appendChild(eventElement);
          });
        } else {
          eventsList.innerHTML = '<p>No events found.</p>';
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        eventsList.innerHTML = '<p>Error loading events. Please try again.</p>';
      }
    };

    fetchEvents();
  }

  // Event Details and RSVP
  const eventDetailsContainer = document.getElementById('event-details');
  if (eventDetailsContainer) {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');

    const fetchEventDetails = async (eventId) => {
      try {
        const response = await fetch(`api/get_event_details.php?id=${eventId}`);
        const data = await response.json();

        if (data.success && data.event) {
          const event = data.event;

          eventDetailsContainer.innerHTML = `
            <h2>${event.event_name}</h2>
            <p>${event.description}</p>
            <p>Location: ${event.location}</p>
            <p>Time: ${event.start_time} - ${event.end_time}</p>
            <button id="rsvp-going" data-rsvp="going">Going</button>
            <button id="rsvp-interested" data-rsvp="interested">Interested</button>
            <button id="rsvp-not-going" data-rsvp="not_going">Not Going</button>
          `;

          // RSVP Event Listener
          document.getElementById('rsvp-going').addEventListener('click', () => rsvpEvent(eventId, 'going'));
          document.getElementById('rsvp-interested').addEventListener('click', () => rsvpEvent(eventId, 'interested'));
          document.getElementById('rsvp-not-going').addEventListener('click', () => rsvpEvent(eventId, 'not_going'));


        } else {
          eventDetailsContainer.innerHTML = '<p>Event not found.</p>';
        }
      } catch (error) {
        console.error('Error fetching event details:', error);
        eventDetailsContainer.innerHTML = '<p>Error loading event details. Please try again.</p>';
      }
    };

    const rsvpEvent = async (eventId, rsvpStatus) => {
      try {
        const formData = new FormData();
        formData.append('event_id', eventId);
        formData.append('rsvp_status', rsvpStatus);

        const response = await fetch('api/rsvp_event.php', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();

        if (data.success) {
          alert('RSVP updated successfully!');
          fetchEventDetails(eventId); // Refresh event details after RSVP
        } else {
          alert('Error updating RSVP: ' + data.message);
        }
      } catch (error) {
        console.error('Error updating RSVP:', error);
        alert('Error updating RSVP. Please try again.');
      }
    };

    fetchEventDetails(eventId);
  }
});