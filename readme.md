# OmniExotel - Exotel Client SDK

#### Installation:
 
```shell script
npm i @shoppredigital/omniexotel --save
```

#### Usage:

```js
const omniexotel = require('@shoppredigital/omniexotel');

const customerMobileNumber = '9900990099';
const agentMobileNumber = '9988998899';
const exotelPhoneNumvber = '022445566';
omniexotel.connect(agentMobileNumber, exotelPhoneNumvber, customerMobileNumber)
