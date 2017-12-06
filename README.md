[![CircleCI](https://circleci.com/gh/tonyliu7870/aws-lambda-configuration-js.svg?style=svg)](https://circleci.com/gh/tonyliu7870/aws-lambda-configuration-js)  

[aws-lambda-configuration front page](https://github.com/tonyliu7870/aws-lambda-configuration)    
  
## Pre-requirement  
Deployed the core: [aws-lambda-configuration-core](https://github.com/tonyliu7870/aws-lambda-configuration-core)  
  
## Permission Required  
Your lambda execution role will require the following permissions:  
Core-related functions: (get(), set(), has(), delete(), deleteDocument())  
- `lambda:InvokeFunction`  
  
Direct functions:  (getDirect(), setDirect(), hasDirect(), deleteDirect(), deleteDocumentDirect())  
- `dynamodb:GetItem`  
- `dynamodb:PutItem`  
- `dynamodb:UpdateItem`  
- `dynamodb:DeleteItem`  
  
Encryption functions:  (encrypt(), decrypt(), encryptKEK(), decryptKEK())  
According to AWS, you should add your lambda execution role into the key policy's "Key Users".  
  
## API Document  
[https://tonyliu7870.github.io/aws-lambda-configuration-js/](https://tonyliu7870.github.io/aws-lambda-configuration-js/)  
