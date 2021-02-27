import { Button, Input, Typography } from '@material-ui/core';
import { useState } from 'react';

const Homepage = () => {
    const [birthday, setBirthday] = useState('');
    const [name, setName] = useState('');
    var gapi = window.gapi
    /* 
      Update with your own Client Id and Api key 
    */
    var CLIENT_ID = "116343979198-d7ujmu82t4bmjafvciqvoabsf1kllaa5.apps.googleusercontent.com"
    var API_KEY = process.env.REACT_APP_API_KEY
    var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
    var SCOPES = "https://www.googleapis.com/auth/calendar.events"

    const handleClick = () => {
        gapi.load('client:auth2', () => {
            console.log('loaded client')

            gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                discoveryDocs: DISCOVERY_DOCS,
                scope: SCOPES,
            })

            gapi.client.load('calendar', 'v3', () => console.log('bam!'))
            console.log(birthday)
            var description = `Today is ${name}´s birthday`
            console.log(birthday.slice(5))
            var startDate = `2021-${birthday.slice(5)}T00:00:00-00:00`
            var endDate = `2021-${birthday.slice(5)}T00:00:00-21:59`
            gapi.auth2.getAuthInstance().signIn()
                .then(() => {

                    var event = {
                        'summary': 'Birthday!',
                        'location': 'Earth ',
                        'description': description,
                        'start': {
                            'dateTime': startDate,
                            'timeZone': "Europe/Amsterdam",

                        },
                        'end': {
                            'dateTime': endDate,
                            'timeZone': "Europe/Amsterdam",

                        },
                        'recurrence': [
                            'RRULE:FREQ=YEARLY;COUNT=30'
                        ],
                        'attendees': [
                            // { 'email': 'anthony.sherrill@code.berlin' },
                            { 'email': 'darjusch.schrand@code.berlin' },
                        ],
                        'reminders': {
                            'useDefault': false,
                            'overrides': [
                                { 'method': 'email', 'minutes': 24 * 60 },
                                { 'method': 'popup', 'minutes': 10 }
                            ]
                        }
                    }

                    var request = gapi.client.calendar.events.insert({
                        'calendarId': 'primary',
                        'resource': event,
                    })

                    request.execute(event => {
                        console.log(event)
                        window.open(event.htmlLink)
                    })


                    /*
                        Uncomment the following block to get events
                    */
                    /*
                    // get events
                    gapi.client.calendar.events.list({
                      'calendarId': 'primary',
                      'timeMin': (new Date()).toISOString(),
                      'showDeleted': false,
                      'singleEvents': true,
                      'maxResults': 10,
                      'orderBy': 'startTime'
                    }).then(response => {
                      const events = response.result.items
                      console.log('EVENTS: ', events)
                    })
                    */


                })
        })
    }
    return (
        <div className="homepage">
            <Typography variant="h2" style={{ marginTop: "5%" }}>Birthday tracker</Typography>
            <div className="submit-birthday" style={{ margin: "20%" }}>
                <form>
                    <Input
                        className="input-field"
                        type="text"
                        placeholder="Eric Hansen"
                        value={name}
                        onChange={(e) => setName(e.target.value)}>
                    </Input>
                    <br />
                    <Input
                        className="input-field"
                        type="date"
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)}>
                    </Input>
                </form>
                <Button className="submit-button" color="primary" onClick={handleClick} disabled={!birthday || !name}>Submit</Button>
            </div>
        </div>
    );
}

export default Homepage;

{/* <form>
        <label>
          Is going:
          <input
            name="isGoing"
            type="checkbox"
            checked={this.state.isGoing}
            onChange={this.handleInputChange} />
        </label>
        <br />
        <label>
          Number of guests:
          <input
            name="numberOfGuests"
            type="number"
            value={this.state.numberOfGuests}
            onChange={this.handleInputChange} />
        </label>
      </form> */}