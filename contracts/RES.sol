<<<<<<< HEAD
=======
import "./BTU.sol";


>>>>>>> contract
pragma solidity ^0.4.19;
pragma experimental ABIEncoderV2;

contract RES {
<<<<<<< HEAD
  enum BookingStatus { REQUESTED, REJECTED, CONFIRMED, CANCELLED  }
  struct availability {
    uint                     _resourceId;
    uint                     _type;
    uint                     _minDeposit;
    uint                     _commission;
    uint                     _freeCancelDateTs;
    uint                     _startDateTs;
    uint                     _endDateTs;
    uint			         _quantity;
    string                   _metaDataLink;
  }

  struct reservation {
    address			_clientAddress;
    availability		_offer;
    BookingStatus    _bookingStatus;
  }

  uint availabilitiesNextId = 0;


  mapping (uint => availability) availabilities;
  uint[] public availabilitiesIds;

  reservation[] public reservations;

  function publishAvailability (uint _commission, uint _endDateTs, uint _freeCancelDateTs, string _metaDataLink, uint _minDeposit, uint _quantity, uint _resourceId, uint _startDateTs, uint _type) public {
    availabilities[availabilitiesNextId] = availability({
      _resourceId: _resourceId,
	  _type: _type,
	  _minDeposit: _minDeposit,
	  _commission: _commission,
	  _freeCancelDateTs: _freeCancelDateTs,
	  _startDateTs: _startDateTs,
	  _endDateTs: _endDateTs,
	  _quantity: _quantity,
	  _metaDataLink: _metaDataLink
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

  function ReadAvailability(uint _availabilityId) view public returns (uint, uint, uint, string, uint, uint, uint, uint, uint) {
    availability storage a = availabilities[_availabilityId];
    return (a._commission, a._endDateTs, a._freeCancelDateTs, a._metaDataLink, a._minDeposit, a._quantity, a._resourceId, a._startDateTs, a._type);
  }

  function ListReservations(address _requester, string _criterias) public constant returns (reservation[]) {
    return reservations;
  }


  function requestReservation(address _requester, availability _availability) public constant returns (uint status) {
    reservations.push(reservation({
	_clientAddress: _requester,
	    _offer: _availability,
	    _bookingStatus: BookingStatus.REQUESTED
	    }));


    return 1;
  }

  function confirmReservation(address _owner, uint _reservationId) public constant returns (uint status) {
    return 1;
  }
}

/* function publishAvailabilities ( */
/* 				  uint     _commission, */
/* 				  uint     _endDateTs, */
/* 				  uint     _freeCancelDateTs, */
/* 				  string   _metaDataLink, */
/* 				  uint     _minDeposit, */
/* 				  address  _ownerAddress, */
/* 				  uint     _quantity, */
/* 				  uint     _resourceId, */
/* 				  uint     _startDateTs, */
/* 				  uint     _type */
/* 				  ) public constant { */
/*   availability memory _availability; */
/*   _availability._commission        = _commission; */
/*   _availability._endDateTs         = _endDateTs; */
/*   _availability._freeCancelDateTs  = _freeCancelDateTs; */
/*   _availability._metaDataLink      = _metaDataLink; */
/*   _availability._minDeposit        = _minDeposit; */
/*   _availability._ownerAddress      = _ownerAddress; */
/*   _availability._quantity          = _quantity; */
/*   _availability._resourceId        = _resourceId; */
/*   _availability._startDateTs       = _startDateTs; */
/*   _availability._type              = _type; */

/*   availabilities.push(_availability); */
/* } */
=======
    enum BookingStatus { REQUESTED, REJECTED, CONFIRMED, CANCELLED  }    
    struct availability {
     uint                     _resourceId;
      uint                      _type;
      uint                     _minDeposit;
      uint                     _commission;
      uint                     _freeCancelDateTs;
      uint                     _startDateTs;
      uint                     _endDateTs;
      uint			               _quantity;
      string                   _metaDataLink;
    }

    struct reservation {
        address			_clientAddress;
        availability		_offer;
	    BookingStatus    _bookingStatus;
    }

    address BTUAddress = 0x345ca3e014aaf5dca488057592ee47305d9b3e10;
    uint availabilitiesNextId = 0;

    mapping (uint => availability) availabilities;
    uint[] public availabilitiesIds;

    reservation[] public reservations;

     function publishAvailability (uint _commission, uint _endDateTs, uint _freeCancelDateTs, string _metaDataLink, uint _minDeposit, uint _quantity, uint _resourceId, uint _startDateTs, uint _type) public {
        availabilities[availabilitiesNextId] = availability({
            _resourceId: _resourceId,
            _type: _type,
            _minDeposit: _minDeposit,
            _commission: _commission,
            _freeCancelDateTs: _freeCancelDateTs,
            _startDateTs: _startDateTs,
            _endDateTs: _endDateTs,
            _quantity: _quantity,
            _metaDataLink: _metaDataLink
	    });
	    availabilitiesIds.push(availabilitiesNextId);
	    availabilitiesNextId++;
    }   

    function GetBTUTotalSupply() public constant returns (uint) {
	BTU btu = BTU(BTUAddress);
        return btu.totalSupply();
    }

    
    function ListAvailabilities(address _requester, string _criterias) public constant returns (uint[]) {
        return availabilitiesIds;
    }

    function ReadAvailability(uint _availabilityId) view public returns (uint, uint, uint, string, uint, uint, uint, uint, uint) {
        availability storage a = availabilities[_availabilityId];
        return (a._commission, a._endDateTs, a._freeCancelDateTs, a._metaDataLink, a._minDeposit, a._quantity, a._resourceId, a._startDateTs, a._type);
    }
    
    function ListReservations(address _requester, string _criterias) public constant returns (reservation[]) {
        return reservations;
    }
    

    function requestReservation(address _requester, availability _availability) public constant returns (uint status) {
        reservations.push(reservation({
                _clientAddress: _requester,
                _offer: _availability,
                _bookingStatus: BookingStatus.REQUESTED
        }));
        
        
        return 1;
    }

    function confirmReservation(address _owner, uint _reservationId) public constant returns (uint status) {
        return 1;
    }
}

>>>>>>> contract
