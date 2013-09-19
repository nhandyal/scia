Southern California Indo Americans
====

#Rest API

<table>
  <tr>
    <th width="30%">Operation</th>
    <th width="40%">Description</th>
    <th width="30%">URL Schema</th>
  </tr>
  <tr>
    <td>
      getUserData.<br/>
      Event verification for board
    </td>
    <td>
      if(auth memberID == URL ID || board){
        return user details.
        return events that user is attending
      }
      else{
        redirect to /
      }
    </td>
    <td>
      /memberID <br/>
      [[get]]
    </td>
  </tr>
  <tr>
    <td>
      getEvents
    </td>
    <td>
      return events within the specified start and end parameters. If date params are ommitted, return all future events.
    </td>
    <td>
      /d1/events?start&end<br/>
      [[get]]
    </td>
  </tr>
  <tr>
    <td>
      getEventDetails
    </td>
    <td>
      return details for event = eventID
    </td>
    <td>
      /d1/events?eventID<br/>
      [[get]]
    </td>
  </tr>
  <tr>
    <td>
      buyEventTickets
    </td>
    <td>
      <a href="#buy-event-tickets">Form Data</a><br/>
      Return ticketID on success or failure on error
    </td>
    <td>
      /d1/events?eventID<br/>
      form-data [[post]]
    </td>
  </tr>
  <tr>
    <td>
      stageMembership
    </td>
    <td>
      <a href="#stage-membership">Form Data</a><br/>
      Process membership request - create unverified stub in DB and sends verification email.
      Does not bill credit card. Returns success state to client.
    </td>
    <td>
      /d1/register <br/>
      form-data [[post]]
    </td>
  </tr>
  <tr>
    <td>
      commitMembership
    </td>
    <td>
      <a href="#commit-membership">Form Data</a><br/>
      Verify stub in DB. Bill Credit Card. Send auth cookie.
    </td>
    <td>
      /d1/register?action=vrf<br/>
      form-data [[post]]
    </td>
  </tr>
  <tr>
    <td>
      login
    </td>
    <td>
      <a href="#login">Form Data</a><br/>
      Authenticates the login request.
      Return auth cookie on success, error message on failure.
    </td>
    <td>
      /d1/login <br/>
      form-data [[post]]
    </td>
  </tr>
  <tr>
    <td>
      logout
    </td>
    <td>
      delete auth cookie
    </td>
    <td>
      /d1/logout <br/>
      [[post]]
    </td>
  </tr>
</table>

##Forms

###Buy Event Tickets
* first_name : String
* last_name : String
* email : String
* member_ID : Int (blank for non-members)
* stripe_token : String


###Stage Membership
* first_name : String
* last_name : String
* email : String
* mobile_number : Int (in the format xxxxxxxxxx)
* major : String
* year : {freshman, sophomore, junior, senior, graduate} - String
* password : String
* stripe_token : String


###Commit Membership
* email : String
* vrf_code : String (5 chars)


###Login
* email : String
* password : String
