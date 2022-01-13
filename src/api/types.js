import api from "./index";

const types = {
  "ResourceConfig": {
    "cpu": "u64",
    "memory": "u64",
    "system": "Vec<u8>",
    "cpu_model": "Vec<u8>"
  },
  "ResourceRentalStatistics": {
    "rental_count": "u32",
    "rental_duration": "u32",
    "fault_count": "u32",
    "fault_duration": "u32"
  },
  "ResourceRentalInfo": {
    "rent_unit_price": "Balance",
    "rent_duration": "BlockNumber",
    "end_of_rent": "BlockNumber"
  },
  "ResourceStatus": {
    "_enum": [
      "Inuse",
      "Locked",
      "Unused",
      "Offline"
    ]
  },
  "ComputingResource": {
    "index": "u64",
    "account_id": "AccountId",
    "peer_id": "Vec<u8>",
    "config": "ResourceConfig",
    "rental_statistics": "ResourceRentalStatistics",
    "rental_info": "ResourceRentalInfo",
    "status": "ResourceStatus"
  },
  "StakingAmount": {
    "amount": "Balance",
    "active_amount": "Balance",
    "lock_amount": "Balance"
  },
  "ResourceOrder": {
    "index": "u64",
    "tenant_info": "TenantInfo",
    "price": "Balance",
    "resource_index": "u64",
    "create": "BlockNumber",
    "rent_duration": "BlockNumber",
    "time": "Duration",
    "status": "OrderStatus",
    "agreement_index": "Option<u64>"
  },
  "TenantInfo": {
    "account_id": "AccountId",
    "public_key": "Bytes"
  },
  "OrderStatus": {
    "_enum": [
      "Pending",
      "Finished",
      "Canceled"
    ]
  },
  "AgreementStatus": {
    "_enum": [
      "Using",
      "Finished",
      "Punished"
    ]
  },
  "RentalAgreement": {
    "index": "u64",
    "provider": "AccountId",
    "tenant_info": "TenantInfo",
    "peer_id": "Vec<u8>",
    "resource_index": "u64",
    "config": "ResourceConfig",
    "rental_info": "ResourceRentalInfo",
    "price": "Balance",
    "lock_price": "Balance",
    "penalty_amount": "Balance",
    "receive_amount": "Balance",
    "start": "BlockNumber",
    "end": "BlockNumber",
    "calculation": "BlockNumber",
    "time": "Duration",
    "status": "AgreementStatus"
  },
  "Duration": {
    "secs": "u64",
    "nanos": "u32"
  }
}
export default types;
