pragma solidity ^0.4.19;
pragma experimental ABIEncoderV2;

contract RES {
  enum BookingStatus { REQUESTED, REJECTED, CONFIRMED, CANCELLED  }
  struct availability {
    address                  _ownerAddress;
    uint                     _resourceId;
    uint                     _type;
    uint                     _minDeposit;
    uint                     _commission;
    uint                     _freeCancelDateTs;
    uint                     _startDateTs;
    uint                     _endDateTs;
    uint		     _quantity;
    string                   _metaDataLink;
  }

  struct reservation {
    address			_clientAddress;
    availability		_offer;
    BookingStatus    _bookingStatus;
  }


  availability[] public availabilities;
  reservation[] public reservations;

  function publishAvailabilities (
				  uint     _commission,
				  uint     _endDateTs,
				  uint     _freeCancelDateTs,
				  string   _metaDataLink,
				  uint     _minDeposit,
				  address  _ownerAddress,
				  uint     _quantity,
				  uint     _resourceId,
				  uint     _startDateTs,
				  uint     _type
				  ) public constant {
    availability memory _availability;
    _availability._commission        = _commission;
    _availability._endDateTs         = _endDateTs;
    _availability._freeCancelDateTs  = _freeCancelDateTs;
    _availability._metaDataLink      = _metaDataLink;
    _availability._minDeposit        = _minDeposit;
    _availability._ownerAddress      = _ownerAddress;
    _availability._quantity          = _quantity;
    _availability._resourceId        = _resourceId;
    _availability._startDateTs       = _startDateTs;
    _availability._type              = _type;

    availabilities.push(_availability);
  }

  function ListAvailabilities(/* address _requester, string _criterias */) public constant returns (availability) {
    return availabilities[0];
  }

  /* function ListReservations(address _requester, string _criterias) public constant returns (reservation[]) { */
  /*   return reservations; */
  /* } */

  /* function requestReservation(address _requester, availability _availability) public constant returns (uint status) { */
  /*   reservations.push(reservation({ */
  /* 	_clientAddress: _requester, */
  /* 	    _offer: _availability, */
  /* 	    _bookingStatus: BookingStatus.REQUESTED */
  /* 	    })); */


  /*   return 1; */
  /* } */

  /* function confirmReservation(address _owner, reservation _reservation) public constant returns (uint status) { */
  /*   return 1; */
  /* } */
}
