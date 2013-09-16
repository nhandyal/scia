Southern California Indo Americans (SCIA)
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
      Form Data <br/>
      First Name <br/>
      Last Name <br/>
      Email <br/>
      Member ID (empty for non-members)<br/>
      Stripe Token<br/>
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
      Verify stub in DB. Bill Credit Card. Send auth cookie.
    </td>
    <td>
      /d1/register?action=vrf&email&vrf_code<br/>
      [[post]]
    </td>
  </tr>
  <tr>
    <td>
      login
    </td>
    <td>
      Authenticates the login request.
      Return auth cookie on success, error message on failure.
    </td>
    <td>
      /d1/login <br/>
      form-details [[post]]
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
