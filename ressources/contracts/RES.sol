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
    uint		     _quantity;
    string                   _metaDataLink;
    bytes32                   _messageHash;
    bytes                    _signature;
  }

  struct reservation {
    address			_clientAddress;
    uint		_offerId;
    BookingStatus               _bookingStatus;
    bytes32                     _reservationHash;
  }


  address BTUAddress = 0x345ca3e014aaf5dca488057592ee47305d9b3e10;
  uint availabilitiesNextId = 0;
  uint reservationsNextId = 0;

  mapping (uint => availability) availabilities;
  uint[] public availabilitiesIds;

  mapping (uint => reservation) reservations;
  uint[] public reservationsIds;

  function publishAvailability (uint _commission, uint _endDateTs, uint _freeCancelDateTs, bytes32  _messageHash, string _metaDataLink, uint _minDeposit, uint _quantity, uint _resourceId, bytes _signature, uint _startDateTs, uint _type) public {
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
	  _messageHash: _messageHash,
	  _signature: _signature
	  });

    availabilitiesIds.push(availabilitiesNextId);
    availabilitiesNextId++;
  }

  function size() returns (uint) {
    return availabilitiesNextId;
  }


  function ListAvailabilities(/*address _requester, string _criterias*/) public constant returns (uint[]) {
    return availabilitiesIds;
  }

  function ReadAvailability(uint _availabilityId) view public returns (uint, uint, uint, bytes32, string, uint, uint, uint, bytes, uint, uint) {
    availability storage a = availabilities[_availabilityId];
    return (a._commission, a._endDateTs, a._freeCancelDateTs, a._messageHash, a._metaDataLink, a._minDeposit, a._quantity, a._resourceId, a._signature, a._startDateTs, a._type);
  }

  function getAvailabilityCaution(uint _availabilityId) view public returns (uint) {
    availability storage a = availabilities[_availabilityId];
    return (a._minDeposit - a._commission);
  }

  function ReadReservation(uint _reservationId) view public returns (BookingStatus, address, uint, bytes32) {
    reservation storage a = reservations[_reservationId];
    return (a._bookingStatus, a._clientAddress, a._offerId, a._reservationHash);
  }

  function requestReservation(uint _availabilityId, address _requester) public {
  approvalTransfer(msg.sender, address(this), getAvailabilityCaution(_availabilityId));
  //simpleTransfer();
  reservations[reservationsNextId] = reservation({
    _clientAddress: msg.sender,
    _offerId: _availabilityId,
    _bookingStatus: BookingStatus.REQUESTED,
    _reservationHash: 0
    });

  reservationsIds.push(reservationsNextId);
  reservationsNextId++;
  }

  function ListReservations(/*address _requester, string _criterias*/) public constant returns (uint[]) {
    return reservationsIds;
  }

  function confirmReservation(bool validate, address _owner, uint _reservationId) public returns (bool success) {
   uint _offerId = reservations[_reservationId]._offerId;
   address _to = reservations[_reservationId]._clientAddress; //booker address

    if(!validate)
      _to = recover(availabilities[_offerId]._messageHash, availabilities[_offerId]._signature);

    return basicTransfer(_to, getAvailabilityCaution(_offerId));
    }

  function approvalTransfer(address _from, address _to, uint _value) public returns (bool success) {
    BTU btu = BTU(BTUAddress);
    return btu.transferFrom(_from, _to, _value);
  }

  function basicTransfer(address _to, uint256 _value) public returns (bool success){
    BTU btu = BTU(BTUAddress);
    return btu.transfer(_to, _value);
  }

  function GetBTUTotalSupply() public constant returns (uint) {
    BTU btu = BTU(BTUAddress);
    return btu.totalSupply();
  }

  function GetBTUAddress() public constant returns (address) {
    return BTUAddress;
  }

  function recover(bytes32 hash, bytes sig) public pure returns (address) {
    bytes32 r;
    bytes32 s;
    uint8 v;

    //Check the signature length
    if (sig.length != 65) {
      return (address(0));
    }

    // Divide the signature in r, s and v variables
    assembly {
      r := mload(add(sig, 32))
      s := mload(add(sig, 64))
      v := byte(0, mload(add(sig, 96)))
    }

    // Version of signature should be 27 or 28, but 0 and 1 are also possible versions
    if (v < 27) {
      v += 27;
    }

    // If the version is correct return the signer address
    if (v != 27 && v != 28) {
      return (address(0));
    } else {
      return ecrecover(hash, v, r, s);
    }
  }
}
