import "./BTU.sol";

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
      uint			               _quantity;
      string                   _metaDataLink;
      address                  _owner;
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

     function publishAvailability (uint _commission, uint _endDateTs, uint _freeCancelDateTs, string _metaDataLink, uint _minDeposit, address _owner, uint _quantity, uint _resourceId, uint _startDateTs, uint _type) public {
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
            _owner: _owner
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

    function ReadAvailability(uint _availabilityId) view public returns (uint, uint, uint, string, uint, address, uint, uint, uint, uint) {
        availability storage a = availabilities[_availabilityId];
        return (a._commission, a._endDateTs, a._freeCancelDateTs, a._metaDataLink, a._minDeposit, a._owner, a._quantity, a._resourceId, a._startDateTs, a._type);
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

