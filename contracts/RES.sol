
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
        uint			         _quantity;
    	string                   _metaDataLink;
    }

    struct reservation {
        address			_clientAddress;
        availability		_offer;
	    BookingStatus    _bookingStatus;
    }


    availability[] public availabilities;
    reservation[] public reservations;

    function publishAvailabilities (availability[] _availability, bytes32 _signatureProof) public constant {
            uint arrayLength = availabilities.length;

            for (uint i=0; i < arrayLength; i++) {
                availabilities.push(_availability[i]);
            }
    }

    function ListAvailabilities(address _requester, string _criterias) public constant returns (availability[]) {
        return availabilities;
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

    function confirmReservation(address _owner, reservation _reservation) public constant returns (uint status) {
        return 1;
    }
}
