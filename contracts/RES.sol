pragma solidity ^0.4.19;
pragma experimental ABIEncoderV2;

contract RES {
  enum BookingStatus { REQUESTED, REJECTED, CONFIRMED, CANCELLED  }
  struct availability {
    uint                     _resourceId;
    uint                     _type;
    uint                     _minDeposit;
    uint                     _commission;
    uint                     _freeCancelDateTs;
    uint                     _startDateTs;
    uint                     _endDateTs;
    uint		     _quantity;
    string                   _metaDataLink;
    bytes                    _signature;
  }

  struct reservation {
    address			_clientAddress;
    availability		_offer;
    BookingStatus               _bookingStatus;
    bytes32                     _reservationHash;
  }


  uint availabilitiesNextId = 0;

  mapping (uint => availability) availabilities;
  uint[] public availabilitiesIds;

  reservation[] public reservations;

  function publishAvailability (uint _commission, uint _endDateTs, uint _freeCancelDateTs, string _metaDataLink, uint _minDeposit, uint _quantity, uint _resourceId, bytes _signature, uint _startDateTs, uint _type) public {
    availabilities[availabilitiesNextId] = availability({
      _resourceId: _resourceId,
	  _type: _type,
	  _minDeposit: _minDeposit,
	  _commission: _commission,
	  _freeCancelDateTs: _freeCancelDateTs,
	  _startDateTs: _startDateTs,
	  _endDateTs: _endDateTs,
	  _quantity: _quantity,
	  _metaDataLink: _metaDataLink,
	  _signature: _signature
	  });

    availabilitiesIds.push(availabilitiesNextId);
    availabilitiesNextId++;
  }

  function size() returns (uint) {
    return availabilitiesNextId;
  }


  function ListAvailabilities(/* address _requester, string _criterias */) public constant returns (uint[]) {
    return availabilitiesIds;
  }

  function ReadAvailability(uint _availabilityId) view public returns (uint, uint, uint, string, uint, uint, uint, bytes, uint, uint) {
    availability storage a = availabilities[_availabilityId];
    return (a._commission, a._endDateTs, a._freeCancelDateTs, a._metaDataLink, a._minDeposit, a._quantity, a._resourceId, a._signature, a._startDateTs, a._type);
  }

  function ListReservations(address _requester, string _criterias) public constant returns (reservation[]) {
    return reservations;
  }


  function requestReservation(address _requester, availability _availability) public constant returns (uint status) {
    reservations.push(reservation({
	_clientAddress: _requester,
	    _offer: _availability,
	    _bookingStatus: BookingStatus.REQUESTED,
	    _reservationHash: 0
	    }));


    return 1;
  }

  function confirmReservation(address _owner, uint _reservationId) public constant returns (uint status) {
    return 1;
  }




  /* EXPERIMENTAL ZONE */


}
