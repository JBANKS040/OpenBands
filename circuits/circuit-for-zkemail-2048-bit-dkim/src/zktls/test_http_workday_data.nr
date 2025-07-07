/**
 * @notice - HTTP response data from the Workday's Payroll page for testing purpose.
 */

// HTTP/1.1 200 OK
// Content-Type: text/xml; charset=utf-8
// Content-Length: 6574
// Date: Sat, 06 Jul 2024 01:12:33 GMT
// Server: Workday

// {
//   "workerId": "12345",
//   "payPeriod": {
//     "start": "2024-06-01",
//     "end": "2024-06-15",
//     "payDate": "2024-06-20"
//   },
//   "grossPay": 6250.00,
//   "netPay": 5025.00,
//   "currency": "USD",
//   "earnings": [
//     {
//       "type": "Regular",
//       "hours": 80,
//       "rate": 78.125,
//       "amount": 6250.00
//     }
//   ],
//   "deductions": [
//     {
//       "type": "Federal Tax",
//       "amount": 950.00
//     },
//     {
//       "type": "Health Insurance",
//       "amount": 275.00
//     }
//   ]
// }


// @notice - Full response (header + body)
pub fn response() -> [u8; 320] {
    [
        // @dev - [TODO]: Add bytes data of Workday HTTP response (of payroll) to here.
    ]
}

//  [72, 84, 84, 80, 47, 49, 46, 49, 32, 50, 48, 48, 32, 79, 75]
pub fn start_line() -> [Field; 15] {
    "HTTP/1.1 200 OK".as_bytes().map(|x| x as Field)
}

// [67, 111, 110, 116, 101, 110, 116, 45, 84, 121, 112, 101, 58, 32, 116, 101, 120, 116, 47, 120, 109, 108, 59, 32, 99, 104, 97, 114, 115, 101, 116, 61, 117, 116, 102, 45, 56]
pub fn header_0() -> [Field; 37] {
    "Content-Type: text/xml; charset=utf-8".as_bytes().map(|x| x as Field)
}

// [67, 111, 110, 116, 101, 110, 116, 45, 76, 101, 110, 103, 116, 104, 58, 32, 54, 53, 55, 52]
pub fn header_1() -> [Field; 20] {
    "Content-Length: 6574".as_bytes().map(|x| x as Field)
}

// [68, 97, 116, 101, 58, 32, 83, 97, 116, 44, 32, 48, 54, 32, 74, 117, 108, 32, 50, 48, 50, 52, 32, 48, 49, 58, 49, 50, 58, 51, 51, 32, 71, 77, 84]
pub fn header_2() -> [Field; 35] {
    "Date: Sat, 06 Jul 2024 01:12:33 GMT".as_bytes().map(|x| x as Field)
}

// [83, 101, 114, 118, 101, 114, 58, 32, 87, 111, 114, 107, 100, 97, 121]
pub fn header_3() -> [Field; 15] {
    "Server: Workday".as_bytes().map(|x| x as Field)
}

pub fn body() -> [u8; 202] {
    [
        // @dev - [TODO]: Add bytes data of Workday HTTP response (of payroll) to here.
    ]
}