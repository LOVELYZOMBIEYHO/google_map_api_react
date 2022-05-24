# It is a project using Google Map Api and ReactJS

you should turn on the following Google Apis:

1. Directions API
2. Geocoding API
3. Geolocation API
4. Maps JavaScript API
5. Places API
6. Time Zone API

And replace the Google Map API- (process.env.REACT_APP_GOOGLE_MAP_API_KEY)

Demo:(no API KEY for use)

since no API KEY, it may not be shown in Chrome, but may show in Safari.
You can also touch the map to test the functions.

https://google-map-api-react.herokuapp.com/


!!!importance, turn on these API may charge much, be cafeful any useState and useEffect change may cause many requests and charge much.
Every API must cap the maximum daily billable limit: https://developers.google.com/maps/faq#usage_cap
