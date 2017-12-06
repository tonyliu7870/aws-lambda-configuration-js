[![CircleCI](https://circleci.com/gh/tonyliu7870/aws-lambda-configuration-js.svg?style=svg)](https://circleci.com/gh/tonyliu7870/aws-lambda-configuration-js)  

[aws-lambda-configuration front page](https://github.com/tonyliu7870/aws-lambda-configuration)    
  
## Pre-requirement  
Deployed the core: [aws-lambda-configuration-core](https://github.com/tonyliu7870/aws-lambda-configuration-core)  
  
## Permission Required  
Your lambda execution role will require the following permissions:  
Core-related functions: (get(), has(), set({mode:'core'}), delete({mode:'core'}), deleteDocument({mode:'core'}))  
- `lambda:InvokeFunction`  
  
Direct functions:  (get({mode:'direct'}, has({mode:'direct'}), set(), delete(), deleteDocument())  
- `dynamodb:GetItem`  
- `dynamodb:PutItem`  
- `dynamodb:UpdateItem`  
- `dynamodb:DeleteItem`  
  
Encryption functions:  (encrypt(), decrypt(), encryptKEK(), decryptKEK())  
According to AWS guideline, you should add your lambda execution role into the key policy's "Key Users".  
  
## API Document  
[https://tonyliu7870.github.io/aws-lambda-configuration-js/](https://tonyliu7870.github.io/aws-lambda-configuration-js/)  
