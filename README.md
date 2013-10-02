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
      Event verification for board. <br/>
      login required
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
      Checkout
    </td>
    <td>
      <a href="#checkout">Form Data</a><br/>
      return transaction status
    </td>
    <td>
      /d1/checkout<br/>
      form-data [[post]]
    </td>
  </tr>
  <tr>
    <td>
      createAccount
    </td>
    <td>
      <a href="#stage-membership">Form Data</a><br/>
      Process membership request - create unverified account in DB and sends verification email.
      User account has been created at this point and they can login to the site.
      Returns success state to client.
    </td>
    <td>
      /d1/register <br/>
      form-data [[post]]
    </td>
  </tr>
  <tr>
    <td>
      verifyAccount <br/>
      login required
    </td>
    <td>
      <a href="#commit-membership">Form Data</a><br/>
      Verify user account. Returns success state to client.
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

###Checkout
In a JSON Encoded String
* f_name : String
* l_name : String
* email : String
* card_id : Int (blank for non-members)
* stripe_token : String
* cart : { eventID : String, quantity : Int }


###Stage Membership
* f_name : String
* l_name : String
* email : String
* mobile : Int (in the format xxxxxxxxxx)
* major : String
* year : {freshman, sophomore, junior, senior, graduate} - String
* pwd : String (password - no encryption)


###Commit Membership
* vrf_token : String (6 chars) <br/>
account email is automatically parsed from authToken


###Login
* email : String
* pwd : String (password - no encryption)
