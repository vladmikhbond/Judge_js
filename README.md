
Accepts: POST, application/json, example { "code": "...source...", "timeout": 2000 }

Returns a message, content-type: text/plain.

This message starts with "OK" "Wrong" or "Error".

   OK = method "Main" in code returns 0 or throws new Exception("OK") 

   Wrong = method "Main" in code throws new Exception("....") 

   Error = compile errors exists
